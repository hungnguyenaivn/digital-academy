"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Course } from "@/data/courses";
import { CourseRibbon } from "./CourseRibbon";
import { RivePlanet } from "./RivePlanet";

const TRANSITION_MS = 400;
const SWIPE_THRESHOLD_PX = 40;

// Vùng carousel bắt đầu ở y = 132 của khung 1440×900 (frame "Vùng chọn môn — quỹ đạo").
const AREA_TOP = 132;
const AREA_HEIGHT = 651 - AREA_TOP; // tới mép trên dải "Lịch lớp"

// Vị trí theo Figma (tâm hành tinh, toạ độ khung): giữa 420px @ (720,382); trái/phải 240px @ (301,403)/(1123,403).
const CENTER = { x: 720, y: 382, size: 420 };
const SIDE = { dxLeft: 720 - 301, dxRight: 1123 - 720, y: 403, size: 240, opacity: 0.6 };

// Các hành tinh chạy trên một cung elip: góc φ tỉ lệ với độ lệch so với khóa đang chọn.
// PHI chọn sao cho bán kính ngang ≈ 1000px, cùng độ cong với dải sáng quỹ đạo.
const PHI = 0.42;
const RX_LEFT = SIDE.dxLeft / Math.sin(PHI);
const RX_RIGHT = SIDE.dxRight / Math.sin(PHI);
const RY = (SIDE.y - CENTER.y) / (1 - Math.cos(PHI));

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/** Hình học của một hành tinh ở độ lệch `offset` (0 = giữa, ±1 = hai bên, ±2 = ngoài khung, mờ hẳn). */
function orbitSlot(offset: number) {
  const a = Math.abs(offset);
  const phi = a * PHI;
  const rx = offset < 0 ? RX_LEFT : RX_RIGHT;
  const x = CENTER.x + Math.sign(offset) * rx * Math.sin(phi);
  const y = CENTER.y + RY * (1 - Math.cos(phi));
  const size = a <= 1 ? CENTER.size - (CENTER.size - SIDE.size) * a : Math.max(0, SIDE.size - 100 * (a - 1));
  const opacity = a <= 1 ? 1 - (1 - SIDE.opacity) * a : Math.max(0, SIDE.opacity * (2 - a));
  return { x, y, size, opacity, z: Math.round(100 - a * 10) };
}

/** Độ lệch vòng tròn của phần tử `index` so với vị trí `position`, trong khoảng [-n/2, n/2). */
function circularOffset(index: number, position: number, n: number) {
  const raw = (((index - position) % n) + n) % n;
  return raw >= n / 2 ? raw - n : raw;
}

const mod = (value: number, n: number) => ((value % n) + n) % n;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PlanetCarousel({ courses }: { courses: Course[] }) {
  const n = courses.length;
  // `target` là chỉ số không quấn vòng (…, -1, 0, 1, …) để hoạt ảnh luôn đi đúng chiều khi quay vòng ở 2 đầu.
  const [target, setTarget] = useState(0);
  const [position, setPosition] = useState(0);
  const positionRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const swipeStartX = useRef<number | null>(null);

  const activeIndex = mod(target, n);
  const activeCourse = courses[activeIndex];

  useEffect(() => {
    const from = positionRef.current;
    if (from === target) return;

    if (prefersReducedMotion()) {
      positionRef.current = target;
      frameRef.current = requestAnimationFrame(() => setPosition(target));
      return () => {
        if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      };
    }

    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / TRANSITION_MS);
      const next = from + (target - from) * easeOutCubic(t);
      positionRef.current = next;
      setPosition(next);
      if (t < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [target]);

  const go = useCallback((step: number) => setTarget((t) => t + step), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const el = event.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable='true']")) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        go(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        go(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [go]);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") swipeStartX.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    const startX = swipeStartX.current;
    swipeStartX.current = null;
    if (startX === null || event.pointerType !== "touch") return;
    const dx = event.clientX - startX;
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX) go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Chọn khóa học"
      className="absolute left-0 w-[1440px] touch-pan-y select-none"
      style={{ top: AREA_TOP, height: AREA_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={() => (swipeStartX.current = null)}
    >
      <OrbitArrow direction="prev" onClick={() => go(-1)} />
      <OrbitArrow direction="next" onClick={() => go(1)} />

      {courses.map((course, index) => {
        const offset = circularOffset(index, position, n);
        const slot = orbitSlot(offset);
        const visible = Math.abs(offset) < 2;
        const isCenter = Math.abs(offset) < 0.001;
        const isSide = Math.abs(Math.abs(offset) - 1) < 0.001;
        return (
          <div
            key={course.id}
            aria-hidden={index !== activeIndex}
            className={`absolute left-0 top-0 size-[420px] will-change-transform ${isSide ? "cursor-pointer" : ""}`}
            style={{
              transform: `translate(${slot.x - 210}px, ${slot.y - AREA_TOP - 210}px) scale(${slot.size / CENTER.size})`,
              opacity: slot.opacity,
              zIndex: slot.z,
              visibility: visible ? "visible" : "hidden",
            }}
            onClick={isSide ? () => go(Math.sign(offset)) : undefined}
          >
            {course.planetRive ? (
              <RivePlanet
                config={course.planetRive}
                image={course.planetImage}
                alt={index === activeIndex ? course.name : ""}
                interactive={isCenter || isSide}
                playing={visible}
              />
            ) : (
              <img
                src={course.planetImage}
                alt={index === activeIndex ? course.name : ""}
                draggable={false}
                className="pointer-events-none absolute inset-0 size-full object-contain"
              />
            )}
          </div>
        );
      })}

      {/* Ruy-băng gắn với vị trí giữa: khung hành tinh giữa nằm ở (510,172) */}
      <div className="absolute z-[200]" style={{ left: 510, top: 172 - AREA_TOP }}>
        <CourseRibbon name={activeCourse.name} />
      </div>

      <p aria-live="polite" className="sr-only">
        {`Khóa học ${activeIndex + 1}/${n}: ${activeCourse.name}`}
      </p>
    </section>
  );
}

function OrbitArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const isNext = direction === "next";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isNext ? "Khóa học sau" : "Khóa học trước"}
      className={`group absolute top-[180px] z-[150] h-[90px] w-[80px] cursor-pointer outline-none ${isNext ? "left-[1320px] -scale-x-100" : "left-[40px]"}`}
    >
      <span className="absolute left-[-6px] top-[-9px] flex h-[99.455px] w-[85.111px] items-center justify-center transition-[transform,filter] duration-200 ease-out group-hover:scale-110 group-hover:brightness-115 group-focus-visible:scale-110 group-focus-visible:brightness-115 group-active:scale-95">
        <span className="relative block h-[84px] w-[60px] flex-none rotate-20">
          <span className="absolute left-[-2.83px] top-[-1.99px] flex h-[87.321px] w-[65.667px] items-center justify-center">
            <span className="relative block h-[83.338px] w-[60px] flex-none rotate-4 overflow-hidden">
              <img
                src="/home/scene/arrow.webp"
                alt=""
                draggable={false}
                className="absolute left-[-45.43%] top-[-13.17%] h-[125.29%] w-[190.42%] max-w-none"
              />
            </span>
          </span>
        </span>
      </span>
    </button>
  );
}
