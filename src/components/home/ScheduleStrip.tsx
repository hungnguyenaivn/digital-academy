import {
  featuredSession,
  scheduleHeading,
  upcomingSessions,
  type BadgeTheme,
  type FeaturedSession,
  type UpcomingSession,
} from "@/data/schedule";

const STRIP_TOP = 651;

function SubjectBadge({ size, theme, image, large }: { size: number; theme: BadgeTheme; image: string; large?: boolean }) {
  // Glow căn giữa badge (Figma: 150.08px cho badge 112, 64.4px cho badge 46); SVG glow có vùng tràn riêng (inset âm).
  const glow = large ? 150.08 : 64.4;
  const inset = large ? 6.5 : 3;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div className="absolute" style={{ left: (size - glow) / 2, top: (size - glow) / 2, width: glow, height: glow }}>
        <div className={`absolute ${large ? "inset-[-4%]" : "inset-[-7.76%]"}`}>
          <img src={theme.glow} alt="" className="block size-full max-w-none" />
        </div>
      </div>
      <img src={theme.circle} alt="" className="absolute inset-0 block size-full max-w-none" />
      <img
        src={image}
        alt=""
        className={`absolute max-w-none ${large ? "object-contain" : "object-cover"}`}
        style={{ left: inset, top: inset, width: size - inset * 2, height: size - inset * 2 }}
      />
    </div>
  );
}

function ChunkyButton({ label, variant, className }: { label: string; variant: "orange" | "blue"; className?: string }) {
  const isOrange = variant === "orange";
  return (
    <button
      type="button"
      className={`relative h-[44px] shrink-0 cursor-pointer outline-none transition-[transform,filter] duration-150 ease-out hover:-translate-y-[2px] hover:brightness-110 focus-visible:brightness-110 active:translate-y-0 active:brightness-95 ${isOrange ? "w-[205.333px]" : "w-[205.082px]"} ${className ?? ""}`}
    >
      <span aria-hidden className="absolute inset-0 overflow-hidden">
        {isOrange ? (
          <>
            <img src="/home/schedule/button-orange-base.webp" alt="" className="absolute left-0 top-[-26.42%] h-[148.01%] w-full max-w-none" />
            <img src="/home/schedule/button-orange-top.webp" alt="" className="absolute left-0 top-[-31.35%] h-[172.54%] w-full max-w-none" />
          </>
        ) : (
          <img src="/home/schedule/button-blue.webp" alt="" className="absolute left-0 top-[-30.7%] h-[170.2%] w-full max-w-none" />
        )}
      </span>
      <span
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-center text-[16px] font-bold leading-[24px] text-white ${isOrange ? "[text-shadow:0px_1px_1px_rgba(157,42,0,0.5)]" : "[text-shadow:0px_1px_1px_rgba(0,40,170,0.25)]"}`}
      >
        {label}
      </span>
    </button>
  );
}

function FeaturedCard({ session }: { session: FeaturedSession }) {
  return (
    <article className="flex w-[520px] shrink-0 items-center gap-[18px] self-stretch rounded-[22px] border-2 border-[rgba(143,220,255,0.7)] bg-gradient-to-r from-[rgba(42,99,222,0.92)] via-[rgba(26,70,180,0.92)] via-55% to-[rgba(16,46,128,0.92)] py-[16px] pl-[16px] pr-[18px] shadow-[0px_10px_24px_0px_rgba(3,18,60,0.5),0px_6px_26px_0px_rgba(57,180,255,0.45)]">
      <SubjectBadge size={112} theme={session.badge} image={session.subjectImage} large />
      <div className="flex min-w-px flex-1 flex-col items-start gap-[9px] overflow-clip">
        <div className="flex items-center gap-[10px]">
          <span className="flex items-center gap-[6px] rounded-full border border-[rgba(89,242,199,0.45)] bg-[rgba(89,242,199,0.16)] px-[10px] py-[4px]">
            <img src="/home/schedule/dot.svg" alt="" className="size-[7px]" />
            <span className="whitespace-nowrap text-[12px] font-medium leading-[16px] text-[#59f2c7]">{session.status}</span>
          </span>
          <span className="whitespace-nowrap text-[14px] font-bold leading-[20px] text-[#ffd159]">{session.countdown}</span>
        </div>
        <h3 className="w-full truncate text-[20px] font-bold leading-[32px] text-white">{session.title}</h3>
        <p className="w-full truncate text-[14px] font-medium leading-[20px] text-[rgba(168,199,245,0.95)]">{session.detail}</p>
        <div className="flex w-full items-center gap-[12px] pt-[4px]">
          <ChunkyButton label="Vào lớp ngay" variant="orange" />
          <button
            type="button"
            className="group flex cursor-pointer items-center gap-[4px] text-[16px] font-bold leading-[24px] text-[rgba(191,228,255,0.9)] outline-none transition-colors hover:text-white focus-visible:text-white"
          >
            Xem chi tiết
            <img
              src="/home/schedule/chevron-right.svg"
              alt=""
              className="size-[24px] transition-transform duration-150 group-hover:translate-x-[3px]"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function UpcomingCard({ session }: { session: UpcomingSession }) {
  return (
    <article className="flex w-[264px] shrink-0 flex-col items-start gap-[12px] overflow-clip rounded-[18px] border border-[rgba(107,184,255,0.24)] bg-gradient-to-b from-[rgba(19,50,127,0.62)] to-[rgba(10,28,79,0.62)] p-[14px] shadow-[0px_6px_14px_0px_rgba(3,18,60,0.35)]">
      <div className="flex w-full items-center gap-[10px]">
        <SubjectBadge size={46} theme={session.badge} image={session.subjectImage} />
        <div className="flex min-w-px flex-1 flex-col items-start gap-[2px] overflow-clip whitespace-nowrap">
          <h3 className="w-full truncate text-[18px] font-bold leading-[28px] text-white">{session.subject}</h3>
          <p className="w-full truncate text-[14px] font-medium leading-[20px] text-[rgba(168,199,245,0.95)]">{session.time}</p>
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[2px] overflow-clip whitespace-nowrap">
        <p className="w-full truncate text-[16px] font-bold leading-[24px] text-[rgba(255,255,255,0.92)]">{session.lesson}</p>
        <p className="w-full truncate text-[14px] font-medium leading-[20px] text-[rgba(168,199,245,0.8)]">{session.meta}</p>
      </div>
      <ChunkyButton label="Xem ca học" variant="blue" />
    </article>
  );
}

/** Dải "Lịch lớp" phía dưới màn Trang chủ. */
export function ScheduleStrip() {
  return (
    <section
      aria-label="Lịch lớp"
      className="absolute left-0 flex w-[1440px] flex-col items-center gap-[14px] bg-gradient-to-b from-[rgba(11,30,88,0.2)] via-[rgba(12,33,100,0.72)] via-35% to-[rgba(10,26,78,0.92)] px-[40px] pb-[5px] pt-[12px]"
      style={{ top: STRIP_TOP, bottom: 0 }}
    >
      <div
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[2px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(107,184,255,0) 0%, rgba(127,212,255,0.5) 20%, rgba(234,247,255,0.8) 50%, rgba(127,212,255,0.5) 80%, rgba(107,184,255,0) 100%)",
        }}
      />
      <h2 className="flex w-full items-center gap-[10px] whitespace-nowrap font-bold">
        <span className="text-[16px] leading-[24px] text-white">{scheduleHeading.title}</span>
        <span aria-hidden className="text-[14px] leading-[20px] text-[rgba(107,184,255,0.7)]">
          •
        </span>
        <span className="text-[16px] leading-[24px] text-[rgba(168,199,245,0.95)]">{scheduleHeading.date}</span>
      </h2>
      <div className="flex w-full items-start gap-[16px]">
        <FeaturedCard session={featuredSession} />
        {upcomingSessions.map((session) => (
          <UpcomingCard key={session.id} session={session} />
        ))}
      </div>
    </section>
  );
}
