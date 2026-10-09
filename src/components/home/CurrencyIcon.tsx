import type { CSSProperties } from "react";

// Icon xu / kim cương ghép từ nhiều lớp vector trong Figma. Mỗi lớp giữ đúng `inset` (%) của layer gốc
// trong khung 32×32; lớp `skewed` là vector đã xoay + skew (dùng container query để giữ tỉ lệ như Figma).
type Layer = {
  file: string;
  inset: string;
  blend?: CSSProperties["mixBlendMode"];
  skewed?: { w: string; h: string; transform: string };
};

const COIN: Layer[] = [
  { file: "coin-union.svg", inset: "2% 0 0 0" },
  { file: "coin-0.svg", inset: "6.12% 3.47% 3.41% 2.84%" },
  { file: "coin-1.svg", inset: "4.73% 12.16% 6.22% 3.05%" },
  { file: "coin-2.svg", inset: "15.46% 26.6% 17.39% 14.54%" },
  { file: "coin-3.svg", inset: "16.66% 26.63% 17.41% 23.25%" },
  { file: "coin-4.svg", inset: "27.95% 30.35% 28.24% 27.05%", blend: "lighten" },
  {
    file: "coin-5.svg",
    inset: "-0.94% 43.57% 28.5% -4.52%",
    blend: "screen",
    skewed: { w: "hypot(62.4776cqw, -79.7537cqh)", h: "hypot(37.5224cqw, 20.2463cqh)", transform: "rotate(-56.61deg) skewX(0.71deg)" },
  },
  {
    file: "coin-6.svg",
    inset: "-4.46% 40.67% 32% -2.66%",
    blend: "screen",
    skewed: { w: "hypot(60.228cqw, -78.178cqh)", h: "hypot(39.772cqw, 21.822cqh)", transform: "rotate(-56.61deg) skewX(0.71deg)" },
  },
];

const GEM: Layer[] = [
  // "Union" nằm trong khung inset 4% 0 0 4%, bản thân lệch thêm 0.15% 0.34% 0.38% 0.57%.
  { file: "gem-union.svg", inset: "4.14% 0.34% 0.36% 4.55%" },
  { file: "gem-0.svg", inset: "6.56% 3.7% 54.79% 32.86%" },
  { file: "gem-1.svg", inset: "9.03% 51.43% 33.69% 7.61%" },
  { file: "gem-2.svg", inset: "27.45% 25.26% 16.35% 23.62%" },
  { file: "gem-3.svg", inset: "41.33% 3.7% 10.52% 55.65%" },
  { file: "gem-4.svg", inset: "48.44% 19.4% 3.74% 7.61%" },
  { file: "gem-5.svg", inset: "6.56% 21.28% 72.55% 32.86%" },
  { file: "gem-6.svg", inset: "6.56% 21.28% 58.67% 48.57%" },
  { file: "gem-7.svg", inset: "6.56% 3.7% 54.79% 74.74%" },
  { file: "gem-8.svg", inset: "48.44% 71.9% 3.74% 7.61%" },
  { file: "gem-9.svg", inset: "66.31% 44.35% 3.74% 23.62%" },
  { file: "gem-10.svg", inset: "83.65% 19.4% 3.74% 28.1%" },
  { file: "gem-11.svg", inset: "6.56% 21.28% 56.9% 32.86%", blend: "lighten" },
  { file: "gem-12.svg", inset: "54.6% 30.36% 13.09% 23.62%" },
  {
    file: "gem-13.svg",
    inset: "0 27.64% 2.38% 0",
    blend: "screen",
    skewed: { w: "hypot(71.6271cqw, -85.6576cqh)", h: "hypot(28.3729cqw, 14.3424cqh)", transform: "rotate(-58.21deg) skewX(-2.5deg)" },
  },
  {
    file: "gem-14.svg",
    inset: "16.87% 41.99% 19.24% 14.35%",
    blend: "screen",
    skewed: { w: "hypot(83.8862cqw, -92.4901cqh)", h: "hypot(16.1138cqw, 7.5099cqh)", transform: "rotate(-58.21deg) skewX(-2.5deg)" },
  },
];

const ICONS = { coin: COIN, gem: GEM };

export function CurrencyIcon({ kind, className }: { kind: keyof typeof ICONS; className?: string }) {
  return (
    <div aria-hidden className={`absolute size-[32px] isolate ${className ?? ""}`}>
      {ICONS[kind].map((layer) =>
        layer.skewed ? (
          <div
            key={layer.file}
            className="absolute flex items-center justify-center"
            style={{ inset: layer.inset, mixBlendMode: layer.blend, containerType: "size" }}
          >
            <img
              src={`/home/header/${layer.file}`}
              alt=""
              className="block max-w-none flex-none"
              style={{ width: layer.skewed.w, height: layer.skewed.h, transform: layer.skewed.transform }}
            />
          </div>
        ) : (
          <div key={layer.file} className="absolute" style={{ inset: layer.inset, mixBlendMode: layer.blend }}>
            <img src={`/home/header/${layer.file}`} alt="" className="absolute inset-0 block size-full max-w-none" />
          </div>
        ),
      )}
    </div>
  );
}
