import { courses } from "@/data/courses";
import { DesignStage } from "./DesignStage";
import { HomeHeader } from "./HomeHeader";
import { PlanetCarousel } from "./PlanetCarousel";
import { ScheduleStrip } from "./ScheduleStrip";
import { SceneBackground } from "./SceneBackground";

/** Màn Trang chủ học sinh — Figma "Khóa học 1" (109:42213). Thứ tự lớp giữ theo thứ tự layer trong Figma. */
export function StudentHome() {
  return (
    <DesignStage>
      <main className="relative size-full text-white">
        <SceneBackground />
        <PlanetCarousel courses={courses} />
        <img
          src="/home/scene/ai-mascot.webp"
          alt="Trợ lý AI"
          className="absolute left-[1284px] top-[566px] h-[124px] w-[110px] -scale-x-100 object-cover"
        />
        <HomeHeader />
        <ScheduleStrip />
      </main>
    </DesignStage>
  );
}
