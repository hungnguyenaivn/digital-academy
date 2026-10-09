import { ORBIT_DOTS, type OrbitDot } from "./orbit-dots";

// Elip quỹ đạo trong Figma: x -316, y -418, 2040×860 (toạ độ khung), stroke căn INSIDE.
const ELLIPSE = { cx: -316 + 1020, cy: -418 + 430, rx: 1020, ry: 430 };

// Ba lớp stroke chồng nhau: Halo ngoài / Dải sáng / Lõi sáng.
// `alphas` là alpha tại các mốc GRADIENT_OFFSETS (gradient ngang, đối xứng).
const GRADIENT_OFFSETS = [0, 0.14, 0.26, 0.4, 0.5, 0.6, 0.74, 0.86, 1];
const STROKES = [
  { id: "halo", color: "46,134,255", alphas: [0, 0.04, 0.25, 0.45, 0.5, 0.45, 0.25, 0.04, 0], width: 46, blur: 46, opacity: 0.7 },
  { id: "band", color: "127,212,255", alphas: [0, 0.04, 0.36, 0.648, 0.72, 0.648, 0.36, 0.04, 0], width: 16, blur: 18, opacity: 0.8 },
  { id: "core", color: "234,247,255", alphas: [0, 0.04, 0.4, 0.72, 0.8, 0.72, 0.4, 0.04, 0], width: 2, blur: 3, opacity: 0.5 },
];

function sparklePath(cx: number, cy: number, size: number) {
  const outer = size / 2;
  const inner = outer * 0.1;
  const points: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 4) * i - Math.PI / 2;
    points.push(`${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}

function Dot({ dot }: { dot: OrbitDot }) {
  if (dot.kind === "sparkle") {
    return <path d={sparklePath(dot.cx, dot.cy, dot.size)} fill={dot.color} fillOpacity={dot.fillOpacity} />;
  }
  return (
    <circle
      cx={dot.cx}
      cy={dot.cy}
      r={dot.size / 2}
      fill={dot.color}
      fillOpacity={dot.fillOpacity}
      filter={dot.kind === "bokeh" ? "url(#orbit-bokeh-blur)" : undefined}
    />
  );
}

/** Dải sáng quỹ đạo + đốm sáng. Vẽ trong vùng "Vùng chọn môn — quỹ đạo" (0,132 · 1440×555, clip). */
export function OrbitBand() {
  return (
    <svg
      className="pointer-events-none absolute left-0 top-[132px] h-[555px] w-[1440px]"
      viewBox="0 132 1440 555"
      aria-hidden
    >
      <defs>
        {STROKES.map((s) => (
          <linearGradient key={s.id} id={`orbit-${s.id}`} x1="0" x2="1" y1="0" y2="0">
            {GRADIENT_OFFSETS.map((offset, i) => (
              <stop key={offset} offset={offset} stopColor={`rgb(${s.color})`} stopOpacity={s.alphas[i]} />
            ))}
          </linearGradient>
        ))}
        {STROKES.map((s) => (
          <filter key={s.id} id={`orbit-${s.id}-blur`} x="-10%" y="-20%" width="120%" height="140%">
            <feGaussianBlur stdDeviation={s.blur / 2} />
          </filter>
        ))}
        <filter id="orbit-bokeh-blur" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation={2} />
        </filter>
        <filter id="orbit-halo-dots-blur" x="-5%" y="-20%" width="110%" height="140%">
          <feGaussianBlur stdDeviation={4.5} />
        </filter>
      </defs>

      {STROKES.map((s) => (
        <ellipse
          key={s.id}
          cx={ELLIPSE.cx}
          cy={ELLIPSE.cy}
          rx={ELLIPSE.rx - s.width / 2}
          ry={ELLIPSE.ry - s.width / 2}
          fill="none"
          stroke={`url(#orbit-${s.id})`}
          strokeWidth={s.width}
          opacity={s.opacity}
          filter={`url(#orbit-${s.id}-blur)`}
        />
      ))}

      {/* "Đốm sáng · quầng": bản sao mờ của các đốm, opacity 85% */}
      <g opacity={0.85} filter="url(#orbit-halo-dots-blur)">
        {ORBIT_DOTS.map((d, i) => (
          <Dot key={i} dot={d} />
        ))}
      </g>
      <g>
        {ORBIT_DOTS.map((d, i) => (
          <Dot key={i} dot={d} />
        ))}
      </g>
    </svg>
  );
}
