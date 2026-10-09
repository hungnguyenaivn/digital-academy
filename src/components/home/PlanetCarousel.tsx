"use client";

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Course } from "@/data/courses";
import { AnimatedPlanetImage } from "./AnimatedPlanetImage";
import { CourseRibbon } from "./CourseRibbon";
import { STAGE_WIDTH } from "./DesignStage";
import { RivePlanet } from "./RivePlanet";

const TRANSITION_MS = 400;

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

// Kéo chuột / vuốt cảm ứng: hành tinh bám theo tay, kéo 1 khoảng bằng từ tâm ra hành tinh bên cạnh = 1 hành tinh.
const DRAG_PX_PER_SLOT = (SIDE.dxLeft + SIDE.dxRight) / 2;
// Dịch chưa quá ngưỡng này (px trên khung 1440×900) thì vẫn là click, chưa phải kéo.
const DRAG_START_PX = 6;
// Thả tay khi đã kéo/vuốt ≥ 10% khoảng cách (~40px) thì sang hành tinh kế tiếp, chưa tới thì trở về.
const COMMIT_FRACTION = 0.1;
// Trackpad 2 ngón vuốt ngang: số px cuộn ứng với 1 hành tinh. Mỗi cử chỉ đi tối đa 1 hành tinh (quán tính trackpad
// có thể kéo dài cả giây); cử chỉ kết thúc khi không còn sự kiện wheel trong WHEEL_IDLE_MS.
const WHEEL_PX_PER_SLOT = 300;
const WHEEL_IDLE_MS = 150;
const WHEEL_LINE_PX = 16;

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
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function PlanetCarousel({ courses }: { courses: Course[] }) {
  const n = courses.length;
  // `target` là chỉ số không quấn vòng (…, -1, 0, 1, …) để hoạt ảnh luôn đi đúng chiều khi quay vòng ở 2 đầu.
  // `position` là vị trí đang hiển thị: số lẻ khi đang trượt hoặc đang kéo.
  const [target, setTarget] = useState(0);
  const [position, setPosition] = useState(0);
  const [dragging, setDragging] = useState(false);
  const targetRef = useRef(0);
  const positionRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startX: number;
    startPosition: number;
    startTarget: number;
    /** Tỉ lệ px màn hình / px khung 1440×900 (khung được scale theo viewport). */
    scale: number;
    moved: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);

  const activeIndex = mod(target, n);
  const activeCourse = courses[activeIndex];

  const stopAnimation = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  /** Đặt vị trí ngay lập tức (khi đang kéo / vuốt). */
  const moveTo = useCallback(
    (next: number) => {
      stopAnimation();
      positionRef.current = next;
      setPosition(next);
    },
    [stopAnimation],
  );

  /** Chọn khóa `to` và trượt từ vị trí hiện tại về đó theo quỹ đạo. */
  const settle = useCallback(
    (to: number) => {
      stopAnimation();
      targetRef.current = to;
      setTarget(to);
      const from = positionRef.current;
      if (from === to) return;
      if (prefersReducedMotion()) {
        moveTo(to);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / TRANSITION_MS);
        const next = from + (to - from) * easeOutCubic(t);
        positionRef.current = next;
        setPosition(next);
        frameRef.current = t < 1 ? requestAnimationFrame(tick) : null;
      };
      frameRef.current = requestAnimationFrame(tick);
    },
    [stopAnimation, moveTo],
  );

  /** Kết thúc kéo / vuốt bắt đầu từ khóa `from`: dừng ở hành tinh gần nhất, quá ngưỡng thì ít nhất sang hành tinh kế. */
  const release = useCallback(
    (from: number) => {
      const moved = positionRef.current - from;
      let steps = Math.round(moved);
      if (steps === 0 && Math.abs(moved) >= COMMIT_FRACTION) steps = Math.sign(moved);
      settle(from + steps);
    },
    [settle],
  );

  const go = useCallback((step: number) => settle(targetRef.current + step), [settle]);

  useEffect(() => stopAnimation, [stopAnimation]);

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

  // Trackpad 2 ngón vuốt ngang. Gắn listener thủ công vì cần passive: false để chặn cử chỉ Back/Forward của trình duyệt.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let gesture: { startPosition: number; startTarget: number; delta: number } | null = null;
    let idleTimer: number | undefined;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
      event.preventDefault();
      if (dragRef.current?.moved) return;
      gesture ??= { startPosition: positionRef.current, startTarget: targetRef.current, delta: 0 };
      gesture.delta += event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaX * WHEEL_LINE_PX : event.deltaX;
      const next = gesture.startPosition + gesture.delta / WHEEL_PX_PER_SLOT;
      moveTo(clamp(next, gesture.startTarget - 1, gesture.startTarget + 1));

      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        const finished = gesture;
        gesture = null;
        if (finished) release(finished.startTarget);
      }, WHEEL_IDLE_MS);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      section.removeEventListener("wheel", onWheel);
      window.clearTimeout(idleTimer);
    };
  }, [moveTo, release]);

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    suppressClickRef.current = false;
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    if ((event.target as HTMLElement).closest("button")) return;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: positionRef.current,
      startTarget: targetRef.current,
      scale: event.currentTarget.getBoundingClientRect().width / STAGE_WIDTH,
      moved: false,
    };
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = (event.clientX - drag.startX) / drag.scale;
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_START_PX) return;
      drag.moved = true;
      setDragging(true);
      // Giữ pointer cho carousel để kéo ra ngoài vẫn theo, và hành tinh không nhận hover trong lúc kéo.
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    moveTo(drag.startPosition - dx / DRAG_PX_PER_SLOT);
  };

  const onPointerEnd = (event: PointerEvent<HTMLElement>) => {
    const drag = dragRef.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    setDragging(false);
    // Thả chuột sau khi kéo vẫn sinh click — không để click đó chuyển khóa thêm lần nữa.
    suppressClickRef.current = true;
    release(drag.startTarget);
  };

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Chọn khóa học"
      className={`absolute left-0 w-[1440px] touch-pan-y select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
      style={{ top: AREA_TOP, height: AREA_HEIGHT }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      onClickCapture={(event) => {
        if (!suppressClickRef.current) return;
        suppressClickRef.current = false;
        event.stopPropagation();
      }}
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
              <AnimatedPlanetImage
                image={course.planetImage}
                alt={index === activeIndex ? course.name : ""}
                interactive={isCenter || isSide}
                playing={visible}
                phase={index * 0.7}
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
