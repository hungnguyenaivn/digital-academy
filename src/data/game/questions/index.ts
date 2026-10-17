/**
 * Ngân hàng câu hỏi đã đánh chỉ mục.
 *  - Level cũ: `${slug}-L${n}` / `${slug}-L${n}-Q${i}`
 *  - Bài Global Success: `tieng-anh-U01` / ID câu hỏi theo nội dung
 * CHỈ Netlify Function được import file này: nó chứa đáp án đúng.
 */
import { LEVELS_PER_WORLD } from "../../../lib/game/rules";
import { WORLD_LEVEL_COUNTS, WORLD_META, englishUnitId, levelId } from "../../../lib/game/worlds";
import ai from "./ai-cong-nghe";
import cyber from "./cyber-world";
import english, { GRADE3_GLOBAL_SUCCESS_UNITS } from "./tieng-anh";
import math from "./toan-ly-hoa";
import type { QuestionRow, WorldBank } from "./types";

export type QuestionType = "MCQ" | "TRUE_FALSE";
export type CurriculumCategory = "vocabulary" | "pattern" | "phonics";

export type BankQuestion = {
  id: string;
  levelId: string;
  worldSlug: string;
  levelNumber: number;
  index: number;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  curriculumCategory?: CurriculumCategory;
};

export type BankLevel = { id: string; worldSlug: string; number: number; title: string; questions: BankQuestion[] };

export type BankWorld = {
  slug: string;
  name: string;
  subtitle: string;
  color: string;
  order: number;
  levels: BankLevel[];
};

export { levelId };
export const questionId = (slug: string, n: number, i: number) => `${slug}-L${n}-Q${i}`;

const STANDARD_BANKS: WorldBank[] = [ai, math, cyber];
const STANDARD_BANK_SLUGS = new Set(STANDARD_BANKS.map((bank) => bank.slug));

function rowToQuestion(row: QuestionRow, slug: string, n: number, i: number): BankQuestion {
  const base = { id: questionId(slug, n, i), levelId: levelId(slug, n), worldSlug: slug, levelNumber: n, index: i };
  if (row[0] === "m") {
    return { ...base, type: "MCQ", prompt: row[1], options: [...row[2]], correctIndex: row[3], explanation: row[4] };
  }
  return { ...base, type: "TRUE_FALSE", prompt: row[1], options: ["Đúng", "Sai"], correctIndex: row[2] ? 0 : 1, explanation: row[3] };
}

const curriculumSlug = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function mcq(
  id: string,
  levelIdValue: string,
  unitNumber: number,
  prompt: string,
  correct: string,
  distractors: string[],
  explanation: string,
  category: CurriculumCategory,
  seed: number,
): BankQuestion {
  const options = [...new Set([correct, ...distractors.filter((value) => value !== correct)])].slice(0, 4);
  const shift = seed % options.length;
  const rotated = [...options.slice(shift), ...options.slice(0, shift)];
  return {
    id,
    levelId: levelIdValue,
    worldSlug: "tieng-anh",
    levelNumber: unitNumber,
    index: seed + 1,
    type: "MCQ",
    prompt,
    options: rotated,
    correctIndex: rotated.indexOf(correct),
    explanation,
    curriculumCategory: category,
  };
}

const allPatternExamples = GRADE3_GLOBAL_SUCCESS_UNITS.flatMap((unit) =>
  unit.patterns.map((pattern) => ({ unit: unit.unit, example: pattern.exampleSentence })),
);
const phonicsPairs = GRADE3_GLOBAL_SUCCESS_UNITS.map((unit) => ({
  unit: unit.unit,
  words: unit.phonics.words.join(" · "),
}));

function buildEnglishUnitLevel(unit: (typeof GRADE3_GLOBAL_SUCCESS_UNITS)[number]): BankLevel {
  const id = englishUnitId(unit.unit);
  const questions: BankQuestion[] = [];
  const words = unit.vocabulary;

  unit.vocabulary.forEach((entry, index) => {
    const distractors = Array.from({ length: Math.min(3, words.length - 1) }, (_, offset) =>
      words[(index + offset + 1) % words.length].word,
    );
    questions.push(mcq(
      `${id}-V-${curriculumSlug(entry.word)}`,
      id,
      unit.unit,
      `Từ nào có nghĩa là “${entry.vietnameseMeaning}”?`,
      entry.word,
      distractors,
      `“${entry.word}” nghĩa là “${entry.vietnameseMeaning}”. Ví dụ: “${entry.exampleSentence}”.`,
      "vocabulary",
      index,
    ));
  });

  unit.patterns.forEach((entry, index) => {
    const distractors = allPatternExamples
      .filter((item) => item.unit !== unit.unit || item.example !== entry.exampleSentence)
      .map((item) => item.example);
    const patternSlug = curriculumSlug(entry.pattern).slice(0, 42);
    questions.push(mcq(
      `${id}-P-${patternSlug}-meaning`, id, unit.unit,
      `Câu tiếng Anh nào có nghĩa: “${entry.vietnameseMeaning}”?`,
      entry.exampleSentence, distractors, `Mẫu câu: “${entry.pattern}”. ${entry.vietnameseMeaning}`,
      "pattern", index,
    ));
    questions.push(mcq(
      `${id}-P-${patternSlug}-form`, id, unit.unit,
      `Chọn câu ví dụ đúng cho mẫu: “${entry.pattern}”`,
      entry.exampleSentence, distractors, `Câu ví dụ: “${entry.exampleSentence}”. ${entry.vietnameseMeaning}`,
      "pattern", index + 2,
    ));
  });

  const soundChoices = phonicsPairs.filter((pair) => pair.unit !== unit.unit).map((pair) => pair.words);
  const phonicsAnswer = unit.phonics.words.join(" · ");
  const phonicsPrompt = unit.phonics.words.length === 1
    ? `Từ nào là từ trọng tâm của bài luyện âm ${unit.phonics.sounds}?`
    : `Cặp từ nào được sách dùng để luyện âm ${unit.phonics.sounds}?`;
  const phonicsExplanation = unit.phonics.words.length === 1
    ? `Từ trọng tâm của bài luyện âm này là “${unit.phonics.words[0]}”.`
    : `Hai từ trọng tâm của bài luyện âm này là “${unit.phonics.words.join("” và “")}”.`;
  questions.push(mcq(
    `${id}-PHONICS`, id, unit.unit,
    phonicsPrompt,
    phonicsAnswer, soundChoices, phonicsExplanation,
    "phonics", 0,
  ));

  return { id, worldSlug: "tieng-anh", number: unit.unit, title: unit.title, questions };
}

/** Năm level tiếng Anh cũ chỉ dùng để đọc tiến độ, lượt chơi và câu trả lời đã lưu. */
export const LEGACY_ENGLISH_LEVELS: BankLevel[] = english.levels.map((level, levelIndex) => {
  const number = levelIndex + 1;
  return {
    id: levelId("tieng-anh", number),
    worldSlug: "tieng-anh",
    number,
    title: level.title,
    questions: level.questions.map((row, questionIndex) => rowToQuestion(row, "tieng-anh", number, questionIndex + 1)),
  };
});

function buildWorlds(): BankWorld[] {
  return WORLD_META.map((meta) => {
    let levels: BankLevel[];
    if (meta.slug === "tieng-anh") {
      levels = GRADE3_GLOBAL_SUCCESS_UNITS.map(buildEnglishUnitLevel);
    } else {
      const bank = STANDARD_BANKS.find((candidate) => candidate.slug === meta.slug);
      if (!bank || !STANDARD_BANK_SLUGS.has(meta.slug)) throw new Error(`Thiếu ngân hàng câu hỏi cho thế giới ${meta.slug}`);
      if (bank.levels.length !== LEVELS_PER_WORLD) throw new Error(`Thế giới ${meta.slug} phải có đúng ${LEVELS_PER_WORLD} level`);
      levels = bank.levels.map((level, levelIndex) => {
        const number = levelIndex + 1;
        return {
          id: levelId(meta.slug, number),
          worldSlug: meta.slug,
          number,
          title: level.title,
          questions: level.questions.map((row, questionIndex) => rowToQuestion(row, meta.slug, number, questionIndex + 1)),
        };
      });
    }
    if (levels.length !== WORLD_LEVEL_COUNTS[meta.slug]) throw new Error(`Số level của ${meta.slug} không khớp cấu hình`);
    return { ...meta, levels };
  });
}

export const WORLDS: BankWorld[] = buildWorlds();
const worldBySlug = new Map(WORLDS.map((world) => [world.slug, world]));
const activeLevelById = new Map<string, BankLevel>();
const questionById = new Map<string, BankQuestion>();
for (const world of WORLDS) {
  for (const level of world.levels) {
    activeLevelById.set(level.id, level);
    for (const question of level.questions) questionById.set(question.id, question);
  }
}
for (const level of LEGACY_ENGLISH_LEVELS) {
  for (const question of level.questions) questionById.set(question.id, question);
}

const legacyLevelById = new Map(LEGACY_ENGLISH_LEVELS.map((level) => [level.id, level]));

export function getWorld(slug: string): BankWorld | undefined {
  return worldBySlug.get(slug);
}
export function getLevel(id: string): BankLevel | undefined {
  return activeLevelById.get(id) ?? legacyLevelById.get(id);
}
export function getQuestion(id: string): BankQuestion | undefined {
  return questionById.get(id);
}
/** Level kế tiếp trong cùng khóa đang hoạt động; level lưu trữ không mở bài mới. */
export function nextLevel(id: string): BankLevel | undefined {
  const level = activeLevelById.get(id);
  if (!level) return undefined;
  return worldBySlug.get(level.worldSlug)?.levels.find((candidate) => candidate.number === level.number + 1);
}
