"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { playAnswerFeedback, stopVoiceOver, VoiceButton } from "@/components/game/VoiceOver";

const ANIMALS = {
  camel: { en: "camel", vi: "con lạc đà", emoji: "🐪" },
  lizard: { en: "lizard", vi: "con thằn lằn", emoji: "🦎" },
  snake: { en: "snake", vi: "con rắn", emoji: "🐍" },
  fox: { en: "fox", vi: "con cáo", emoji: "🦊" },
  horse: { en: "horse", vi: "con ngựa", emoji: "🐴" },
  monkey: { en: "monkey", vi: "con khỉ", emoji: "🐒" },
  tiger: { en: "tiger", vi: "con hổ", emoji: "🐯" },
  fish: { en: "fish", vi: "con cá", emoji: "🐟" },
  cat: { en: "cat", vi: "con mèo", emoji: "🐱" },
  rabbit: { en: "rabbit", vi: "con thỏ", emoji: "🐇" },
};
type AnimalId = keyof typeof ANIMALS;

// Mỗi chặng: 1 câu gợi ý ngắn + 3 đáp án (đáp án đúng đổi vị trí theo chặng). Đáp án nhiễu là các con vật đã học ở lớp 3
// (My pets, At the zoo…); gợi ý tiếng Việt giải nghĩa từ khoá của câu.
const ROUNDS: { clue: string; answer: AnimalId; options: AnimalId[]; hint: string }[] = [
  { clue: "I have a hump. I can walk in the hot desert.", answer: "camel", options: ["horse", "camel", "monkey"], hint: "« hump » là cái bướu trên lưng. Con nào có bướu nhỉ?" },
  { clue: "I am small. I like warm rocks.", answer: "lizard", options: ["lizard", "tiger", "fish"], hint: "« small » là nhỏ bé, « warm rocks » là những hòn đá ấm." },
  { clue: "I have no legs. I move on the sand.", answer: "snake", options: ["cat", "lizard", "snake"], hint: "« no legs » là không có chân. Con nào không có chân nhỉ?" },
  { clue: "I have big ears. I look like a small dog.", answer: "fox", options: ["rabbit", "fox", "tiger"], hint: "« big ears » là tai to, « a small dog » là một chú chó nhỏ." },
];

// Vị trí (% khung cảnh) của điểm xuất phát và 4 cột mốc; đường mòn là các đoạn cong nối lần lượt từng điểm.
const STOPS = [
  { x: 8, y: 82 },
  { x: 30, y: 68 },
  { x: 51, y: 84 },
  { x: 72, y: 68 },
  { x: 91, y: 80 },
];
const TRAIL = STOPS.slice(1).map((b, i) => {
  const a = STOPS[i];
  const mid = (a.x + b.x) / 2;
  return `M${a.x} ${a.y}C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`;
});
// Xương rồng đặt giữa các chỗ bạn Cát dừng chân để không chồng lên nhân vật.
const CACTI = [
  { x: 15, y: 60, size: 34 },
  { x: 37, y: 52, size: 24 },
  { x: 58, y: 58, size: 30 },
];

/** Tiếng "Great job/Try again" và đọc từ tiếng Anh của game; lỗi thì bỏ qua — âm thanh chỉ là phần thêm, không chặn việc chơi. */
function feedbackSound(correct: boolean, word = "") {
  try { playAnswerFeedback(correct, word, false); } catch {}
}
function hush() {
  try { stopVoiceOver(); } catch {}
}
const noSubscribe = () => () => {};
const canSpeakNow = () => typeof window.speechSynthesis !== "undefined" && typeof window.SpeechSynthesisUtterance !== "undefined";

export default function DesertCreatureDashClient() {
  // Như các trang game khác: vào mới bằng link thì chơi lại từ đầu, bấm Back/Forward thì giữ nguyên tiến độ.
  const { bfcacheId } = useRouter();
  return (
    <Fragment key={bfcacheId}>
      <DesertCreatureDash />
    </Fragment>
  );
}

function DesertCreatureDash() {
  const [round, setRound] = useState(0);
  const [answered, setAnswered] = useState(false); // đã chọn đúng ở chặng hiện tại
  const [wrong, setWrong] = useState<AnimalId[]>([]); // các con đã chọn sai ở chặng này
  const [picked, setPicked] = useState<AnimalId | null>(null); // lần chọn sai gần nhất → hiện gợi ý
  const [tries, setTries] = useState(0); // đổi key để đọc lại phản hồi mỗi lần chọn
  const canSpeak = useSyncExternalStore(noSubscribe, canSpeakNow, () => false);

  const clueRef = useRef<HTMLHeadingElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const againRef = useRef<HTMLButtonElement>(null);
  const focusClue = useRef(false);

  const r = ROUNDS[round];
  const target = ANIMALS[r.answer];
  const miss = picked ? ANIMALS[picked] : null;
  const solved = round + (answered ? 1 : 0); // số cột mốc đã tới = vị trí của bạn Cát trên đường mòn
  const done = solved === ROUNDS.length;
  const stop = STOPS[solved];
  const emote = done ? "🏆" : answered ? "🎉" : miss ? "🤔" : null;

  // Trang bị ẩn (Activity) hoặc rời đi → dừng giọng đọc đang phát.
  useLayoutEffect(() => hush, []);
  // Dời focus theo lượt chơi để chơi trọn bằng bàn phím: đúng → "Chạy tiếp", về đích → "Chơi lại", chặng mới → câu gợi ý.
  useEffect(() => {
    if (done) againRef.current?.focus();
    else if (answered) nextRef.current?.focus();
    else if (focusClue.current) {
      focusClue.current = false;
      clueRef.current?.focus();
    }
  }, [round, answered, done]);

  function choose(id: AnimalId) {
    if (answered) return;
    setTries((n) => n + 1);
    if (id === r.answer) {
      setAnswered(true);
      setPicked(null);
      feedbackSound(true, target.en);
    } else {
      setWrong((w) => (w.includes(id) ? w : [...w, id]));
      setPicked(id);
      feedbackSound(false);
    }
  }

  function goTo(next: number) {
    hush();
    focusClue.current = true;
    setRound(next);
    setAnswered(false);
    setWrong([]);
    setPicked(null);
  }

  return (
    <div className="ct-dash">
      <div className="page-head">
        <p className="ct-kicker" lang="en">Desert Creature Dash</p>
        <h1 className="title-kid">🏜️ Thám hiểm sa mạc</h1>
        <p className="muted-light">
          Đọc gợi ý tiếng Anh rồi chọn đúng con vật. Mỗi lần đúng, bạn Cát chạy tới cột mốc tiếp theo. Không tính giờ, sai thì cứ thử lại nhé!
        </p>
      </div>

      <div className="ct-layout">
        <section className="ct-scene" aria-label="Đường mòn sa mạc">
          <p className="ct-progress">🚩 Cột mốc {solved}/{ROUNDS.length}</p>
          <span className="ct-sun" aria-hidden />
          {CACTI.map((c) => (
            <span key={c.x} className="ct-cactus" style={{ left: `${c.x}%`, top: `${c.y}%`, fontSize: c.size }} aria-hidden>🌵</span>
          ))}
          <svg className="ct-trail" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            {TRAIL.map((d) => <path key={d} className="ct-trail-edge" d={d} vectorEffect="non-scaling-stroke" />)}
            {TRAIL.map((d) => <path key={d} className="ct-trail-sand" d={d} vectorEffect="non-scaling-stroke" />)}
            {TRAIL.map((d, i) => <path key={d} className={`ct-trail-walked${i < solved ? " on" : ""}`} d={d} vectorEffect="non-scaling-stroke" />)}
          </svg>
          {ROUNDS.map((x, i) => (
            <span
              key={x.answer}
              className={`ct-sign ${i < solved ? "done" : i === solved ? "next" : "todo"}`}
              style={{ left: `${STOPS[i + 1].x}%`, top: `${STOPS[i + 1].y}%` }}
              aria-hidden
            >
              {i === ROUNDS.length - 1 && <span className="ct-flag">🏁</span>}
              <span className="ct-sign-face">{i < solved ? ANIMALS[x.answer].emoji : "?"}</span>
            </span>
          ))}
          {/* Bạn Cát đứng ngay trước cột mốc vừa tới (lệch trái 44px để không che biển). */}
          <span
            className={`ct-explorer${solved === 0 ? " at-start" : ""}`}
            style={{ left: solved ? `calc(${stop.x}% - 44px)` : `${stop.x}%`, top: `${stop.y}%` }}
            aria-hidden
          >
            {emote && <span className="ct-emote" key={`${solved}-${tries}`}>{emote}</span>}
            <span className="ct-shadow" />
            <span className="ct-runner" key={solved} data-jog={solved > 0 || undefined} data-cheer={done || undefined}>
              <span className="ct-pack" />
              <span className="ct-leg l" />
              <span className="ct-leg r" />
              <span className="ct-body" />
              <span className="ct-arm" />
              <span className="ct-head"><span className="ct-eye" /></span>
              <span className="ct-hat" />
            </span>
          </span>
        </section>

        <section className="ct-card" aria-label="Câu đố">
          {!done && (
            <>
              <div className="ct-card-head">
                <span className="ct-tag">Câu đố số {round + 1}</span>
                {canSpeak && <VoiceButton text={r.clue} label="câu gợi ý" includeVietnamese={false} />}
              </div>
              <h2 key={round} ref={clueRef} tabIndex={-1} className="ct-clue" lang="en">{r.clue}</h2>
              <p className="ct-help">Đọc gợi ý rồi chạm vào con vật đúng nhé!</p>
              <div className="ct-options" role="group" aria-label="Chọn con vật">
                {r.options.map((id) => {
                  const a = ANIMALS[id];
                  const right = answered && id === r.answer;
                  const missed = wrong.includes(id);
                  return (
                    <button
                      key={`${round}-${id}`}
                      type="button"
                      className={`ct-option${right ? " is-right" : ""}${missed ? " is-wrong" : ""}`}
                      aria-disabled={answered || undefined}
                      onClick={() => choose(id)}
                    >
                      <span className="ct-emoji" aria-hidden>{a.emoji}</span>{" "}
                      <span className="ct-en" lang="en">{a.en}</span>{" "}
                      <span className="ct-vi">{a.vi}</span>
                      {right && <i className="ct-tick" aria-hidden>✓</i>}
                      {(right || missed) && <span className="sr-only">{right ? " – đúng rồi" : " – chưa đúng"}</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          <div className={`ct-feedback${answered ? " q-feedback ok" : miss ? " q-feedback no" : ""}`}>
            <div aria-live="polite">
              {answered ? (
                <p key={`ok-${round}`}>
                  <strong>Đúng rồi! 🎉 {done ? "Bạn Cát đã về đích!" : `Bạn Cát chạy tới cột mốc ${solved}.`}</strong>{" "}
                  <span className="ct-reveal">
                    <span className="ct-say" lang="en">{target.en}</span> = {target.vi}
                  </span>
                </p>
              ) : miss ? (
                <p key={`no-${tries}`}>
                  <strong>Chưa đúng rồi, em thử lại nhé!</strong>{" "}
                  Đó là {miss.vi} (<span lang="en">{miss.en}</span>). Gợi ý: {r.hint}
                </p>
              ) : null}
            </div>
            {answered && (
              <div className="ct-feedback-actions">
                {canSpeak && <VoiceButton text={target.en} label={`từ ${target.en}`} includeVietnamese={false} />}
                {!done && (
                  <button ref={nextRef} type="button" className="btn btn-primary" onClick={() => goTo(round + 1)}>
                    Chạy tiếp ▶
                  </button>
                )}
              </div>
            )}
          </div>

          {done && (
            <div className="ct-done">
              <p className="title-kid">🏁 Về đích rồi! Em giỏi quá!</p>
              <p>Trên đường mòn sa mạc, em đã gặp 4 con vật:</p>
              <ul className="ct-recap">
                {ROUNDS.map(({ answer }) => {
                  const a = ANIMALS[answer];
                  return (
                    <li key={answer}>
                      <span className="ct-recap-emoji" aria-hidden>{a.emoji}</span>
                      <span className="ct-recap-words"><b lang="en">{a.en}</b> <small>{a.vi}</small></span>
                      {canSpeak && <VoiceButton text={a.en} label={`từ ${a.en}`} includeVietnamese={false} />}
                    </li>
                  );
                })}
              </ul>
              <div className="ct-done-actions">
                <button ref={againRef} type="button" className="btn btn-primary" onClick={() => goTo(0)}>Chơi lại</button>
                <Link href="/world/tieng-anh" className="btn btn-light">Về thế giới Tiếng Anh</Link>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
