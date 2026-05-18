import { useState, useEffect, useRef } from 'react';

import {
  DEFAULT_PROGRESS,
  loadProgress,
  saveProgress,
  masteryForConcept,
} from './lib/progress.js';
import {
  FRESH_QSESS,
  QUIZ_MODE,
  pickConceptPhases,
  pickQuickQuiz,
  pickMockExam,
  pickReviewQueue,
  overallProgress,
} from './lib/quiz.js';
import { THEME, loadTheme, saveTheme } from './lib/theme.js';
import { CONCEPTS } from './data/concepts.js';
import {
  trackPageView,
  trackThemeSwitch,
  trackConceptView,
  trackQuizStart,
  trackQuizAbandon,
  trackConceptMastered,
  trackAchievementUnlocked,
  setUserProperties,
} from './lib/analytics.js';

import { STYLE } from './styles/classic.js';
import ArcadeShell, { ARCADE_STYLE } from './ArcadeShell.jsx';

import { Header } from './components/classic/Header.jsx';
import { TitleScreen } from './components/classic/TitleScreen.jsx';
import { HomeView } from './components/classic/HomeView.jsx';
import { LessonView } from './components/classic/LessonView.jsx';
import { QuizView } from './components/classic/QuizView.jsx';
import { StatsView } from './components/classic/StatsView.jsx';

const VIEW_TITLES = {
  title: 'Title',
  home: 'Concepts',
  lesson: 'Lesson',
  quiz: 'Quiz',
  results: 'Results',
  review: 'Review queue',
  stats: 'Stats',
};

/* ──────────────────────────────────────────────────────────────────────────
   APP ROOT

   Owns navigation state (view, activeConcept, quiz config), in-flight quiz
   session (qsess), study progress, and the theme. Both theme shells render
   off the same source of truth so toggling theme is a pure skin swap.
   ────────────────────────────────────────────────────────────────────────── */

export default function App() {
  const [view, setView] = useState('title');
  const [activeConcept, setActiveConcept] = useState(null);
  const [quizSet, setQuizSet] = useState(null);
  const [quizPhases, setQuizPhases] = useState(null);
  const [quizMode, setQuizMode] = useState(QUIZ_MODE.MIXED);
  const [qsess, setQsess] = useState(FRESH_QSESS);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [theme, setTheme] = useState(THEME.CLASSIC);

  useEffect(() => {
    const loadedProgress = loadProgress();
    const loadedTheme = loadTheme();
    setProgress(loadedProgress);
    setTheme(loadedTheme);
    setLoaded(true);
    // User properties handled by the dedicated user-properties effect
    // below — keeping it in one place ensures diff-guarded pushes only.
  }, []);

  /* Analytics: SPA page_view on every view change.
     gtag's auto page_view is disabled in index.html so this is the sole source.
     Also keep document.title in sync so browser tabs reflect the current view. */
  useEffect(() => {
    if (!loaded) return;
    const title = `${VIEW_TITLES[view] || view} — PSPO·I Trainer`;
    if (typeof document !== 'undefined') document.title = title;
    trackPageView({
      path: `/${view}${activeConcept ? `/${activeConcept}` : ''}`,
      title,
    });
  }, [view, activeConcept, loaded]);

  /* Analytics: detect newly-mastered concepts and the "all required concepts
     mastered" achievement. Runs whenever progress changes. */
  const prevMasteredRef = useRef(null);
  const mockCompleteUnlockedRef = useRef(false);
  useEffect(() => {
    if (!loaded) return;
    const masteredNow = new Set(
      CONCEPTS
        .filter((c) => masteryForConcept(progress, c.id).level === 'mastered')
        .map((c) => c.id),
    );

    // Newly mastered concepts → fire one concept_mastered event per concept.
    if (prevMasteredRef.current) {
      for (const id of masteredNow) {
        if (!prevMasteredRef.current.has(id)) {
          const c = CONCEPTS.find((x) => x.id === id);
          trackConceptMastered({ conceptId: id, conceptLabel: c?.label });
        }
      }
    }
    prevMasteredRef.current = masteredNow;

    // "Mock complete" achievement = all required (non-optional) concepts mastered.
    const requiredAllMastered = CONCEPTS.filter((c) => !c.optional).every((c) => masteredNow.has(c.id));
    if (requiredAllMastered && !mockCompleteUnlockedRef.current) {
      // Idempotency: only fire once per session even if progress mutates further.
      const already = (() => {
        try { return localStorage.getItem('pspo_mock_complete_unlocked') === 'true'; } catch { return false; }
      })();
      if (!already) {
        try { localStorage.setItem('pspo_mock_complete_unlocked', 'true'); } catch {}
        trackAchievementUnlocked({
          achievementId: 'mock_complete',
          achievementName: 'Mock Complete — all required concepts mastered',
        });
      }
      mockCompleteUnlockedRef.current = true;
    }
  }, [progress, loaded]);

  /* Analytics: consolidated user-properties push.
     One effect, one ref, one diff guard — fires set_user_properties only
     when at least one of {theme, concepts_mastered, total_progress_pct}
     actually changes. Previously we were firing on every progress
     mutation, which meant 1 push per answered question (~17 events per
     14-question quiz). */
  const lastUserPropsRef = useRef(null);
  useEffect(() => {
    if (!loaded) return;
    const concepts_mastered = CONCEPTS.filter(
      (c) => masteryForConcept(progress, c.id).level === 'mastered',
    ).length;
    const total_progress_pct = overallProgress(progress).total;
    const next = { theme, concepts_mastered, total_progress_pct };
    const prev = lastUserPropsRef.current;
    if (
      !prev ||
      prev.theme !== next.theme ||
      prev.concepts_mastered !== next.concepts_mastered ||
      prev.total_progress_pct !== next.total_progress_pct
    ) {
      setUserProperties(next);
      lastUserPropsRef.current = next;
    }
  }, [theme, progress, loaded]);

  function resetQsess() {
    setQsess({ ...FRESH_QSESS });
  }

  function switchTheme() {
    setTheme((t) => {
      const next = t === THEME.ARCADE ? THEME.CLASSIC : THEME.ARCADE;
      saveTheme(next);
      trackThemeSwitch({ from: t, to: next });
      return next;
    });
    // 'results' is arcade-only (classic shows results inline in QuizView).
    // 'title' now exists in both themes, so no remap needed there.
    if (view === 'results') setView('home');
  }

  function updateAnswer(qid, correct) {
    setProgress((prev) => {
      const prevQ = prev.questions[qid] || { attempts: 0, correctCount: 0, wrongCount: 0 };
      const nextQ = {
        attempts: (prevQ.attempts || 0) + 1,
        correctCount: (prevQ.correctCount || 0) + (correct ? 1 : 0),
        wrongCount:   (prevQ.wrongCount   || 0) + (correct ? 0 : 1),
        lastSeenAt: Date.now(),
      };
      const next = {
        ...prev,
        questions: { ...prev.questions, [qid]: nextQ },
        totalAnswered: (prev.totalAnswered || 0) + 1,
        totalCorrect:  (prev.totalCorrect  || 0) + (correct ? 1 : 0),
      };
      saveProgress(next);
      return next;
    });
  }

  function resetProgress() {
    const fresh = { ...DEFAULT_PROGRESS, questions: {}, bookmarks: {} };
    setProgress(fresh);
    saveProgress(fresh);
  }

  function toggleBookmark(qid) {
    setProgress((prev) => {
      const nextBookmarks = { ...(prev.bookmarks || {}) };
      if (nextBookmarks[qid]) delete nextBookmarks[qid];
      else nextBookmarks[qid] = true;
      const next = { ...prev, bookmarks: nextBookmarks };
      saveProgress(next);
      return next;
    });
  }

  function pickConcept(conceptId) {
    const c = CONCEPTS.find((x) => x.id === conceptId);
    trackConceptView({ conceptId, conceptLabel: c?.label });
    setActiveConcept(conceptId);
    setView('lesson');
  }

  function startQuizForConcept(conceptId) {
    const phases = pickConceptPhases(conceptId);
    const c = CONCEPTS.find((x) => x.id === conceptId);
    setQuizSet(null);
    setQuizPhases(phases);
    setQuizMode(QUIZ_MODE.CONCEPT);
    resetQsess();
    setView('quiz');
    trackQuizStart({
      mode: 'concept',
      conceptId,
      conceptLabel: c?.label,
      questionCount: phases.reduce((s, p) => s + p.questions.length, 0),
    });
  }

  function startQuickQuiz() {
    const set = pickQuickQuiz();
    setQuizSet(set);
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MIXED);
    resetQsess();
    setView('quiz');
    trackQuizStart({ mode: 'mixed', questionCount: set.length });
  }

  function startMockExam() {
    const set = pickMockExam();
    setQuizSet(set);
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MOCK);
    resetQsess();
    setView('quiz');
    trackQuizStart({ mode: 'mock', questionCount: set.length });
  }

  function startReview() {
    const queue = pickReviewQueue(progress);
    if (queue.length === 0) { setView('home'); return; }
    const set = [...queue].sort(() => Math.random() - 0.5);
    setQuizSet(set);
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.REVIEW);
    resetQsess();
    setView('quiz');
    trackQuizStart({ mode: 'review', questionCount: set.length });
  }

  // Records a quiz_abandon event if the user is mid-quiz right now. Called
  // from any code path that ends a quiz session without finishing it
  // (exit button, header nav, theme-toggle-to-results-only flows). Safe to
  // call when not in a quiz — early-exits silently.
  function maybeTrackQuizAbandon() {
    if (view !== 'quiz' || qsess.finished) return;
    const concept = activeConcept ? CONCEPTS.find((c) => c.id === activeConcept) : null;
    const questions = quizPhases
      ? quizPhases.flatMap((p) => p.questions)
      : (quizSet || []);
    const isMock = quizMode === QUIZ_MODE.MOCK;
    const answeredCount = isMock
      ? Object.keys(qsess.mockAnswers || {}).length
      : Object.keys(qsess.sessionAnswers || {}).length;
    trackQuizAbandon({
      mode: quizMode,
      conceptId: activeConcept,
      conceptLabel: concept?.label,
      questionCount: questions.length,
      answeredCount,
    });
  }

  function exitQuiz() {
    maybeTrackQuizAbandon();
    setView('home');
    setQuizSet(null);
    setQuizPhases(null);
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MIXED);
    resetQsess();
  }

  // Header nav handler. Wraps setView so navigation away from an in-progress
  // quiz fires quiz_abandon (otherwise users who exit via the header are
  // invisible to the funnel).
  function navigateTo(v) {
    maybeTrackQuizAbandon();
    setView(v);
    setActiveConcept(null);
    setQuizSet(null);
    setQuizPhases(null);
  }

  if (!loaded) {
    // Use the saved theme (read synchronously) so we don't flash the wrong skin
    const initialTheme = (typeof window !== 'undefined' ? loadTheme() : THEME.CLASSIC);
    if (initialTheme === THEME.ARCADE) {
      return (
        <div className="arcade-root">
          <style>{ARCADE_STYLE}</style>
          <div className="arcade-splash" role="status" aria-live="polite" aria-label="Loading P5P0 Trainer">
            <div className="arcade-splash-inner">
              <div className="arcade-splash-mark">P5P0 I</div>
              <div className="arcade-splash-sub">★ TRAINER ★</div>
              <div className="arcade-splash-status">
                BOOTING<span className="arcade-splash-caret" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <>
        <style>{STYLE}</style>
        <div className="pspo-splash" role="status" aria-live="polite" aria-label="Loading">
          <div className="pspo-splash-inner">
            <div className="pspo-splash-mark">
              PSPO<span className="accent">·I</span>
            </div>
            <div className="pspo-splash-spinner" />
          </div>
        </div>
      </>
    );
  }

  if (theme === THEME.ARCADE) {
    return (
      <>
        <style>{ARCADE_STYLE}</style>
        <ArcadeShell
          view={view}
          activeConcept={activeConcept}
          quizPhases={quizPhases}
          quizQuestions={quizSet}
          quizMode={quizMode}
          qsess={qsess}
          setQsess={setQsess}
          progress={progress}
          onAnswer={updateAnswer}
          onToggleBookmark={toggleBookmark}
          onSwitchTheme={switchTheme}
          onPickConcept={pickConcept}
          onStartConceptQuiz={startQuizForConcept}
          onStartQuickQuiz={startQuickQuiz}
          onStartMockExam={startMockExam}
          onStartReview={startReview}
          onSetView={setView}
          onNavigate={navigateTo}
          onExitQuiz={exitQuiz}
          onResetProgress={resetProgress}
        />
      </>
    );
  }

  return (
    <div className="pspo-root grainy">
      <style>{STYLE}</style>

      <a href="#main-content" className="pspo-skip-link">Skip to main content</a>

      {view === 'title' ? (
        <main id="main-content">
          <TitleScreen
            progress={progress}
            onStart={() => setView('home')}
            onToggleTheme={switchTheme}
          />
        </main>
      ) : (
        <>
          <Header
            stats={progress}
            onNav={navigateTo}
            currentView={view}
            onToggleTheme={switchTheme}
          />
          <main id="main-content">
            {renderClassicView()}
          </main>
        </>
      )}
    </div>
  );

  function renderClassicView() {
    return <>
      {view === 'home' && (
        <HomeView
          progress={progress}
          onPickConcept={pickConcept}
          onStartReview={startReview}
          onStartQuick={startQuickQuiz}
          onStartMock={startMockExam}
        />
      )}

      {view === 'lesson' && activeConcept && (
        <LessonView
          conceptId={activeConcept}
          onStart={() => startQuizForConcept(activeConcept)}
          onBack={exitQuiz}
        />
      )}

      {view === 'quiz' && (quizSet || quizPhases) && (
        <QuizView
          questions={quizSet}
          phases={quizPhases}
          progress={progress}
          onComplete={updateAnswer}
          onBack={exitQuiz}
          mode={quizMode}
          conceptId={activeConcept}
          onToggleBookmark={toggleBookmark}
          qsess={qsess}
          setQsess={setQsess}
        />
      )}

      {view === 'review' && (() => {
        const queue = pickReviewQueue(progress);
        const empty = queue.length === 0;
        return (
          <div className="container-max fade-in">
            <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 600, margin: '0 0 18px', letterSpacing: '-0.022em', lineHeight: 1.07 }}>
              Review queue
            </h1>
            <p style={{ fontSize: 21, fontWeight: 400, letterSpacing: '-0.231px', color: 'var(--text-dim)', maxWidth: 620, marginTop: 0, lineHeight: 1.43 }}>
              Questions you've answered incorrectly, or haven't yet answered correctly twice. Closer to real mastery than one-shot accuracy.
            </p>
            <div className="card" style={{ marginTop: 28, marginBottom: 24, maxWidth: 360, textAlign: 'center' }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-dim)', letterSpacing: '-0.224px', marginBottom: 10 }}>
                Questions pending
              </div>
              <div className="numeric" style={{ fontSize: 56, fontWeight: 600, color: empty ? 'var(--text-faint)' : 'var(--accent)', lineHeight: 1, letterSpacing: '-0.022em' }}>
                {queue.length}
              </div>
            </div>
            <button className="btn primary" onClick={startReview} disabled={empty}>
              {empty ? 'Queue empty' : 'Start review'}
            </button>
            {empty && (
              <p style={{ fontSize: 14, color: 'var(--text-faint)', marginTop: 12, letterSpacing: '-0.224px' }}>
                Answer a quiz to populate the queue with what you miss.
              </p>
            )}
          </div>
        );
      })()}

      {view === 'stats' && (
        <StatsView progress={progress} onBack={() => setView('home')} onReset={resetProgress} />
      )}
    </>;
  }
}
