/* ──────────────────────────────────────────────────────────────────────────
   ANALYTICS LAYER

   Thin wrapper around gtag (GA4). Every call is wrapped so it's a no-op
   when:
     • gtag hasn't loaded yet (pre-consent — CookieYes loads gtag only
       after the user accepts the Analytics category)
     • window is undefined (SSR safety; not strictly needed here)
     • gtag itself throws

   The tracking plan is documented in /ANALYTICS.md at the repo root.
   ────────────────────────────────────────────────────────────────────────── */

const GA_ID = 'G-WB97T5NR8S';

function gtagSafe(...args) {
  try {
    if (typeof window === 'undefined') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag(...args);
  } catch {
    // Analytics must never crash the app.
  }
}

/** Generic event helper. Prefer the typed helpers below over calling this directly. */
export function trackEvent(name, params = {}) {
  gtagSafe('event', name, params);
}

/** Set GA4 user properties. Called when their value changes. */
export function setUserProperties(properties) {
  gtagSafe('set', 'user_properties', properties);
}

/** SPA page_view. Auto page_view is disabled in index.html's gtag config so
 *  every screen change (title → home → lesson → quiz → results) reports once. */
export function trackPageView({ path, title }) {
  gtagSafe('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: typeof window !== 'undefined' ? `${window.location.origin}${path}` : path,
  });
}

/** Theme toggle. Useful to see Classic vs Arcade preference at the cohort level. */
export function trackThemeSwitch({ from, to }) {
  trackEvent('theme_switch', { from, to });
  setUserProperties({ theme: to });
}

/** User opened a concept's lesson page. */
export function trackConceptView({ conceptId, conceptLabel }) {
  trackEvent('concept_view', {
    concept_id: conceptId,
    concept_label: conceptLabel,
  });
}

/** A quiz (any mode) started. mode is one of: concept, mixed, mock, review. */
export function trackQuizStart({ mode, conceptId, conceptLabel, questionCount }) {
  trackEvent('quiz_start', {
    mode,
    concept_id: conceptId || undefined,
    concept_label: conceptLabel || undefined,
    question_count: questionCount,
  });
}

/** A quiz finalized. Fires the base quiz_complete plus optional derived events:
 *    • quiz_pass — score ≥ 85 (PSPO I pass bar)
 *    • mock_exam_complete — mode === 'mock' */
export function trackQuizComplete({
  mode,
  conceptId,
  conceptLabel,
  scorePct,
  correctCount,
  wrongCount,
  total,
  timeUsedSec,
  verdict,
}) {
  const params = {
    mode,
    concept_id: conceptId || undefined,
    concept_label: conceptLabel || undefined,
    score_pct: scorePct,
    correct_count: correctCount,
    wrong_count: wrongCount,
    total_questions: total,
    time_used_sec: timeUsedSec ?? undefined,
    verdict,
    // GA4 'value' is conventionally a monetary number; we use the score as a
    // numeric value so it surfaces in reports that sort by 'value'.
    value: scorePct,
  };
  trackEvent('quiz_complete', params);
  if (scorePct >= 85) trackEvent('quiz_pass', params);
  if (mode === 'mock') trackEvent('mock_exam_complete', params);
  if (correctCount === total && total > 0) {
    trackAchievementUnlocked({
      achievementId: 'flawless_victory',
      achievementName: 'Flawless Victory',
    });
  }
}

/** A concept's mastery level just transitioned to 'mastered'. */
export function trackConceptMastered({ conceptId, conceptLabel }) {
  trackEvent('concept_mastered', {
    concept_id: conceptId,
    concept_label: conceptLabel,
  });
}

/** An achievement got unlocked. Idempotency is enforced by callers; this just
 *  reports the unlock. */
export function trackAchievementUnlocked({ achievementId, achievementName }) {
  trackEvent('achievement_unlocked', {
    achievement_id: achievementId,
    achievement_name: achievementName,
  });
}

export { GA_ID };
