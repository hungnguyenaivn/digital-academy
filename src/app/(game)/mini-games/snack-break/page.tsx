import GameTopbar from "@/components/game/GameTopbar";
import SnackBreakClient from "./SnackBreakClient";

export const metadata = { title: "Bữa xế vũ trụ · Vũ trụ Tri thức" };

/** Mini-game thưởng của thế giới Tiếng Anh: cho bạn Bim ăn và nghe câu "I am eating …". Không lưu tiến độ, không cộng xu. */
export default function SnackBreakPage() {
  return (
    <main className="space-bg">
      <GameTopbar back={{ href: "/world/tieng-anh", label: "Thế giới Tiếng Anh" }} />
      <div className="page">
        <SnackBreakClient />
      </div>
    </main>
  );
}
