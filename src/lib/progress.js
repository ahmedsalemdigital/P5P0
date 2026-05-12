import { QUESTIONS } from '../data/questions.js';

const STORAGE_KEY = 'pspo-progress-v1';

export const DEFAULT_PROGRESS = {
  questions: {},        // qid -> { attempts, correctCount, wrongCount, lastSeenAt }
  totalAnswered: 0,
  totalCorrect: 0,
  sessionsCompleted: 0,
  bookmarks: {},        // qid -> true
};

export function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    if (!parsed.bookmarks) parsed.bookmarks = {};
    return parsed;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
}

// Brutal questions deliberately strip emphasis to remove unintended capitalization hints.
export function defangBrutalQuestion(text) {
  return text.replace(/\b[A-Z]{3,}\b/g, (word) => word.toLowerCase());
}

export function arraysEqualAsSet(a, b) {
  if (a.length !== b.length) return false;
  const set = new Set(a);
  for (const x of b) if (!set.has(x)) return false;
  return true;
}

const HARD_DIFFICULTIES = new Set(['brutal', 'scenario']);

export function masteryForConcept(progress, conceptId) {
  const qs = QUESTIONS.filter((q) => q.concept === conceptId);

  let weightedAnswered = 0;
  let weightedCorrect = 0;
  let weightedCoverage = 0;
  let weightedTotal = 0;
  let hardAnswered = 0;
  let hardCorrect = 0;
  let hardCount = 0;

  for (const q of qs) {
    const isHard = HARD_DIFFICULTIES.has(q.difficulty);
    const weight = isHard ? 1.5 : 1;
    weightedTotal += weight;
    if (isHard) hardCount++;
    const p = progress.questions[q.id];
    if (!p) continue;
    weightedAnswered += (p.attempts || 0) * weight;
    weightedCorrect += (p.correctCount || 0) * weight;
    if ((p.correctCount || 0) > 0) weightedCoverage += weight;
    if (isHard) {
      hardAnswered += p.attempts || 0;
      hardCorrect += p.correctCount || 0;
    }
  }

  const coverage = weightedTotal > 0 ? weightedCoverage / weightedTotal : 0;
  const accuracy = weightedAnswered > 0 ? weightedCorrect / weightedAnswered : 0;
  const hardAccuracy = hardAnswered > 0 ? hardCorrect / hardAnswered : 0;

  let totalAnswered = 0;
  let totalCorrect = 0;
  let uniqueCorrect = 0;
  for (const q of qs) {
    const p = progress.questions[q.id];
    if (!p) continue;
    totalAnswered += p.attempts || 0;
    totalCorrect += p.correctCount || 0;
    if ((p.correctCount || 0) > 0) uniqueCorrect++;
  }

  let level = 'unseen';
  if (totalAnswered === 0) {
    level = 'unseen';
  } else if (coverage >= 0.8 && accuracy >= 0.85 && (hardCount === 0 || hardAccuracy >= 0.8)) {
    level = 'mastered';
  } else if (coverage >= 0.5 && accuracy >= 0.6) {
    level = 'practicing';
  } else {
    level = 'learning';
  }

  return {
    level,
    coverage,
    accuracy,
    totalAnswered,
    totalCorrect,
    uniqueCorrect,
    questionCount: qs.length,
    brutalCount: hardCount,
    brutalAnswered: hardAnswered,
    brutalAccuracy: hardAccuracy,
  };
}
