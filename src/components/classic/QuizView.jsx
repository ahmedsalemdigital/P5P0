import React, { useState, useEffect, useRef } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { arraysEqualAsSet, defangBrutalQuestion } from '../../lib/progress.js';
import { verdictFor } from '../../lib/quiz.js';
import { trackQuizComplete } from '../../lib/analytics.js';
import { PhaseProgressBar } from './PhaseProgressBar.jsx';

export function QuizView({ questions: questionsProp, phases, progress, onComplete, onBack, mode, conceptId, onToggleBookmark, qsess, setQsess }) {
  // Persistent state lives in qsess (lifted to App so theme toggle preserves quiz progress).
  // Wrapper setters keep the rest of the component's call sites unchanged.
  const phaseIdx = qsess.phaseIdx;
  const idx = qsess.idx;
  const sessionCorrect = qsess.sessionCorrect;
  const sessionWrong = qsess.sessionWrong;
  const finished = qsess.finished;
  const mockAnswers = qsess.mockAnswers;
  const sessionAnswers = qsess.sessionAnswers;
  const mockBookmarks = qsess.mockBookmarks;
  const mockTimeLeft = qsess.mockTimeLeft;
  const setPhaseIdx = (v) => setQsess((s) => ({ ...s, phaseIdx: typeof v === 'function' ? v(s.phaseIdx) : v }));
  const setIdx = (v) => setQsess((s) => ({ ...s, idx: typeof v === 'function' ? v(s.idx) : v }));
  const setSessionCorrect = (v) => setQsess((s) => ({ ...s, sessionCorrect: typeof v === 'function' ? v(s.sessionCorrect) : v }));
  const setSessionWrong = (v) => setQsess((s) => ({ ...s, sessionWrong: typeof v === 'function' ? v(s.sessionWrong) : v }));
  const setFinished = (v) => setQsess((s) => ({ ...s, finished: typeof v === 'function' ? v(s.finished) : v }));
  const setMockAnswers = (v) => setQsess((s) => ({ ...s, mockAnswers: typeof v === 'function' ? v(s.mockAnswers) : v }));
  const setSessionAnswers = (v) => setQsess((s) => ({ ...s, sessionAnswers: typeof v === 'function' ? v(s.sessionAnswers) : v }));
  const setMockBookmarks = (v) => setQsess((s) => ({ ...s, mockBookmarks: typeof v === 'function' ? v(s.mockBookmarks) : v }));

  // Derive active question list from phases or direct prop
  const questions = phases ? phases[phaseIdx].questions : (questionsProp || []);

  // Analytics: fire quiz_complete exactly once when `finished` first becomes true.
  // (The state lives in qsess and persists across theme switches, but the ref
  // guard ensures we only emit on the transition.)
  const reportedFinishRef = useRef(false);
  useEffect(() => {
    if (!finished) {
      reportedFinishRef.current = false;
      return;
    }
    if (reportedFinishRef.current) return;
    reportedFinishRef.current = true;

    const total = sessionCorrect + sessionWrong;
    const scorePct = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;
    const concept = conceptId ? CONCEPTS.find((c) => c.id === conceptId) : null;
    const isMock = mode === 'mock';
    const timeUsedSec = isMock ? (60 * 60 - mockTimeLeft) : null;
    trackQuizComplete({
      mode,
      conceptId,
      conceptLabel: concept?.label,
      scorePct,
      correctCount: sessionCorrect,
      wrongCount: sessionWrong,
      total,
      timeUsedSec,
      verdict: verdictFor(scorePct),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished]);

  // Ephemeral per-question UI state — local; resets on theme toggle, which is fine
  const [selected, setSelected] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);

  const isMock = mode === 'mock';
  const effectiveBookmarks = isMock ? mockBookmarks : (progress.bookmarks || {});

  function handleToggleBookmark(qid) {
    if (isMock) {
      setMockBookmarks((prev) => {
        const next = { ...prev };
        if (next[qid]) delete next[qid]; else next[qid] = true;
        return next;
      });
    } else if (onToggleBookmark) {
      onToggleBookmark(qid);
    }
  }

  // Timer tick — decrements shared mockTimeLeft so it survives theme toggles
  useEffect(() => {
    if (!isMock || finished) return;
    const interval = setInterval(() => {
      setQsess((s) => ({ ...s, mockTimeLeft: Math.max(0, s.mockTimeLeft - 1) }));
    }, 1000);
    return () => clearInterval(interval);
  }, [isMock, finished, setQsess]);

  useEffect(() => {
    if (isMock && mockTimeLeft === 0 && !finished) {
      finalizeMockExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockTimeLeft, isMock, finished]);

  function finalizeMockExam() {
    // Score every question
    let correct = 0;
    let wrong = 0;
    for (const qq of questions) {
      const ans = mockAnswers[qq.id];
      if (ans && arraysEqualAsSet(ans, qq.correct)) {
        correct++;
        onComplete(qq.id, true);
      } else {
        wrong++;
        // Only record as wrong if they attempted it; unanswered still counts as wrong on real exam
        onComplete(qq.id, false);
      }
    }
    setSessionCorrect(correct);
    setSessionWrong(wrong);
    setFinished(true);
  }

  const q = questions[idx];

  if (finished) {
    const total = sessionCorrect + sessionWrong;
    const pct = total > 0 ? Math.round((sessionCorrect / total) * 100) : 0;
    const passBar = isMock ? 85 : 85;
    let verdict, verdictColor;
    if (pct >= 95) {
      verdict = 'Perfect Score';
      verdictColor = 'var(--correct)';
    } else if (pct >= passBar) {
      verdict = 'Pass';
      verdictColor = 'var(--correct)';
    } else if (pct >= 70) {
      verdict = 'Almost There';
      verdictColor = 'var(--accent)';
    } else {
      verdict = 'Fail';
      verdictColor = 'var(--wrong)';
    }
    return (
      <div className="container-max fade-in">
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          {isMock ? '◉ Mock Exam · Results' : 'Quiz · Results'}
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 500, margin: '0 0 8px', letterSpacing: '-0.02em', color: verdictColor }}>
          {verdict}
        </h1>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 32 }}>
          <div className="numeric" style={{ fontSize: 64, lineHeight: 1, color: verdictColor }}>{pct}%</div>
          <div className="mono dim" style={{ fontSize: 13, letterSpacing: '0.1em' }}>
            {sessionCorrect} / {total} correct
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={onBack}>Done</button>
        </div>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="container-max fade-in">
        <div className="card" style={{ textAlign: 'center' }}>
          <div className="display" style={{ fontSize: 28, marginBottom: 12 }}>No questions in this set.</div>
          <button className="btn" onClick={onBack}>Back</button>
        </div>
      </div>
    );
  }

  const selectCount = q.selectCount || (q.type === 'multi' ? q.correct.length : 1);
  const canSubmit = selected.length === selectCount;

  function toggleOption(optId) {
    if (revealed && !isMock) return;
    let newSelected;
    if (selectCount === 1) {
      newSelected = [optId];
    } else {
      newSelected = selected.includes(optId)
        ? selected.filter((x) => x !== optId)
        : selected.length < selectCount ? [...selected, optId] : selected;
    }
    setSelected(newSelected);
    // In mock mode, save answer to the map on every change
    if (isMock) {
      setMockAnswers((prev) => ({ ...prev, [q.id]: newSelected }));
    }
  }

  function loadStateForQuestion(targetQ) {
    if (isMock) {
      setSelected(mockAnswers[targetQ.id] || []);
      setRevealed(false);
      setWasCorrect(null);
    } else {
      const saved = sessionAnswers[targetQ.id];
      if (saved) {
        setSelected(saved.selected);
        setRevealed(true);
        setWasCorrect(saved.wasCorrect);
      } else {
        setSelected([]);
        setRevealed(false);
        setWasCorrect(null);
      }
    }
  }

  async function submit() {
    if (!canSubmit || revealed) return;
    const correct = arraysEqualAsSet(selected, q.correct);
    setWasCorrect(correct);
    setRevealed(true);
    if (!sessionAnswers[q.id]) {
      if (correct) setSessionCorrect((x) => x + 1); else setSessionWrong((x) => x + 1);
      onComplete(q.id, correct);
    }
    setSessionAnswers((prev) => ({ ...prev, [q.id]: { selected, wasCorrect: correct } }));
  }

  function isAtFirst() {
    return idx === 0 && (!phases || phaseIdx === 0);
  }
  function isAtLast() {
    return idx + 1 >= questions.length && (!phases || phaseIdx === phases.length - 1);
  }

  function next() {
    if (idx + 1 >= questions.length) {
      if (isMock) {
        setConfirmSubmit(true);
        return;
      }
      if (phases && phaseIdx < phases.length - 1) {
        const nextPhaseQ = phases[phaseIdx + 1].questions[0];
        setPhaseIdx(phaseIdx + 1);
        setIdx(0);
        loadStateForQuestion(nextPhaseQ);
        return;
      }
      setFinished(true);
      return;
    }
    setIdx(idx + 1);
    loadStateForQuestion(questions[idx + 1]);
  }

  function prev() {
    if (idx === 0) {
      if (phases && phaseIdx > 0) {
        const prevPhase = phases[phaseIdx - 1];
        const lastIdx = prevPhase.questions.length - 1;
        setPhaseIdx(phaseIdx - 1);
        setIdx(lastIdx);
        loadStateForQuestion(prevPhase.questions[lastIdx]);
      }
      return;
    }
    setIdx(idx - 1);
    loadStateForQuestion(questions[idx - 1]);
  }

  function jumpToPhase(targetPhaseIdx, targetQIdx) {
    if (phases) {
      if (targetPhaseIdx !== phaseIdx) setPhaseIdx(targetPhaseIdx);
      const target = phases[targetPhaseIdx].questions[targetQIdx];
      setIdx(targetQIdx);
      loadStateForQuestion(target);
    } else {
      setIdx(targetQIdx);
      loadStateForQuestion(questions[targetQIdx]);
    }
  }

  // Mock-exam confirm-submit interstitial
  if (isMock && confirmSubmit) {
    const answered = Object.keys(mockAnswers).length;
    const unanswered = questions.length - answered;
    const timeMin = Math.floor(mockTimeLeft / 60);
    const timeSec = mockTimeLeft % 60;
    return (
      <div className="container-max fade-in">
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          ◉ Mock Exam · Submit
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 500, margin: '0 0 24px', letterSpacing: '-0.02em' }}>
          Ready to submit?
        </h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 32, maxWidth: 560 }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Answered</div>
            <div className="numeric" style={{ fontSize: 36, color: 'var(--text)' }}>{answered}</div>
            <div className="mono faint" style={{ fontSize: 11, marginTop: 4 }}>/ {questions.length}</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Unanswered</div>
            <div className="numeric" style={{ fontSize: 36, color: unanswered > 0 ? 'var(--wrong)' : 'var(--text-dim)' }}>{unanswered}</div>
            <div className="mono faint" style={{ fontSize: 11, marginTop: 4 }}>count as wrong</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Time left</div>
            <div className="numeric" style={{ fontSize: 36, color: 'var(--accent)' }}>{timeMin}:{String(timeSec).padStart(2, '0')}</div>
          </div>
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.6, maxWidth: 560, color: 'var(--text-dim)', marginBottom: 24 }}>
          Submitting will score your exam against the 85% pass bar. You won't be able to change answers after this.
          {unanswered > 0 && ` You still have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'} — they'll count as wrong.`}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={finalizeMockExam}>Submit Exam</button>
          <button className="btn ghost" onClick={() => setConfirmSubmit(false)}>Go back</button>
        </div>
      </div>
    );
  }

  // Mock-exam timer formatting
  const mockTimeMin = Math.floor(mockTimeLeft / 60);
  const mockTimeSec = mockTimeLeft % 60;
  const timerWarning = isMock && mockTimeLeft < 10 * 60; // Last 10 minutes
  const timerCritical = isMock && mockTimeLeft < 5 * 60; // Last 5 minutes
  const answeredCount = isMock ? Object.keys(mockAnswers).length : 0;

  return (
    <div className="container-max fade-in" key={q.id}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
        <button className="btn ghost" onClick={() => onBack(false)}>{isMock ? '← Abandon' : '← Exit'}</button>
        {isMock ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div className="mono" style={{ fontSize: 11, letterSpacing: '0.12em', color: 'var(--text-dim)' }}>
              <span className="numeric" style={{ color: 'var(--text)' }}>{String(idx + 1).padStart(2, '0')}</span>
              <span> / {String(questions.length).padStart(2, '0')}</span>
              <span style={{ margin: '0 12px' }}>·</span>
              <span className="numeric" style={{ color: 'var(--accent)' }}>{answeredCount}</span>
              <span> answered</span>
            </div>
            <div style={{
              padding: '6px 14px',
              border: `1px solid ${timerCritical ? 'var(--wrong)' : timerWarning ? 'var(--accent)' : 'var(--border-hi)'}`,
              background: timerCritical ? 'var(--wrong-soft)' : timerWarning ? 'var(--accent-soft)' : 'transparent',
              fontFamily: 'var(--font-mono)',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: timerCritical ? 'var(--wrong)' : timerWarning ? 'var(--accent)' : 'var(--text)',
            }}>
              ⏱ {mockTimeMin}:{String(mockTimeSec).padStart(2, '0')}
            </div>
          </div>
        ) : (
          <div className="mono faint" style={{ fontSize: 11, letterSpacing: '0.12em' }}>
            {phases && (
              <>
                <span style={{ color: 'var(--accent)' }}>Phase {phaseIdx + 1}/{phases.length}</span>
                <span style={{ margin: '0 10px' }}>·</span>
              </>
            )}
            {phases ? (
              <>
                <span className="numeric" style={{ color: 'var(--text)' }}>{String(phases.slice(0, phaseIdx).reduce((s, p) => s + p.questions.length, 0) + idx + 1).padStart(2, '0')}</span>
                <span> / {String(phases.reduce((s, p) => s + p.questions.length, 0)).padStart(2, '0')}</span>
              </>
            ) : (
              <>
                <span className="numeric" style={{ color: 'var(--text)' }}>{String(idx + 1).padStart(2, '0')}</span>
                <span> / {String(questions.length).padStart(2, '0')}</span>
              </>
            )}
            <span style={{ margin: '0 12px' }}>·</span>
            <span style={{ color: 'var(--correct)' }}>{sessionCorrect}</span>
            <span> correct</span>
          </div>
        )}
      </div>

      <PhaseProgressBar
        phases={phases || [{ name: 'All', questions }]}
        phaseIdx={phases ? phaseIdx : 0}
        questionIdx={idx}
        onJump={jumpToPhase}
        answered={isMock ? mockAnswers : sessionAnswers}
        bookmarks={effectiveBookmarks}
        uniform={!phases}
      />

      {!isMock && (
        <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          {CONCEPTS.find((c) => c.id === q.concept)?.label}
          {q.difficulty === 'brutal' && (
            <>
              <span style={{ margin: '0 10px' }}>·</span>
              <span style={{ color: 'var(--wrong)', letterSpacing: '0.2em' }}>◆ BRUTAL</span>
            </>
          )}
          {q.difficulty === 'scenario' && (
            <>
              <span style={{ margin: '0 10px' }}>·</span>
              <span style={{ color: 'var(--accent)', letterSpacing: '0.2em' }}>◆ SCENARIO</span>
            </>
          )}
        </div>
      )}

      {q.context && (
        <div style={{
          padding: '18px 22px',
          marginBottom: 24,
          background: 'var(--surface)',
          borderLeft: '3px solid var(--accent)',
          fontSize: 14.5,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          opacity: 0.92,
        }}>
          {q.context}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, margin: '0 0 18px' }}>
        <h2 className="display" style={{ fontSize: 'clamp(22px, 3.2vw, 28px)', lineHeight: 1.35, fontWeight: 500, margin: 0, letterSpacing: '-0.01em', flex: 1 }}>
          {q.difficulty === 'brutal' ? defangBrutalQuestion(q.q) : q.q}
        </h2>
        {(onToggleBookmark || isMock) && (() => {
          const bookmarked = !!effectiveBookmarks[q.id];
          return (
            <button
              type="button"
              onClick={() => handleToggleBookmark(q.id)}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this question'}
              title={bookmarked ? 'Bookmarked — click to remove' : 'Bookmark this question'}
              style={{
                marginTop: 4,
                padding: 6,
                lineHeight: 0,
                color: bookmarked ? '#ff8c1a' : 'var(--text-faint)',
                transition: 'color 0.15s, transform 0.15s',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="22" viewBox="0 0 20 22" aria-hidden="true">
                <path
                  d="M3 1.5h14a1 1 0 0 1 1 1v18l-8-5.5-8 5.5v-18a1 1 0 0 1 1-1z"
                  fill={bookmarked ? '#ff8c1a' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          );
        })()}
      </div>

      <div style={{
        display: 'inline-block',
        marginBottom: 20,
        padding: '5px 12px',
        fontSize: 11,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color: 'var(--accent)',
        border: '1px solid var(--accent-dim)',
        background: 'var(--accent-soft)',
      }}>
        {q.type === 'tf'
          ? 'Choose true or false'
          : selectCount === 1
            ? 'Select 1 answer'
            : `Select ${selectCount} answers`}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {q.options.map((opt, i) => {
          const isSelected = selected.includes(opt.id);
          const isCorrectOpt = q.correct.includes(opt.id);
          let cls = 'option-btn';
          if (revealed) {
            if (isCorrectOpt) cls += ' correct';
            else if (isSelected) cls += ' wrong';
          } else if (isSelected) {
            cls += ' selected';
          }
          const letter = q.type === 'tf' ? opt.id.toUpperCase() : String.fromCharCode(65 + i);
          return (
            <button
              key={opt.id}
              className={cls}
              onClick={() => toggleOption(opt.id)}
              disabled={revealed}
            >
              <span className="option-letter">{letter}</span>
              <span style={{ marginLeft: 8 }}>{opt.t}</span>
            </button>
          );
        })}
      </div>

      {isMock ? (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={prev} disabled={idx === 0}>
            ← Previous
          </button>
          {idx + 1 < questions.length ? (
            <button className="btn primary" onClick={next}>
              Next →
            </button>
          ) : (
            <button className="btn primary" onClick={() => setConfirmSubmit(true)} style={{ borderColor: 'var(--accent)', color: 'var(--bg)', background: 'var(--accent)' }}>
              Submit Exam
            </button>
          )}
          <button className="btn ghost" onClick={() => setConfirmSubmit(true)} style={{ marginLeft: 'auto' }}>
            Submit early
          </button>
          {selectCount > 1 && (
            <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
              Selected {selected.length} / {selectCount}
            </span>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" onClick={prev} disabled={isAtFirst()}>
            ← Previous
          </button>
          {!revealed && (
            <button className="btn primary" onClick={submit} disabled={!canSubmit}>
              Submit
            </button>
          )}
          <button className="btn primary" onClick={next}>
            {isAtLast() ? 'Finish' : 'Next →'}
          </button>
          {selectCount > 1 && !revealed && (
            <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
              Selected {selected.length} / {selectCount}
            </span>
          )}
        </div>
      )}

      {revealed && !isMock && (
        <div className="fade-in" style={{ marginTop: 24 }}>
          <div className={`chip ${wasCorrect ? 'correct' : 'wrong'}`} style={{ marginBottom: 14 }}>
            {wasCorrect ? '✓ Correct' : '✗ Not quite'}
          </div>

          <div className="card" style={{ borderLeft: `3px solid ${wasCorrect ? 'var(--correct)' : 'var(--wrong)'}` }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
              Explanation
            </div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6 }}>{q.explanation}</p>

            {!wasCorrect && q.distractors && (
              <>
                <div className="rule" style={{ margin: '18px 0' }} />
                <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
                  Why the other options mislead
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {Object.entries(q.distractors).map(([optId, note]) => {
                    const opt = q.options.find((o) => o.id === optId);
                    const i = q.options.indexOf(opt);
                    const letter = q.type === 'tf' ? optId.toUpperCase() : String.fromCharCode(65 + i);
                    return (
                      <li key={optId} style={{ display: 'flex', gap: 12, fontSize: 14 }}>
                        <span className="mono faint" style={{ fontSize: 11, fontWeight: 600 }}>{letter}</span>
                        <span style={{ color: 'var(--text-dim)', lineHeight: 1.55 }}>{note}</span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
