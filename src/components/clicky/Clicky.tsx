"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { CLICKY_LIMITS, splitPointTag, type ChatStreamEvent, type ChatTurn, type ClickyPoint } from "@/lib/clicky";
import { CLICKY_IGNORE_ATTRIBUTE, capturePage } from "./capture";

type ClickyMessage = ChatTurn & {
  id: number;
  /** "looking": đang chụp trang; "streaming": đang nhận câu trả lời; "error": lỗi (không gửi lại trong lịch sử). */
  status?: "looking" | "streaming" | "error";
  limited?: boolean;
};

/** Điểm cần chỉ, đã đổi sang toạ độ viewport (px CSS). */
type ScreenPoint = { left: number; top: number; label: string; key: number };

const GREETING = "Chào bạn! Mình là Clicky 👆 Bạn hỏi gì về trang đang mở, mình sẽ nhìn và chỉ cho bạn nhé!";
const NETWORK_ERROR = "Mất kết nối rồi. Bạn kiểm tra mạng và thử lại nhé!";
const SERVER_ERROR = "Ôi, Clicky gặp chút trục trặc. Bạn hỏi lại giúp mình nhé!";
const CAPTURE_ERROR = "Mình chưa chụp được trang này. Bạn thử lại nhé!";
/** Baloo 2 do next/font nạp ở root layout; nếu chưa tải được thì dùng font hệ thống thay vì font có chân. */
const FONT_STACK = "var(--font-baloo), system-ui, sans-serif";
/** Con trỏ tự ẩn sau chừng này mili giây. */
const POINTER_VISIBLE_MS = 6000;

let nextId = 0;

/**
 * Clicky trên web: nút nổi ở góc trái dưới mọi trang. Học sinh hỏi → chụp trang Digital Academy đang mở → gửi ảnh
 * + câu hỏi tới /api/clicky → hiện câu trả lời, và nếu Claude trả về [POINT:x,y:nhãn] thì con trỏ xanh bay tới chỉ.
 */
export function Clicky() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ClickyMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [pointer, setPointer] = useState<ScreenPoint | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const busy = messages.some((m) => m.status === "looking" || m.status === "streaming");

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!pointer) return;
    const timer = window.setTimeout(() => setPointer(null), POINTER_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [pointer]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const updateMessage = (id: number, update: (message: ClickyMessage) => ClickyMessage) =>
    setMessages((list) => list.map((m) => (m.id === id ? update(m) : m)));

  const ask = async (history: ClickyMessage[]) => {
    const replyId = nextId++;
    setMessages([...history, { id: replyId, role: "assistant", content: "", status: "looking" }]);
    setPointer(null);
    const controller = new AbortController();
    abortRef.current = controller;

    const finish = (status?: "error", content?: string, limited?: boolean) =>
      updateMessage(replyId, (m) => ({ ...m, status, limited, content: content ?? m.content }));

    let capture: Awaited<ReturnType<typeof capturePage>>;
    try {
      capture = await capturePage();
    } catch (error) {
      console.error("[clicky] capture", error);
      finish("error", CAPTURE_ERROR);
      if (abortRef.current === controller) abortRef.current = null;
      return;
    }
    if (controller.signal.aborted) return;
    updateMessage(replyId, (m) => ({ ...m, status: "streaming" }));

    let answer = "";
    try {
      const response = await fetch("/api/clicky", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Lịch sử gửi nguyên văn (kể cả thẻ [POINT]) để Claude nhớ mình đã chỉ vào đâu.
          messages: history
            .filter((m) => m.status !== "error" && m.content)
            .map(({ role, content }): ChatTurn => ({ role, content })),
          screenshot: { data: capture.data, width: capture.width, height: capture.height },
        }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        finish("error", data?.error ?? SERVER_ERROR, response.status === 429);
        return;
      }

      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
      let buffer = "";
      let failed = false;
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += value;
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ChatStreamEvent;
          if (event.type === "text") {
            answer += event.text;
            updateMessage(replyId, (m) => ({ ...m, content: answer }));
          } else if (event.type === "reset") {
            answer = "";
            updateMessage(replyId, (m) => ({ ...m, content: "" }));
          } else if (event.type === "error") {
            failed = true;
            finish("error", event.message);
          }
        }
      }
      if (!failed) {
        finish();
        const { point } = splitPointTag(answer);
        if (point) setPointer(toScreenPoint(point, capture.viewportScale));
      }
    } catch {
      if (!controller.signal.aborted) finish("error", NETWORK_ERROR);
      else setMessages((list) => list.flatMap((m) => (m.id !== replyId ? [m] : m.content ? [{ ...m, status: undefined }] : [])));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const send = (event?: FormEvent) => {
    event?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    setDraft("");
    void ask([...messages, { id: nextId++, role: "user", content: text }]);
  };

  const retry = () => {
    if (busy) return;
    void ask(messages.filter((m) => m.status !== "error"));
  };

  const restart = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setMessages([]);
    setPointer(null);
    inputRef.current?.focus();
  };

  const stop = () => {
    abortRef.current?.abort();
    // Đang chụp trang thì chưa có chữ nào: bỏ bong bóng chờ.
    setMessages((list) => list.filter((m) => m.status !== "looking"));
    inputRef.current?.focus();
  };

  const onInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) send(event);
  };

  return (
    <div {...{ [CLICKY_IGNORE_ATTRIBUTE]: "" }} className="text-white" style={{ fontFamily: FONT_STACK }}>
      {pointer && <Pointer key={pointer.key} point={pointer} />}

      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Đóng Clicky" : "Hỏi Clicky"}
        title="Hỏi Clicky"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        // Nút tròn nhỏ ở góc trái dưới để che ít nhất phần thiết kế 1440×900 của các trang.
        className="fixed bottom-[12px] left-[12px] z-[1000] flex size-[48px] cursor-pointer items-center justify-center rounded-full border-2 border-white/80 bg-[#1677ff] shadow-[0_6px_20px_rgba(22,119,255,0.5)] outline-none transition-[transform,filter] duration-200 hover:-translate-y-[2px] hover:brightness-110 focus-visible:-translate-y-[2px] focus-visible:brightness-110 active:translate-y-0"
      >
        <CursorIcon className="size-[24px]" />
      </button>

      {open && (
        <section
          id={panelId}
          role="dialog"
          aria-label="Clicky"
          className="fixed bottom-[72px] left-[12px] z-[1000] flex h-[min(440px,calc(100dvh-110px))] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-[22px] border border-[rgba(143,220,255,0.7)] bg-[rgba(8,22,92,0.94)] shadow-[0_10px_24px_rgba(3,18,60,0.5),0_6px_26px_rgba(57,180,255,0.45)] backdrop-blur-md"
        >
          <header className="flex h-[52px] shrink-0 items-center justify-between bg-gradient-to-b from-[rgba(22,119,255,0.95)] to-[rgba(19,50,127,0.62)] px-[16px]">
            <h2 className="flex items-center gap-[6px] text-[19px] font-bold leading-none">
              <CursorIcon className="size-[20px]" /> Clicky
            </h2>
            <div className="flex items-center gap-[6px]">
              <button
                type="button"
                onClick={restart}
                disabled={messages.length === 0}
                className="h-[30px] cursor-pointer rounded-full bg-white/15 px-[10px] text-[13px] font-bold outline-none transition-colors hover:bg-white/25 focus-visible:bg-white/25 disabled:cursor-default disabled:opacity-40 disabled:hover:bg-white/15"
              >
                ↺ Bắt đầu lại
              </button>
              <button
                type="button"
                aria-label="Đóng"
                onClick={() => setOpen(false)}
                className="flex size-[30px] cursor-pointer items-center justify-center rounded-full text-[22px] leading-none text-white/80 outline-none transition-colors hover:bg-white/15 hover:text-white focus-visible:bg-white/15"
              >
                ×
              </button>
            </div>
          </header>

          <div ref={listRef} aria-live="polite" className="flex flex-1 flex-col gap-[10px] overflow-y-auto overscroll-contain px-[14px] py-[12px]">
            <Bubble role="assistant">{GREETING}</Bubble>
            {messages.map((message) => (
              <Bubble key={message.id} role={message.role} error={message.status === "error"}>
                {message.status === "looking" ? (
                  <span className="text-white/75">👀 Clicky đang nhìn trang…</span>
                ) : message.status === "streaming" && !splitPointTag(message.content).text ? (
                  <TypingDots />
                ) : message.role === "assistant" ? (
                  splitPointTag(message.content).text
                ) : (
                  message.content
                )}
                {message.status === "error" && !message.limited && (
                  <button
                    type="button"
                    onClick={retry}
                    className="ml-[8px] cursor-pointer font-bold text-[#ffd159] underline underline-offset-2 outline-none hover:brightness-110 focus-visible:brightness-110"
                  >
                    Thử lại
                  </button>
                )}
              </Bubble>
            ))}
          </div>

          <form onSubmit={send} className="flex shrink-0 items-end gap-[8px] border-t border-[rgba(107,184,255,0.24)] p-[10px]">
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              maxLength={CLICKY_LIMITS.maxMessageChars}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="Hỏi về trang đang mở…"
              aria-label="Câu hỏi cho Clicky"
              className="max-h-[96px] min-h-[42px] flex-1 resize-none rounded-[14px] bg-white/10 px-[12px] py-[9px] text-[16px] leading-[24px] text-white outline-none [field-sizing:content] placeholder:text-white/50 focus:bg-white/15"
            />
            {busy ? (
              <button
                type="button"
                onClick={stop}
                className="h-[42px] shrink-0 cursor-pointer rounded-[14px] bg-white/15 px-[14px] text-[16px] font-bold outline-none hover:bg-white/25 focus-visible:bg-white/25"
              >
                Dừng
              </button>
            ) : (
              <button
                type="submit"
                disabled={!draft.trim()}
                className="h-[42px] shrink-0 cursor-pointer rounded-[14px] bg-[#1677ff] px-[16px] text-[16px] font-bold outline-none transition-[filter] hover:brightness-115 focus-visible:brightness-115 disabled:cursor-default disabled:opacity-50 disabled:hover:brightness-100"
              >
                Hỏi
              </button>
            )}
          </form>
        </section>
      )}
    </div>
  );
}

/** Đổi toạ độ pixel trong ảnh chụp sang toạ độ viewport, giữ trong màn hình. */
function toScreenPoint(point: ClickyPoint, viewportScale: number): ScreenPoint {
  const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), max);
  return {
    left: clamp(point.x / viewportScale, window.innerWidth - 4),
    top: clamp(point.y / viewportScale, window.innerHeight - 4),
    label: point.label,
    key: nextId++,
  };
}

/** Con trỏ xanh bay từ nút Clicky tới chỗ cần chỉ, kèm nhãn. Không nhận click để không che trang. */
function Pointer({ point }: { point: ScreenPoint }) {
  const [arrived, setArrived] = useState(false);
  useEffect(() => {
    // Khung đầu ở vị trí nút Clicky, khung sau mới đặt đích để CSS transition chạy.
    const frame = requestAnimationFrame(() => setArrived(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const start = { left: 30, top: window.innerHeight - 42 };
  const position = arrived ? point : start;
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[1001] motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={{ transform: `translate(${position.left}px, ${position.top}px)` }}
    >
      <CursorIcon className="size-[34px] drop-shadow-[0_2px_6px_rgba(22,119,255,0.8)] motion-safe:animate-pulse" />
      {point.label && arrived && (
        <span className="absolute left-[30px] top-[26px] whitespace-nowrap rounded-full bg-[#1677ff] px-[10px] py-[3px] text-[14px] font-bold shadow-[0_4px_12px_rgba(3,18,60,0.4)]">
          {point.label}
        </span>
      )}
    </div>
  );
}

/** Con trỏ tam giác xanh của Clicky; mũi nhọn ở góc trên bên trái (0,0) để chỉ đúng điểm. */
function CursorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path d="M2 2 L21 10 L12.5 12.5 L10 21 Z" fill="#4da3ff" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Bubble({ role, error, children }: { role: ChatTurn["role"]; error?: boolean; children: ReactNode }) {
  const mine = role === "user";
  return (
    <div
      className={`max-w-[85%] whitespace-pre-wrap break-words rounded-[18px] px-[13px] py-[8px] text-[16px] leading-[23px] ${
        mine
          ? "self-end rounded-br-[6px] bg-[#1677ff]"
          : error
            ? "self-start rounded-bl-[6px] bg-[rgba(220,38,38,0.28)]"
            : "self-start rounded-bl-[6px] bg-white/12"
      }`}
    >
      {children}
    </div>
  );
}

function TypingDots() {
  return (
    <span aria-label="Clicky đang trả lời" className="inline-flex h-[23px] items-center gap-[5px]">
      {[0, 160, 320].map((delay) => (
        <span key={delay} className="size-[7px] rounded-full bg-white/70 motion-safe:animate-bounce" style={{ animationDelay: `${delay}ms` }} />
      ))}
    </span>
  );
}
