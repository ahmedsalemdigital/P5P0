import { QUESTIONS } from '../data/questions.js';

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
const MOCK_MIX = { standard: 55, brutal: 15, scenario: 10 };
export function pickMockExam() {
  const standards = QUESTIONS.filter((q) => !q.difficulty);
  const brutals   = QUESTIONS.filter((q) => q.difficulty === 'brutal');
  const scenarios = QUESTIONS.filter((q) => q.difficulty === 'scenario');
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
