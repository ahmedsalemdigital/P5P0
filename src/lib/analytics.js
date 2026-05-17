/* ──────────────────────────────────────────────────────────────────────────
   ANALYTICS LAYER

   Pushes events to window.dataLayer. The page wires Google Tag Manager
   (GTM-THK4XJZW) which listens to dataLayer and forwards events to GA4
   (measurement id G-WB97T5NR8S).

   Consent: GTM only loads after the user accepts the CookieYes "Analytics"
   category. Pre-consent, dataLayer is an array that accumulates events but
   nothing ever sends them anywhere — they're cleared on page reload.

   The full tracking plan and the GTM container setup live in
   /ANALYTICS.md at the repo root.
   ────────────────────────────────────────────────────────────────────────── */

const GA_ID = 'G-WB97T5NR8S';
const GTM_ID = 'GTM-THK4XJZW';

function dataLayerPush(payload) {
  try {
    if (typeof window === 'undefined') return;
    // dataLayer is initialized inline in index.html so this should always be
    // an array; the guard is a paranoia check.
    if (!Array.isArray(window.dataLayer)) return;
    window.dataLayer.push(payload);
  } catch {
    // Analytics must never crash the app.
  }
}

/** Generic event helper. Prefer the typed helpers below over calling this directly. */
export function trackEvent(name, params = {}) {
  dataLayerPush({ event: name, ...params });
}

/** Set GA4 user properties. Fires a dedicated `set_user_properties` event
 *  that the GTM container is configured to map onto GA4 user_properties. */
export function setUserProperties(properties) {
  dataLayerPush({ event: 'set_user_properties', ...properties });
}

/** SPA page_view. The GTM container should send this through a GA4 Event
 *  tag named `page_view` mapping page_path/page_title/page_location. */
export function trackPageView({ path, title }) {
  dataLayerPush({
    event: 'page_view',
    page_path: path,
    page_title: title,
    page_location: typeof window !== 'undefined' ? `${window.location.origin}${path}` : path,
  });
}

/** Theme toggle. Useful to see Classic vs Arcade preference at the cohort level.
 *  The `theme` user property is updated by App.jsx's consolidated
 *  user-properties effect when `theme` state changes — no inline
 *  setUserProperties call here, to avoid duplicate pushes. */
export function trackThemeSwitch({ from, to }) {
  trackEvent('theme_switch', { from, to });
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
  // flawless_victory: fire ONCE per browser. The UI's pspo_flawless flag
  // is kept for the trophy display; we use a separate key here so the
  // analytics state and the UI state can't race.
  if (correctCount === total && total > 0) {
    let alreadyFired = false;
    try { alreadyFired = localStorage.getItem('pspo_flawless_event_fired') === 'true'; } catch {}
    if (!alreadyFired) {
      try { localStorage.setItem('pspo_flawless_event_fired', 'true'); } catch {}
      trackAchievementUnlocked({
        achievementId: 'flawless_victory',
        achievementName: 'Flawless Victory',
      });
    }
  }
}

/** A quiz was started but never completed — user exited mid-quiz.
 *  Useful for engagement-depth + drop-off funnels. */
export function trackQuizAbandon({ mode, conceptId, conceptLabel, questionCount, answeredCount }) {
  trackEvent('quiz_abandon', {
    mode,
    concept_id: conceptId || undefined,
    concept_label: conceptLabel || undefined,
    question_count: questionCount,
    answered_count: answeredCount,
  });
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

export { GA_ID, GTM_ID };
