import type { CSSProperties, ReactNode } from "react";

export const STAGE_WIDTH = 1440;
export const STAGE_HEIGHT = 900;

// Tỉ lệ scale tính thuần CSS: tan(atan2(a, b)) = a / b nhưng ra số không đơn vị, dùng được trong scale().
// Nhờ vậy khung hiển thị đúng ngay từ HTML server render, không phải chờ JavaScript.
const SCALE = `min(tan(atan2(100vw, ${STAGE_WIDTH}px)), tan(atan2(100dvh, ${STAGE_HEIGHT}px)))`;

/**
 * Khung thiết kế cố định 1440×900, scale đều (giữ tỉ lệ) cho vừa viewport và căn giữa.
 * Phần thừa hai bên / trên dưới được phủ bằng nền mờ để không lộ viền.
 */
export function DesignStage({ children }: { children: ReactNode }) {
  return (
    <div className="fixed inset-0 grid place-items-center overflow-hidden bg-[#030442]">
      <div
        aria-hidden
        className="absolute inset-[-40px] bg-cover bg-center opacity-60 blur-[24px]"
        style={{ backgroundImage: "url(/home/scene/background.jpg)" }}
      />
      <div
        className="relative"
        style={{ "--stage-scale": SCALE, width: `calc(${STAGE_WIDTH}px * var(--stage-scale))`, height: `calc(${STAGE_HEIGHT}px * var(--stage-scale))` } as CSSProperties}
      >
        <div
          className="absolute left-0 top-0 origin-top-left overflow-hidden"
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: "scale(var(--stage-scale))" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
