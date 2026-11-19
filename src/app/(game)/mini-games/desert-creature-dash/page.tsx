import GameTopbar from "@/components/game/GameTopbar";
import DesertCreatureDashClient from "./DesertCreatureDashClient";

export const metadata = { title: "Thám hiểm sa mạc · Vũ trụ Tri thức" };

/** Mini-game thưởng của thế giới Tiếng Anh: đọc gợi ý tiếng Anh, đoán con vật sa mạc để bạn Cát chạy về đích. Không lưu tiến độ, không cộng xu. */
export default function DesertCreatureDashPage() {
  return (
    <main className="space-bg">
      <GameTopbar back={{ href: "/world/tieng-anh", label: "Thế giới Tiếng Anh" }} />
      <div className="page">
        <DesertCreatureDashClient />
      </div>
    </main>
  );
}
