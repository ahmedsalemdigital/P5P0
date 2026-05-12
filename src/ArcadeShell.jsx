import { useState, useMemo } from 'react';
import { pickReviewQueue, QUIZ_MODE } from './lib/quiz.js';
import { TitleScreen } from './components/arcade/TitleScreen.jsx';
import { ConceptSelect } from './components/arcade/ConceptSelect.jsx';
import { LessonScreen } from './components/arcade/LessonScreen.jsx';
import { QuizScreen } from './components/arcade/QuizScreen.jsx';
import { ResultsScreen } from './components/arcade/ResultsScreen.jsx';

export { ARCADE_STYLE } from './styles/arcade.js';

/* ──────────────────────────────────────────────────────────────────────────
   ARCADE SHELL — internal screen routing

   Owns very little local state. Navigation (view, activeConcept, quizMode,
   quizPhases, quizQuestions) and the in-flight quiz session (qsess) are
   lifted up to App so that toggling theme preserves the user's place.
   ────────────────────────────────────────────────────────────────────────── */

export default function ArcadeShell({
  view,
  activeConcept,
  quizPhases,
  quizQuestions,
  quizMode,
  qsess,
  setQsess,
  progress,
  onAnswer,
  onToggleBookmark,
  onSwitchTheme,
  onPickConcept,
  onStartConceptQuiz,
  onStartQuickQuiz,
  onStartMockExam,
  onStartReview,
  onSetView,
  onExitQuiz,
}) {
  // Results screen is the only screen with state purely local to the arcade theme
  // (classic shows results inline inside QuizView). Lost on theme toggle — acceptable.
  const [quizResult, setQuizResult] = useState(null);

  const reviewQueue = useMemo(() => pickReviewQueue(progress), [progress]);

  function finishQuiz(result) {
    setQuizResult(result);
    onSetView('results');
  }

  function playAgain() {
    setQuizResult(null);
    if (quizMode === QUIZ_MODE.CONCEPT && activeConcept) onStartConceptQuiz(activeConcept);
    else if (quizMode === QUIZ_MODE.MIXED) onStartQuickQuiz();
    else if (quizMode === QUIZ_MODE.MOCK)  onStartMockExam();
    else if (quizMode === QUIZ_MODE.REVIEW) onStartReview();
    else onSetView('home');
  }

  return (
    <div className="arcade-root">
      <div className="arcade-scanline" />
      <button className="arcade-theme-toggle" onClick={onSwitchTheme} title="Switch to classic theme">
        <span className="theme-toggle-icon">◐</span>
        <span>CLASSIC</span>
      </button>
      <div className="arcade-stage">
        {view === 'title' && (
          <TitleScreen progress={progress} onStart={() => onSetView('home')} />
        )}

        {(view === 'home' || view === 'review' || view === 'stats') && (
          <ConceptSelect
            progress={progress}
            onSelect={onPickConcept}
            onBack={() => onSetView('title')}
            onStartQuick={onStartQuickQuiz}
            onStartMock={onStartMockExam}
            onStartReview={onStartReview}
            reviewQueueSize={reviewQueue.length}
          />
        )}

        {view === 'lesson' && activeConcept && (
          <LessonScreen
            conceptId={activeConcept}
            onStartQuiz={() => onStartConceptQuiz(activeConcept)}
            onBack={() => onSetView('home')}
          />
        )}

        {view === 'quiz' && (quizPhases || quizQuestions) && (
          <QuizScreen
            mode={quizMode}
            conceptId={activeConcept}
            phases={quizPhases}
            questions={quizQuestions}
            qsess={qsess}
            setQsess={setQsess}
            progress={progress}
            onComplete={onAnswer}
            onToggleBookmark={onToggleBookmark}
            onFinish={finishQuiz}
            onExit={onExitQuiz}
          />
        )}

        {view === 'results' && quizResult && (
          <ResultsScreen
            result={quizResult}
            conceptId={activeConcept}
            progress={progress}
            onPlayAgain={playAgain}
            onBack={() => { setQuizResult(null); onSetView('home'); }}
            onHome={() => { setQuizResult(null); onSetView('title'); }}
          />
        )}
      </div>
    </div>
  );
}
