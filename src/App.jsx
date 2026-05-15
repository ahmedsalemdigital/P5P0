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
      <div className="pspo-root grainy" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <style>{STYLE}</style>
        <div className="mono faint" style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading…</div>
      </div>
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

      {view === 'title' ? (
        <TitleScreen
          progress={progress}
          onStart={() => setView('home')}
          onToggleTheme={switchTheme}
        />
      ) : (
        <Header
          stats={progress}
          onNav={(v) => { setView(v); setActiveConcept(null); setQuizSet(null); }}
          currentView={view}
          onToggleTheme={switchTheme}
        />
      )}

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

      {view === 'review' && (
        <div className="container-max fade-in">
          <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.02em' }}>Review queue</h1>
          <p className="dim" style={{ fontSize: 16, maxWidth: 540, marginTop: 0 }}>
            Questions you've answered incorrectly, or haven't yet answered correctly twice. Closer to real mastery than one-shot accuracy.
          </p>
          <button className="btn primary" onClick={startReview} style={{ marginTop: 16 }}>Start Review →</button>
        </div>
      )}

      {view === 'stats' && (
        <StatsView progress={progress} onBack={() => setView('home')} onReset={resetProgress} />
      )}
    </div>
  );
}
