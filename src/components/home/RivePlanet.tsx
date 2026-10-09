"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Alignment, Fit, Layout, useRive, type Rive } from "@rive-app/react-canvas";
import type { CoursePlanetRive } from "@/data/courses";

// Cả 3 file Rive dùng chung một state machine: bool "isHover" (chạy "hover") và trigger "click" (chạy "click").
const STATE_MACHINE = "State Machine 1";

// Hành tinh nằm trong khung 420×420 của carousel (xem PlanetCarousel).
const BOX = 420;
// Artboard 1920×1080. Canvas vuông + Fit.Cover chỉ vẽ phần giữa 1080×1080 (x từ 420 tới 1500) — đủ chứa sấm sét,
// mặt trời, mưa sao băng quanh hành tinh mà không tốn canvas cho hai bên trống.
const ARTBOARD_WIDTH = 1920;
const VIEW_UNITS = 1080;
const VIEW_LEFT = (ARTBOARD_WIDTH - VIEW_UNITS) / 2;
// Vùng tròn nhận hover / click, xấp xỉ thân hành tinh trong khung 420×420 (thay cho "HitEllipse" trong file Rive).
const HIT_PX = 340;

const LAYOUT = new Layout({ fit: Fit.Cover, alignment: Alignment.Center });

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
}

type RivePlanetProps = {
  config: CoursePlanetRive;
  image: string;
  alt: string;
  /** Nhận hover / click (hành tinh giữa và hai bên). */
  interactive: boolean;
  /** Tạm dừng hoạt ảnh khi hành tinh đã ra khỏi khung nhìn. */
  playing: boolean;
};

/**
 * Hành tinh động bằng Rive, lấp vào khung 420×420 của carousel.
 * Ảnh tĩnh hiển thị trong lúc tải runtime/file Rive rồi mờ dần đi; nếu bật "giảm chuyển động" thì chỉ dùng ảnh tĩnh.
 */
export function RivePlanet({ config, image, alt, interactive, playing }: RivePlanetProps) {
  const reducedMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const animated = !reducedMotion && ready;

  return (
    <>
      <img
        src={image}
        alt={alt}
        draggable={false}
        className={`pointer-events-none absolute inset-0 size-full object-contain transition-opacity duration-300 ${animated ? "opacity-0" : ""}`}
      />
      {!reducedMotion && (
        <PlanetAnimation config={config} interactive={interactive} playing={playing} onReady={() => setReady(true)} />
      )}
    </>
  );
}

function setInput(rive: Rive | null, name: string, value: boolean) {
  const input = rive?.stateMachineInputs(STATE_MACHINE)?.find((i) => i.name === name);
  if (input) input.value = value;
}

function fireInput(rive: Rive | null, name: string) {
  rive?.stateMachineInputs(STATE_MACHINE)?.find((i) => i.name === name)?.fire();
}

function PlanetAnimation({
  config,
  interactive,
  playing,
  onReady,
}: Omit<RivePlanetProps, "image" | "alt"> & { onReady: () => void }) {
  const { rive, RiveComponent } = useRive({
    src: config.src,
    artboard: config.artboard,
    stateMachine: STATE_MACHINE,
    autoplay: true,
    layout: LAYOUT,
    // Canvas lớn hơn khung hành tinh và đè lên hai hành tinh bên cạnh, nên tự xử lý hover/click
    // bằng vùng tròn bên dưới thay vì để Rive bắt sự kiện trên cả canvas.
    shouldDisableRiveListeners: true,
    onRiveReady: onReady,
  });

  useEffect(() => {
    if (!rive) return;
    if (playing) rive.play();
    else rive.pause();
  }, [rive, playing]);

  // Hành tinh trượt khỏi vị trí tương tác (con trỏ vẫn đứng yên) thì không có pointerleave — tự tắt hover.
  useEffect(() => {
    if (!interactive) setInput(rive, "isHover", false);
  }, [rive, interactive]);

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          // Dịch canvas để tâm hành tinh trong artboard rơi đúng tâm khung 420×420.
          left: BOX / 2 - (config.center.x - VIEW_LEFT) * config.scale,
          top: BOX / 2 - config.center.y * config.scale,
          width: VIEW_UNITS * config.scale,
          height: VIEW_UNITS * config.scale,
        }}
      >
        <RiveComponent />
      </div>
      <div
        aria-hidden
        className={`absolute rounded-full ${interactive ? "" : "pointer-events-none"}`}
        style={{ left: (BOX - HIT_PX) / 2, top: (BOX - HIT_PX) / 2, width: HIT_PX, height: HIT_PX }}
        onPointerEnter={() => setInput(rive, "isHover", true)}
        onPointerLeave={() => setInput(rive, "isHover", false)}
        onClick={() => fireInput(rive, "click")}
      />
    </>
  );
}
