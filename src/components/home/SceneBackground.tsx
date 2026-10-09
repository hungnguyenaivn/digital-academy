import { OrbitBand } from "./OrbitBand";

// "Đảo xa" — đảo mờ trang trí phía sau quỹ đạo. Blur trong Figma là radius, CSS blur ≈ radius / 2.
const FAR_ISLANDS = [
  { src: "/home/scene/island-english.webp", left: 522, top: 174, size: 62, blur: 3.5, opacity: 0.26 },
  { src: "/home/scene/island-english.webp", left: 844, top: 219, size: 62, blur: 3.5, opacity: 0.26 },
  { src: "/home/scene/island-math.webp", left: 224, top: 162, size: 74, blur: 2.5, opacity: 0.32 },
  { src: "/home/scene/island-math.webp", left: 1128, top: 199, size: 74, blur: 2.5, opacity: 0.32 },
  { src: "/home/scene/island-vietnamese.webp", left: -26, top: 136, size: 100, blur: 2.17, opacity: 0.32 },
  { src: "/home/scene/island-vietnamese.webp", left: 1375, top: 173, size: 100, blur: 2.17, opacity: 0.32 },
];

export function SceneBackground() {
  return (
    <>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: [
            "linear-gradient(180deg, rgb(3 4 66) 0%, rgb(3 4 66 / 0.2) 24.04%, rgb(3 4 66 / 0) 55.66%, rgb(3 4 66 / 0.1) 81.51%, rgb(3 4 66 / 0.4) 97.12%)",
            "url(/home/scene/background.jpg)",
          ].join(","),
          backgroundSize: "100% 100%, cover",
          backgroundPosition: "center",
        }}
      />
      {/* "Lớp phủ nền · tint 10%" */}
      <div aria-hidden className="absolute inset-0 bg-[rgb(0_10_116/0.1)] backdrop-blur-[2px]" />

      {/* "Vùng chọn môn — quỹ đạo": clip theo khung 0,132 · 1440×555 */}
      <div aria-hidden className="pointer-events-none absolute left-0 top-[132px] h-[555px] w-[1440px] overflow-hidden">
        {FAR_ISLANDS.map((island, i) => (
          <img
            key={i}
            src={island.src}
            alt=""
            className="absolute object-contain"
            style={{
              left: island.left,
              top: island.top - 132,
              width: island.size,
              height: island.size,
              opacity: island.opacity,
              filter: `blur(${island.blur}px)`,
            }}
          />
        ))}
      </div>
      <OrbitBand />
    </>
  );
}
