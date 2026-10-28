// Giao thức giữa widget Clicky (src/components/clicky) và Netlify Function /api/clicky (netlify/functions/clicky).
// Clicky giống Trợ lý AI nhưng mỗi câu hỏi gửi kèm ảnh chụp trang Digital Academy học sinh đang xem,
// và Claude có thể chỉ vào một chỗ trên trang bằng thẻ [POINT:x,y:nhãn] ở cuối câu trả lời.

import type { ChatTurn } from "./chat";

export type { ChatStreamEvent, ChatTurn } from "./chat";

/** Ảnh chụp trang (JPEG base64, không có tiền tố data:) kèm kích thước pixel của ảnh. */
export type ClickyScreenshot = { data: string; width: number; height: number };

/** Body gửi lên /api/clicky: lịch sử hội thoại (chỉ chữ) và ảnh chụp cho câu hỏi cuối cùng. */
export type ClickyRequest = { messages: ChatTurn[]; screenshot: ClickyScreenshot };

export const CLICKY_LIMITS = {
  /** Server chỉ giữ chừng này tin gần nhất trong lịch sử. */
  maxHistoryMessages: 10,
  /** Mỗi tin dài quá mức này bị cắt bớt. */
  maxMessageChars: 500,
  /** Số câu hỏi kèm ảnh mỗi giờ, tính theo địa chỉ IP (ảnh tốn nhiều token hơn chữ). */
  messagesPerHour: 20,
  /** Ảnh được thu nhỏ để cạnh dài nhất không quá mức này (pixel). */
  screenshotMaxSide: 1280,
  /** Giới hạn độ dài chuỗi base64 của ảnh (~1,5 MB ảnh JPEG). */
  maxScreenshotBase64Chars: 2_000_000,
};

/** Điểm Claude muốn chỉ vào, theo toạ độ pixel của ảnh chụp. */
export type ClickyPoint = { x: number; y: number; label: string };

const POINT_TAG = /\[POINT:(?:none|(\d+)\s*,\s*(\d+)(?::([^\]]*))?)\]\s*$/;

/**
 * Tách thẻ [POINT:…] khỏi câu trả lời. Khi đang stream, mọi thứ từ "[POINT" trở đi đều bị ẩn để học sinh
 * không thấy thẻ dở dang.
 */
export function splitPointTag(text: string): { text: string; point: ClickyPoint | null } {
  const match = POINT_TAG.exec(text);
  const point =
    match && match[1] !== undefined && match[2] !== undefined
      ? { x: Number(match[1]), y: Number(match[2]), label: (match[3] ?? "").trim() }
      : null;
  const cut = text.indexOf("[POINT");
  return { text: (cut === -1 ? text : text.slice(0, cut)).trimEnd(), point };
}
