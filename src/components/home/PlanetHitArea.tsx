// Hành tinh nằm trong khung 420×420 của carousel (xem PlanetCarousel).
export const PLANET_BOX = 420;
// Vùng tròn nhận hover / click, xấp xỉ thân hành tinh trong khung 420×420.
const HIT_PX = 340;

type PlanetHitAreaProps = {
  /** Chỉ hành tinh giữa và hai bên mới nhận hover / click. */
  interactive: boolean;
  onHoverChange: (hovered: boolean) => void;
  onClick: () => void;
};

/** Vùng tròn trong suốt phủ lên thân hành tinh; click vẫn nổi bọt lên khung carousel (để chuyển khóa khi bấm hành tinh bên cạnh). */
export function PlanetHitArea({ interactive, onHoverChange, onClick }: PlanetHitAreaProps) {
  return (
    <div
      aria-hidden
      className={`absolute rounded-full ${interactive ? "" : "pointer-events-none"}`}
      style={{ left: (PLANET_BOX - HIT_PX) / 2, top: (PLANET_BOX - HIT_PX) / 2, width: HIT_PX, height: HIT_PX }}
      onPointerEnter={() => onHoverChange(true)}
      onPointerLeave={() => onHoverChange(false)}
      onClick={onClick}
    />
  );
}
