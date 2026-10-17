"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

type FoodId = "apple" | "mango" | "watermelon" | "blueberries";

const FOODS: { id: FoodId; emoji: string; vi: string; en: string; sentence: string; meaning: string; reaction: string }[] = [
  { id: "apple", emoji: "🍎", vi: "Táo", en: "apple", sentence: "I am eating an apple.", meaning: "Em đang ăn một quả táo.", reaction: "Giòn rụm! Rộp rộp!" },
  { id: "mango", emoji: "🥭", vi: "Xoài", en: "mango", sentence: "I am eating a mango.", meaning: "Em đang ăn một quả xoài.", reaction: "Ngọt lịm luôn!" },
  { id: "watermelon", emoji: "🍉", vi: "Dưa hấu", en: "watermelon", sentence: "I am eating watermelon.", meaning: "Em đang ăn dưa hấu.", reaction: "Mát lạnh cả bụng!" },
  { id: "blueberries", emoji: "🫐", vi: "Việt quất", en: "blueberries", sentence: "I am eating blueberries.", meaning: "Em đang ăn việt quất.", reaction: "Chua chua ngọt ngọt!" },
];
const FOOD = Object.fromEntries(FOODS.map((f) => [f.id, f])) as Record<FoodId, (typeof FOODS)[number]>;

/** Đọc câu tiếng Anh nếu trình duyệt hỗ trợ; lỗi thì im lặng bỏ qua (giọng đọc chỉ là phần thêm). */
function speak(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.85;
    synth.speak(u);
  } catch {}
}
function stopSpeaking() {
  try { window.speechSynthesis?.cancel(); } catch {}
}
const noSubscribe = () => () => {};
const canSpeakNow = () => typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";

export default function SnackBreakClient() {
  // Như các trang game khác: vào mới bằng link thì chơi lại từ đầu, bấm Back/Forward thì giữ nguyên tiến độ.
  const { bfcacheId } = useRouter();
  return (
    <Fragment key={bfcacheId}>
      <SnackBreak />
    </Fragment>
  );
}

function SnackBreak() {
  const [selected, setSelected] = useState<FoodId | null>(null);
  const [tried, setTried] = useState<FoodId[]>([]);
  const [current, setCurrent] = useState<FoodId | null>(null);
  const [bite, setBite] = useState(0); // đổi key để chạy lại hoạt ảnh nhai mỗi lần cho ăn
  const [nudge, setNudge] = useState(0); // chạm Bim khi chưa chọn món → nhắc
  const [drag, setDrag] = useState<{ id: FoodId; x: number; y: number } | null>(null);
  const [over, setOver] = useState(false);
  const canSpeak = useSyncExternalStore(noSubscribe, canSpeakNow, () => false);

  const bimRef = useRef<HTMLButtonElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);
  const press = useRef<{ id: FoodId; x: number; y: number; active: boolean } | null>(null);
  const skipClick = useRef(false);

  const done = tried.length === FOODS.length;
  const food = current ? FOOD[current] : null;

  // Trang bị ẩn (Activity) hoặc rời đi → dừng giọng đọc đang phát.
  useLayoutEffect(() => stopSpeaking, []);
  useEffect(() => {
    if (done) againRef.current?.focus();
  }, [done]);

  function feed(id: FoodId) {
    setTried((t) => (t.includes(id) ? t : [...t, id]));
    setCurrent(id);
    setSelected(null);
    setBite((n) => n + 1);
    speak(FOOD[id].sentence);
  }

  function restart() {
    stopSpeaking();
    setSelected(null);
    setTried([]);
    setCurrent(null);
    bimRef.current?.focus();
  }

  function onFoodClick(id: FoodId) {
    if (skipClick.current) { skipClick.current = false; return; }
    // Chạm lần hai vào món đang chọn = cho ăn luôn (tiện cho bàn phím).
    if (selected === id) feed(id);
    else setSelected(id);
  }

  function onBimClick() {
    if (selected) feed(selected);
    else setNudge((n) => n + 1);
  }

  const overBim = (x: number, y: number) => {
    const r = bimRef.current?.getBoundingClientRect();
    return !!r && x >= r.left - 16 && x <= r.right + 16 && y >= r.top - 16 && y <= r.bottom + 16;
  };

  function onPointerDown(e: ReactPointerEvent<HTMLButtonElement>, id: FoodId) {
    if (e.button !== 0) return;
    press.current = { id, x: e.clientX, y: e.clientY, active: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function onPointerMove(e: ReactPointerEvent<HTMLButtonElement>) {
    const p = press.current;
    if (!p) return;
    if (!p.active && Math.hypot(e.clientX - p.x, e.clientY - p.y) < 8) return;
    p.active = true;
    setDrag({ id: p.id, x: e.clientX, y: e.clientY });
    setOver(overBim(e.clientX, e.clientY));
  }
  function onPointerUp(e: ReactPointerEvent<HTMLButtonElement>) {
    const p = press.current;
    press.current = null;
    if (!p?.active) return;
    skipClick.current = true;
    setTimeout(() => { skipClick.current = false; }, 0);
    setDrag(null);
    setOver(false);
    if (overBim(e.clientX, e.clientY)) feed(p.id);
  }
  function onPointerCancel() {
    press.current = null;
    setDrag(null);
    setOver(false);
  }

  const hungry = !!selected || over;
  const bubble = nudge && !selected && !food ? "Em chọn một món cho tớ trước nhé!" : food ? food.reaction : hungry ? "Ôi, cho tớ hả? Măm măm!" : "Chào em! Tớ là Bim. Tớ đói bụng quá!";

  return (
    <div className="snack-break">
      <div className="page-head">
        <h1 className="title-kid">🍽️ Bữa xế vũ trụ</h1>
        <p className="muted-light">
          Kéo một món ăn tới bạn Bim, hoặc chạm vào món ăn rồi chạm vào Bim. Món nào trước cũng được, không có đáp án sai!
        </p>
      </div>

      <div className="sb-layout">
        <section className="sb-stage" aria-label="Bạn Bim">
          <p className="sb-bubble" key={`${bite}-${nudge}-${hungry}`}>{bubble}</p>
          <button
            ref={bimRef}
            type="button"
            className={`sb-bim${hungry ? " hungry" : ""}${over ? " over" : ""}`}
            onClick={onBimClick}
            aria-label={selected ? `Cho bạn Bim ăn ${FOOD[selected].vi.toLowerCase()}` : "Bạn Bim. Hãy chọn một món ăn trước"}
          >
            <span className="sb-body" key={bite} data-chomp={bite > 0 || undefined}>
              <span className="sb-antenna" />
              <span className="sb-eye l" />
              <span className="sb-eye r" />
              <span className="sb-cheek l" />
              <span className="sb-cheek r" />
              <span className="sb-mouth" />
              {food && bite > 0 && <span className="sb-crumb" aria-hidden>{food.emoji}</span>}
            </span>
            <span className="sb-feet" />
          </button>
        </section>

        <section className="sb-panel">
          <div className="sb-progress" aria-label={`Đã thử ${tried.length} trên ${FOODS.length} món`}>
            <span>Đã thử {tried.length}/{FOODS.length} món</span>
            <span className="sb-dots" aria-hidden>
              {FOODS.map((f) => <i key={f.id} className={tried.includes(f.id) ? "on" : ""} />)}
            </span>
          </div>

          <div className="sb-tray" role="group" aria-label="Khay đồ ăn">
            {FOODS.map((f) => {
              const isTried = tried.includes(f.id);
              return (
                <button
                  key={f.id}
                  type="button"
                  className={`sb-food${selected === f.id ? " selected" : ""}${isTried ? " tried" : ""}${drag?.id === f.id ? " dragging" : ""}`}
                  aria-pressed={selected === f.id}
                  aria-label={`${f.vi} (${f.en})${isTried ? ", đã cho ăn, chọn lại để nghe lại câu" : ""}`}
                  onClick={() => onFoodClick(f.id)}
                  onPointerDown={(e) => onPointerDown(e, f.id)}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerCancel}
                >
                  <span className="sb-emoji" aria-hidden>{f.emoji}</span>
                  <span className="sb-name">{f.vi}</span>
                  <span className="sb-en">{f.en}</span>
                  {isTried && <i className="sb-tick" aria-hidden>✓</i>}
                </button>
              );
            })}
          </div>

          <div className="sb-sentence" aria-live="polite">
            {food ? (
              <>
                <p className="sb-en-line" lang="en">{food.sentence}</p>
                <p className="sb-vi-line">{food.meaning}</p>
                {canSpeak && (
                  <button type="button" className="btn btn-light btn-sm" onClick={() => speak(food.sentence)}>
                    🔊 Nghe lại
                  </button>
                )}
              </>
            ) : (
              <p className="sb-vi-line">{selected ? `Giờ chạm vào bạn Bim để cho Bim ăn ${FOOD[selected].vi.toLowerCase()} nhé!` : "Chọn một món ăn trong khay nào!"}</p>
            )}
          </div>

          {done && (
            <div className="sb-done" role="status">
              <p className="title-kid">🎉 Bim no căng bụng rồi!</p>
              <p>Em đã cho Bim ăn đủ 4 món và nghe 4 câu tiếng Anh. Giỏi quá!</p>
              <div className="sb-done-actions">
                <button ref={againRef} type="button" className="btn btn-primary" onClick={restart}>Chơi lại</button>
                <Link href="/world/tieng-anh" className="btn btn-light">Về thế giới Tiếng Anh</Link>
              </div>
            </div>
          )}
        </section>
      </div>

      {drag && (
        <span className="sb-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden>{FOOD[drag.id].emoji}</span>
      )}
    </div>
  );
}
