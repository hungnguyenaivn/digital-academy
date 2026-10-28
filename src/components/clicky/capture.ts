import { domToJpeg } from "modern-screenshot";
import { CLICKY_LIMITS, type ClickyScreenshot } from "@/lib/clicky";

/** Đánh dấu phần tử không được chụp vào ảnh (chính widget Clicky và con trỏ của nó). */
export const CLICKY_IGNORE_ATTRIBUTE = "data-clicky-ignore";

/** Ảnh chụp kèm tỉ lệ ảnh/viewport để đổi toạ độ [POINT] của Claude về toạ độ trên màn hình. */
export type PageCapture = ClickyScreenshot & { viewportScale: number };

/**
 * Chụp phần trang Digital Academy đang hiện trong viewport (không xin quyền chia sẻ màn hình, không thấy ứng dụng
 * khác). Ảnh được thu nhỏ để cạnh dài nhất ≤ CLICKY_LIMITS.screenshotMaxSide rồi nén JPEG.
 */
export async function capturePage(): Promise<PageCapture> {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const viewportScale = Math.min(1, CLICKY_LIMITS.screenshotMaxSide / Math.max(viewportWidth, viewportHeight));

  const dataUrl = await domToJpeg(document.documentElement, {
    width: viewportWidth,
    height: viewportHeight,
    scale: viewportScale,
    quality: 0.75,
    backgroundColor: "#030442",
    timeout: 8000,
    // Các trang dùng khung cố định full màn hình nên thường không cuộn; vẫn dịch theo vị trí cuộn cho chắc.
    style: { transform: `translate(${-window.scrollX}px, ${-window.scrollY}px)` },
    filter: (node) => !(node instanceof Element && node.hasAttribute(CLICKY_IGNORE_ATTRIBUTE)),
  });

  const data = dataUrl.slice(dataUrl.indexOf(",") + 1);
  return {
    data,
    width: Math.round(viewportWidth * viewportScale),
    height: Math.round(viewportHeight * viewportScale),
    viewportScale,
  };
}
