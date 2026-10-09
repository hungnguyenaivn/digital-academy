"use client";

import { useRef, useState } from "react";
import { PlanetHitArea } from "./PlanetHitArea";

// Mô phỏng 3 trạng thái của file Rive bằng CSS: idle (lơ lửng), hover (phóng to 300ms), click (nảy 500ms).
const CLICK_KEYFRAMES: Keyframe[] = [
  { transform: "scale(1)" },
  { transform: "scale(0.92)", offset: 0.25 },
  { transform: "scale(1.06)", offset: 0.6 },
  { transform: "scale(1)" },
];
const CLICK_MS = 500;

type AnimatedPlanetImageProps = {
  image: string;
  alt: string;
  /** Nhận hover / click (hành tinh giữa và hai bên). */
  interactive: boolean;
  /** Tạm dừng hoạt ảnh khi hành tinh đã ra khỏi khung nhìn. */
  playing: boolean;
  /** Lệch pha (giây) để các hành tinh không lơ lửng cùng nhịp. */
  phase: number;
};

/**
 * Hoạt ảnh tạm bằng CSS cho hành tinh chưa có file Rive. Khi có file .riv, khai báo `planetRive` trong
 * dữ liệu khóa học là carousel tự chuyển sang RivePlanet. Bật "giảm chuyển động" thì hành tinh đứng yên.
 */
export function AnimatedPlanetImage({ image, alt, interactive, playing, phase }: AnimatedPlanetImageProps) {
  const [hovered, setHovered] = useState(false);
  const clickLayerRef = useRef<HTMLDivElement>(null);
  // Hành tinh trượt khỏi vị trí tương tác (con trỏ vẫn đứng yên) thì chưa có pointerleave — không giữ hover.
  const hover = hovered && interactive;

  const playClick = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    clickLayerRef.current?.animate(CLICK_KEYFRAMES, { duration: CLICK_MS, easing: "ease-out" });
  };

  return (
    <>
      <div className={`absolute inset-0 transition-transform duration-300 ease-out ${hover ? "scale-106" : ""}`}>
        <div ref={clickLayerRef} className="absolute inset-0">
          <img
            src={image}
            alt={alt}
            draggable={false}
            className="pointer-events-none absolute inset-0 size-full object-contain motion-safe:animate-planet-float"
            style={{ animationDelay: `${-phase}s`, animationPlayState: playing ? "running" : "paused" }}
          />
        </div>
      </div>
      <PlanetHitArea interactive={interactive} onHoverChange={setHovered} onClick={playClick} />
    </>
  );
}
