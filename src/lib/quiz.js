import { QUESTIONS } from '../data/questions.js';
import { CONCEPTS } from '../data/concepts.js';

const OPTIONAL_CONCEPT_IDS = new Set(CONCEPTS.filter((c) => c.optional).map((c) => c.id));
export const isOptionalConcept = (conceptId) => OPTIONAL_CONCEPT_IDS.has(conceptId);
const isOptionalQuestion = (q) => OPTIONAL_CONCEPT_IDS.has(q.concept);

// Initial state for an in-flight quiz attempt. Lifted into App so theme toggles
// preserve mid-quiz progress across the two component trees.
export const FRESH_QSESS = {
  idx: 0,
  phaseIdx: 0,
  finished: false,
  sessionCorrect: 0,
  sessionWrong: 0,
  score: 0,                // arcade displays this; 10pts per correct
  mockAnswers: {},         // qid -> selected[] (deferred scoring)
  sessionAnswers: {},      // qid -> { selected, wasCorrect } (immediate feedback)
  mockBookmarks: {},       // qid -> bool (mock-attempt scoped)
  mockTimeLeft: 60 * 60,   // mock exam timer (seconds)
  phaseTransition: false,  // inter-phase splash (concept quiz, arcade only)
};

export const QUIZ_MODE = {
  CONCEPT: 'concept',
  MIXED: 'mixed',
  MOCK: 'mock',
  REVIEW: 'review',
};

const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

// Concept quiz is split into three phases — core / scenario / brutal —
// each shuffled independently.
export function pickConceptPhases(conceptId) {
  const qs = QUESTIONS.filter((q) => q.concept === conceptId);
  return [
    { name: 'Core Questions',     subtitle: 'Recall and comprehension',                     questions: shuffle(qs.filter((q) => !q.difficulty)) },
    { name: 'Scenario Questions', subtitle: 'Applied judgment in context',                  questions: shuffle(qs.filter((q) => q.difficulty === 'scenario')) },
    { name: 'Brutal Questions',   subtitle: 'Adversarial phrasing — no capitalization hints', questions: shuffle(qs.filter((q) => q.difficulty === 'brutal')) },
  ].filter((p) => p.questions.length > 0);
}

export function pickQuickQuiz() {
  return shuffle(QUESTIONS).slice(0, 10);
}

// Mock exam mix reflects real PSPO I difficulty distribution.
// Optional concepts (e.g. EBM extra material) are excluded — the mock is the exam, not the extras.
const MOCK_MIX = { standard: 55, brutal: 15, scenario: 10 };
export function pickMockExam() {
  const pool = QUESTIONS.filter((q) => !isOptionalQuestion(q));
  const standards = pool.filter((q) => !q.difficulty);
  const brutals   = pool.filter((q) => q.difficulty === 'brutal');
  const scenarios = pool.filter((q) => q.difficulty === 'scenario');
  return shuffle([
    ...shuffle(standards).slice(0, MOCK_MIX.standard),
    ...shuffle(brutals).slice(0, MOCK_MIX.brutal),
    ...shuffle(scenarios).slice(0, MOCK_MIX.scenario),
  ]);
}

// Review queue: questions answered wrong more than right, or wrong-and-not-yet-twice-right.
export function pickReviewQueue(progress) {
  return Object.entries(progress.questions || {})
    .filter(([, p]) => {
      const wrong = p.wrongCount || 0;
      const right = p.correctCount || 0;
      return wrong > right || (wrong > 0 && right < 2);
    })
    .map(([qid]) => QUESTIONS.find((q) => q.id === qid))
    .filter(Boolean);
}

// Pass thresholds — used by both theme result screens for verdict labels.
export const PASS_PERFECT = 95;
export const PASS_BAR     = 85;
export const PASS_CLOSE   = 70;

export function verdictFor(pct) {
  if (pct >= PASS_PERFECT) return 'perfect';
  if (pct >= PASS_BAR)     return 'pass';
  if (pct >= PASS_CLOSE)   return 'close';
  return 'fail';
}

// Overall progress: required concepts give 0–100%, optional concepts add a bonus
// (each optional concept worth OPTIONAL_BONUS_PER_CONCEPT). Total caps at 100 + total bonus.
export const OPTIONAL_BONUS_PER_CONCEPT = 10;

export function overallProgress(progress) {
  const required = QUESTIONS.filter((q) => !isOptionalQuestion(q));
  const optional = QUESTIONS.filter((q) =>  isOptionalQuestion(q));

  const uniqueCorrect = (pool) => pool.filter((q) => {
    const p = progress.questions[q.id];
    return p && (p.correctCount || 0) > 0;
  }).length;

  const baseline = required.length > 0
    ? Math.round((uniqueCorrect(required) / required.length) * 100)
    : 0;

  // Per-optional-concept bonus, proportional to that concept's completion
  const optionalConceptIds = [...OPTIONAL_CONCEPT_IDS];
  const bonus = optionalConceptIds.reduce((sum, cid) => {
    const conceptQs = optional.filter((q) => q.concept === cid);
    if (conceptQs.length === 0) return sum;
    const correct = uniqueCorrect(conceptQs);
    return sum + (correct / conceptQs.length) * OPTIONAL_BONUS_PER_CONCEPT;
  }, 0);

  const maxBonus = optionalConceptIds.length * OPTIONAL_BONUS_PER_CONCEPT;
  return {
    baseline,                      // 0–100, based on required concepts only
    bonus: Math.round(bonus),      // 0–maxBonus, from completing optional content
    total: baseline + Math.round(bonus),
    maxTotal: 100 + maxBonus,
  };
}
