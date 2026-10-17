"use client";

import type { ButtonHTMLAttributes } from "react";

type SpeechLanguage = "en-US" | "vi-VN";
type SpeechPart = { text: string; language: SpeechLanguage };
type VoiceProfile = { name: string; rate: number };

const VOICE_PROFILES: Record<SpeechLanguage, VoiceProfile> = {
  "en-US": { name: "Samantha", rate: 0.84 },
  "vi-VN": { name: "Linh", rate: 0.94 },
};

let activeAudio: HTMLAudioElement | null = null;
let speechRequestId = 0;
let voiceListPromise: Promise<SpeechSynthesisVoice[]> | null = null;

const VIETNAMESE_MARKS = /[À-ỹ]/u;
const VIETNAMESE_WORDS = /\b(?:con|chọn|câu|đúng|sai|hỏi|là|màu|nghĩa|số|tiếng|trong|em|bạn|mình|nào|này|nhé|từ|của|và|với|mẹ|bố|ông|bà|meo)\b/i;
const QUOTED_TEXT = /(«[^»]+»|“[^”]+”|"[^"]+")/g;

function languageOf(text: string, fallback: SpeechLanguage): SpeechLanguage {
  return VIETNAMESE_MARKS.test(text) || VIETNAMESE_WORDS.test(text) ? "vi-VN" : fallback;
}

function addPart(parts: SpeechPart[], text: string, fallback: SpeechLanguage) {
  const clean = text.trim();
  if (clean) parts.push({ text: clean, language: languageOf(clean, fallback) });
}

function splitAtVietnameseInstruction(text: string): SpeechPart[] | null {
  const colon = text.indexOf(":");
  if (colon < 0) return null;
  const lead = text.slice(0, colon);
  const example = text.slice(colon + 1);
  if (!VIETNAMESE_MARKS.test(lead) && !VIETNAMESE_WORDS.test(lead)) return null;
  if (!example.trim()) return null;
  const parts: SpeechPart[] = [];
  addPart(parts, lead, "vi-VN");
  addPart(parts, example, "en-US");
  return parts;
}

function speechParts(text: string): SpeechPart[] {
  const parts: SpeechPart[] = [];
  for (const segment of text.split(QUOTED_TEXT)) {
    const quoted = segment.startsWith("«") || segment.startsWith("“") || segment.startsWith('"');
    if (quoted) {
      addPart(parts, segment.slice(1, -1), "en-US");
      continue;
    }
    const mixed = splitAtVietnameseInstruction(segment);
    if (mixed) parts.push(...mixed);
    else addPart(parts, segment, "en-US");
  }
  return parts;
}

function stopAudio() {
  if (!activeAudio) return;
  activeAudio.onended = null;
  activeAudio.onerror = null;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

export function stopVoiceOver() {
  speechRequestId += 1;
  stopAudio();
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
}

function voicesWhenReady(synthesis: SpeechSynthesis): Promise<SpeechSynthesisVoice[]> {
  const voices = synthesis.getVoices();
  if (voices.length > 0) return Promise.resolve(voices);
  if (voiceListPromise) return voiceListPromise;

  voiceListPromise = new Promise((resolve) => {
    let settled = false;
    let timeoutId = 0;
    const finish = (available: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      synthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(available);
    };
    const onVoicesChanged = () => {
      const available = synthesis.getVoices();
      if (available.length > 0) finish(available);
    };

    synthesis.addEventListener("voiceschanged", onVoicesChanged);
    timeoutId = window.setTimeout(() => finish(synthesis.getVoices()), 1200);
    onVoicesChanged();
  }).finally(() => {
    voiceListPromise = null;
  });
  return voiceListPromise;
}

function preferredVoice(language: SpeechLanguage, voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | undefined {
  const profile = VOICE_PROFILES[language];
  return voices.find((voice) => voice.name.includes(profile.name))
    ?? voices.find((voice) => voice.lang.toLowerCase().startsWith(language.slice(0, 2)))
    ?? undefined;
}

export function speakLearningText(text: string, includeVietnamese = true) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  stopVoiceOver();
  const requestId = speechRequestId;
  const synthesis = window.speechSynthesis;
  const parts = speechParts(text).filter((part) => includeVietnamese || part.language !== "vi-VN");

  void voicesWhenReady(synthesis).then((voices) => {
    if (requestId !== speechRequestId) return;
    for (const part of parts) {
      if (requestId !== speechRequestId) return;
      const utterance = new SpeechSynthesisUtterance(part.text);
      const profile = VOICE_PROFILES[part.language];
      utterance.lang = part.language;
      utterance.rate = profile.rate;
      const voice = preferredVoice(part.language, voices);
      if (voice) utterance.voice = voice;
      synthesis.speak(utterance);
    }
  });
}

export function playAnswerFeedback(correct: boolean, explanation: string, includeVietnamese = true) {
  stopVoiceOver();
  if (typeof window === "undefined") return;
  const audio = new Audio(`/audio/${correct ? "great-job" : "try-again"}.m4a`);
  activeAudio = audio;
  const continueWithExplanation = () => {
    if (activeAudio === audio) activeAudio = null;
    if (explanation) speakLearningText(explanation, includeVietnamese);
  };
  audio.onended = continueWithExplanation;
  audio.onerror = () => {
    if (activeAudio === audio) activeAudio = null;
    speakLearningText(`${correct ? "Great job!" : "Try again!"} ${explanation}`, includeVietnamese);
  };
  void audio.play().catch(() => {
    if (activeAudio === audio) activeAudio = null;
    speakLearningText(`${correct ? "Great job!" : "Try again!"} ${explanation}`, includeVietnamese);
  });
}

export function VoiceButton({
  text,
  label,
  includeVietnamese = true,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  label?: string;
  includeVietnamese?: boolean;
}) {
  return (
    <button
      type="button"
      className={`voice-button ${className}`.trim()}
      aria-label={`Nghe ${label ?? text}`}
      title={`Nghe ${label ?? text}`}
      onClick={() => speakLearningText(text, includeVietnamese)}
      {...props}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        <path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" />
      </svg>
    </button>
  );
}

export function VietnameseGuidanceToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      className="voice-toggle"
      aria-pressed={enabled}
      onClick={onToggle}
      title="Bật hoặc tắt phần hướng dẫn bằng tiếng Việt"
    >
      🇻🇳 Hướng dẫn {enabled ? "bật" : "tắt"}
    </button>
  );
}
