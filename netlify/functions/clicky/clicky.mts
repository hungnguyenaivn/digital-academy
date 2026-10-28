import { readFile } from "node:fs/promises";
import path from "node:path";
import Anthropic from "@anthropic-ai/sdk";
import type { Config, Context } from "@netlify/functions";
import { CLICKY_LIMITS, type ChatStreamEvent, type ChatTurn, type ClickyScreenshot } from "../../../src/lib/clicky";
import { consume } from "../chat/rate-limit";

// Clicky: học sinh hỏi, widget chụp trang Digital Academy đang mở và gửi kèm câu hỏi. Function này gắn ảnh vào
// lượt hỏi cuối, gọi Claude với system prompt của Clicky và stream câu trả lời về dạng NDJSON (giống /api/chat).
// Câu trả lời có thể kết thúc bằng thẻ [POINT:x,y:nhãn] để widget cho con trỏ xanh bay tới chỉ vào trang.

export const config: Config = { path: "/api/clicky", method: "POST" };

const MODEL = "claude-opus-5-5";
const EFFORT = "low";
// Cao hơn /api/chat một chút vì model cần đọc ảnh và có thể thêm thẻ [POINT:…] ở cuối.
const MAX_TOKENS = 600;
const RATE_LIMIT_STORE = "clicky-rate-limit";

// File được đóng gói cùng function nhờ included_files trong netlify.toml.
const PROMPT_FILE = "netlify/functions/prompts/clicky.txt";

const MESSAGES = {
  invalid: "Tin nhắn không hợp lệ.",
  unavailable: "Clicky đang tạm nghỉ. Bạn thử lại sau nhé!",
  busy: "Nhiều bạn đang hỏi Clicky cùng lúc quá. Bạn đợi một chút rồi hỏi lại nhé!",
  failed: "Ôi, Clicky gặp chút trục trặc. Bạn hỏi lại giúp mình nhé!",
  refusal: "Câu này mình không trả lời được. Mình cùng nói về chuyện học nhé! 📚 [POINT:none]",
  limited: (minutes: number) =>
    `Bạn đã hỏi Clicky ${CLICKY_LIMITS.messagesPerHour} câu trong một giờ rồi đó! 🌟 Mình nghỉ một chút nhé, khoảng ${minutes} phút nữa mình lại giúp bạn tiếp.`,
};

let client: Anthropic | null = null;
let systemPrompt: Promise<string> | null = null;

function getClient() {
  client ??= new Anthropic();
  return client;
}

function loadSystemPrompt() {
  // Khi chạy `netlify dev` thư mục làm việc là gốc project; khi deploy, file nằm cạnh bundle của function.
  const candidates = [path.resolve(PROMPT_FILE), new URL(`../../../${PROMPT_FILE}`, import.meta.url)];
  systemPrompt ??= (async () => {
    for (const file of candidates) {
      try {
        return (await readFile(file, "utf8")).trim();
      } catch {
        // Thử vị trí tiếp theo.
      }
    }
    throw new Error(`Không tìm thấy ${PROMPT_FILE}`);
  })().catch((error) => {
    systemPrompt = null;
    throw error;
  });
  return systemPrompt;
}

function parseHistory(messages: unknown): ChatTurn[] | null {
  if (!Array.isArray(messages)) return null;
  const turns: ChatTurn[] = [];
  for (const item of (messages as unknown[]).slice(-CLICKY_LIMITS.maxHistoryMessages)) {
    if (typeof item !== "object" || item === null) return null;
    const { role, content } = item as Record<string, unknown>;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const text = content.trim().slice(0, CLICKY_LIMITS.maxMessageChars);
    if (text) turns.push({ role, content: text });
  }
  while (turns[0]?.role === "assistant") turns.shift();
  if (turns.at(-1)?.role !== "user") return null;
  return turns;
}

const BASE64 = /^[A-Za-z0-9+/]+={0,2}$/;
const isSide = (value: unknown): value is number =>
  Number.isInteger(value) && (value as number) > 0 && (value as number) <= CLICKY_LIMITS.screenshotMaxSide;

function parseScreenshot(screenshot: unknown): ClickyScreenshot | null {
  if (typeof screenshot !== "object" || screenshot === null) return null;
  const { data, width, height } = screenshot as Record<string, unknown>;
  if (typeof data !== "string" || data.length > CLICKY_LIMITS.maxScreenshotBase64Chars || !BASE64.test(data)) return null;
  // Chỉ nhận JPEG — widget luôn gửi JPEG; khai báo sai định dạng thì API từ chối.
  if (!data.startsWith("/9j/")) return null;
  if (!isSide(width) || !isSide(height)) return null;
  return { data, width, height };
}

function errorMessage(error: unknown) {
  if (error instanceof Anthropic.RateLimitError || error instanceof Anthropic.InternalServerError) return MESSAGES.busy;
  if (error instanceof Anthropic.AuthenticationError || error instanceof Anthropic.PermissionDeniedError) {
    return MESSAGES.unavailable;
  }
  if (error instanceof Anthropic.AnthropicError && !(error instanceof Anthropic.APIError)) return MESSAGES.unavailable;
  return MESSAGES.failed;
}

/** Lịch sử chỉ có chữ; ảnh chụp của câu hỏi hiện tại gắn vào lượt cuối, kèm kích thước để Claude tính toạ độ. */
function buildMessages(turns: ChatTurn[], screenshot: ClickyScreenshot): Anthropic.Beta.BetaMessageParam[] {
  const last = turns.at(-1)!;
  return [
    ...turns.slice(0, -1),
    {
      role: "user",
      content: [
        { type: "image", source: { type: "base64", media_type: "image/jpeg", data: screenshot.data } },
        {
          type: "text",
          text: `Ảnh chụp trang Digital Academy học sinh đang xem (${screenshot.width}×${screenshot.height} pixel).`,
        },
        { type: "text", text: last.content },
      ],
    },
  ];
}

export default async function handler(request: Request, context: Context) {
  let turns: ChatTurn[] | null = null;
  let screenshot: ClickyScreenshot | null = null;
  try {
    const body = (await request.json()) as Record<string, unknown> | null;
    turns = parseHistory(body?.messages);
    screenshot = parseScreenshot(body?.screenshot);
  } catch {
    // JSON hỏng — trả 400 bên dưới.
  }
  if (!turns || !screenshot) return Response.json({ error: MESSAGES.invalid }, { status: 400 });

  try {
    const limit = await consume(context.ip, CLICKY_LIMITS.messagesPerHour, Date.now(), RATE_LIMIT_STORE);
    if (!limit.allowed && limit.reason === "contention") {
      return Response.json({ error: MESSAGES.busy }, { status: 429, headers: { "Retry-After": "5" } });
    }
    if (!limit.allowed) {
      return Response.json(
        { error: MESSAGES.limited(Math.max(1, Math.ceil(limit.retryAfterSeconds / 60))) },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
      );
    }
  } catch (error) {
    console.error("[clicky] rate limit", error);
  }

  let system: string;
  try {
    system = await loadSystemPrompt();
  } catch (error) {
    console.error("[clicky]", error);
    return Response.json({ error: MESSAGES.unavailable }, { status: 500 });
  }

  const messages = buildMessages(turns, screenshot);
  const encoder = new TextEncoder();
  const send = (controller: ReadableStreamDefaultController<Uint8Array>, event: ChatStreamEvent) =>
    controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
  let stream: ReturnType<Anthropic["beta"]["messages"]["stream"]> | null = null;

  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        stream = getClient().beta.messages.stream(
          {
            model: MODEL,
            max_tokens: MAX_TOKENS,
            output_config: { effort: EFFORT },
            betas: ["server-side-fallback-2026-07-01"],
            fallbacks: "default",
            system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
            messages,
          },
          { signal: request.signal },
        );

        for await (const event of stream) {
          if (event.type === "content_block_start" && event.content_block.type === "fallback") {
            send(controller, { type: "reset" });
          } else if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            send(controller, { type: "text", text: event.delta.text });
          }
        }

        const message = await stream.finalMessage();
        const { input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens } = message.usage;
        console.log("[clicky] usage", { input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens });
        if (message.stop_reason === "refusal") {
          send(controller, { type: "reset" });
          send(controller, { type: "text", text: MESSAGES.refusal });
        } else if (message.stop_reason === "max_tokens") {
          send(controller, { type: "text", text: "…" });
        }
        send(controller, { type: "done", stopReason: message.stop_reason });
      } catch (error) {
        if (request.signal.aborted) return;
        console.error("[clicky]", error);
        send(controller, { type: "error", message: errorMessage(error) });
      } finally {
        try {
          controller.close();
        } catch {
          // Stream đã bị huỷ phía client.
        }
      }
    },
    cancel() {
      stream?.abort();
    },
  });

  return new Response(body, {
    headers: { "Content-Type": "application/x-ndjson; charset=utf-8", "Cache-Control": "no-store" },
  });
}
