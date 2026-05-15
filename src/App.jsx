import { useState, useEffect } from 'react';

import {
  DEFAULT_PROGRESS,
  loadProgress,
  saveProgress,
} from './lib/progress.js';
import {
  FRESH_QSESS,
  QUIZ_MODE,
  pickConceptPhases,
  pickQuickQuiz,
  pickMockExam,
  pickReviewQueue,
} from './lib/quiz.js';
import { THEME, loadTheme, saveTheme } from './lib/theme.js';

import { STYLE } from './styles/classic.js';
import ArcadeShell, { ARCADE_STYLE } from './ArcadeShell.jsx';

import { Header } from './components/classic/Header.jsx';
import { TitleScreen } from './components/classic/TitleScreen.jsx';
import { HomeView } from './components/classic/HomeView.jsx';
import { LessonView } from './components/classic/LessonView.jsx';
import { QuizView } from './components/classic/QuizView.jsx';
import { StatsView } from './components/classic/StatsView.jsx';

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
    setProgress(loadProgress());
    setTheme(loadTheme());
    setLoaded(true);
  }, []);

  function resetQsess() {
    setQsess({ ...FRESH_QSESS });
  }

  function switchTheme() {
    setTheme((t) => {
      const next = t === THEME.ARCADE ? THEME.CLASSIC : THEME.ARCADE;
      saveTheme(next);
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
    setActiveConcept(conceptId);
    setView('lesson');
  }

  function startQuizForConcept(conceptId) {
    setQuizSet(null);
    setQuizPhases(pickConceptPhases(conceptId));
    setQuizMode(QUIZ_MODE.CONCEPT);
    resetQsess();
    setView('quiz');
  }

  function startQuickQuiz() {
    setQuizSet(pickQuickQuiz());
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MIXED);
    resetQsess();
    setView('quiz');
  }

  function startMockExam() {
    setQuizSet(pickMockExam());
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MOCK);
    resetQsess();
    setView('quiz');
  }

  function startReview() {
    const queue = pickReviewQueue(progress);
    if (queue.length === 0) { setView('home'); return; }
    setQuizSet([...queue].sort(() => Math.random() - 0.5));
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.REVIEW);
    resetQsess();
    setView('quiz');
  }

  function exitQuiz() {
    setView('home');
    setQuizSet(null);
    setQuizPhases(null);
    setActiveConcept(null);
    setQuizMode(QUIZ_MODE.MIXED);
    resetQsess();
  }

  if (!loaded) {
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
          onExitQuiz={exitQuiz}
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
            onNav={(v) => { setView(v); setActiveConcept(null); setQuizSet(null); }}
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
