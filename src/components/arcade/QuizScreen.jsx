import React, { useState, useEffect, useMemo } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { defangBrutalQuestion, arraysEqualAsSet } from '../../lib/progress.js';
import { Mascot } from './Mascot.jsx';

export function QuizScreen({ mode, conceptId, phases, questions, qsess, setQsess, progress, onComplete, onToggleBookmark, onFinish, onExit }) {
  const isMock = mode === 'mock';
  const isPhased = !!phases;
  const allQuestions = useMemo(() => isPhased ? phases.flatMap((p) => p.questions) : (questions || []), [isPhased, phases, questions]);
  const total = allQuestions.length;

  // Persistent state lives in qsess (lifted to App so theme toggle preserves progress)
  const phaseIdx = qsess.phaseIdx;
  const idx = qsess.idx;
  const mockAnswers = qsess.mockAnswers;       // qid -> selected[]
  const sessionAnswers = qsess.sessionAnswers; // qid -> { selected, wasCorrect }
  const phaseTransition = qsess.phaseTransition;
  const timeLeft = qsess.mockTimeLeft;
  const setPhaseIdx = (v) => setQsess((s) => ({ ...s, phaseIdx: typeof v === 'function' ? v(s.phaseIdx) : v }));
  const setIdx = (v) => setQsess((s) => ({ ...s, idx: typeof v === 'function' ? v(s.idx) : v }));
  const setPhaseTransition = (v) => setQsess((s) => ({ ...s, phaseTransition: typeof v === 'function' ? v(s.phaseTransition) : v }));

  const phaseOffset = isPhased ? phases.slice(0, phaseIdx).reduce((s, p) => s + p.questions.length, 0) : 0;
  const globalIdx = isPhased ? phaseOffset + idx : idx;
  const q = isPhased ? phases[phaseIdx]?.questions[idx] : questions[idx];

  // Ephemeral per-question UI state — local; resets on theme toggle, which is fine
  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [flash, setFlash] = useState(null);

  // Mock timer ticks against shared qsess
  useEffect(() => {
    if (!isMock) return;
    const iv = setInterval(() => {
      setQsess((s) => ({ ...s, mockTimeLeft: Math.max(0, s.mockTimeLeft - 1) }));
    }, 1000);
    return () => clearInterval(iv);
  }, [isMock, setQsess]);
  useEffect(() => {
    if (isMock && timeLeft === 0) finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const concept = conceptId ? CONCEPTS.find((c) => c.id === conceptId) : null;
  const isMulti = q && q.type === 'multi';
  const isTF = q && q.type === 'tf';
  const correctAnswers = q?.correct || [];
  const correctSet = new Set(correctAnswers);

  function toggleSelect(optId) {
    if (submitted) return;
    if (isMulti) {
      setSelected((p) => p.includes(optId) ? p.filter((x) => x !== optId) : [...p, optId]);
    } else {
      setSelected([optId]);
    }
  }

  // Hydrate ephemeral UI state when navigating to a different question.
  // Mock = never reveal feedback (selection only); non-mock = restore revealed state if answered.
  function loadStateForQuestion(targetQ) {
    if (!targetQ) return;
    if (isMock) {
      setSelected(mockAnswers[targetQ.id] || []);
      setSubmitted(false);
      setFlash(null);
    } else {
      const sa = sessionAnswers[targetQ.id];
      if (sa) {
        setSelected(sa.selected);
        setSubmitted(true);
        setFlash(sa.wasCorrect ? 'correct' : 'wrong');
      } else {
        setSelected([]);
        setSubmitted(false);
        setFlash(null);
      }
    }
  }

  function goTo(targetPhaseIdx, targetQIdx) {
    if (isPhased) {
      if (targetPhaseIdx !== phaseIdx) setPhaseIdx(targetPhaseIdx);
      setIdx(targetQIdx);
      loadStateForQuestion(phases[targetPhaseIdx].questions[targetQIdx]);
    } else {
      setIdx(targetQIdx);
      loadStateForQuestion(questions[targetQIdx]);
    }
  }

  function goPrev() {
    if (isPhased) {
      if (idx > 0) { goTo(phaseIdx, idx - 1); return; }
      if (phaseIdx > 0) {
        const prevP = phases[phaseIdx - 1];
        goTo(phaseIdx - 1, prevP.questions.length - 1);
      }
    } else {
      if (idx > 0) goTo(0, idx - 1);
    }
  }

  function goNext() {
    if (isPhased) {
      const len = phases[phaseIdx].questions.length;
      if (idx + 1 < len) { goTo(phaseIdx, idx + 1); return; }
      if (phaseIdx + 1 < phases.length) { setPhaseTransition(true); return; }
      finalize();
    } else {
      if (idx + 1 < total) { goTo(0, idx + 1); return; }
      finalize();
    }
  }

  // Map a global question index to (phaseIdx, localIdx)
  function globalToLocal(gIdx) {
    if (!isPhased) return { p: 0, i: gIdx };
    let acc = 0;
    for (let p = 0; p < phases.length; p++) {
      const len = phases[p].questions.length;
      if (gIdx < acc + len) return { p, i: gIdx - acc };
      acc += len;
    }
    return { p: phases.length - 1, i: phases[phases.length - 1].questions.length - 1 };
  }

  const atFirst = isPhased ? (phaseIdx === 0 && idx === 0) : idx === 0;
  const atLast = isPhased
    ? (phaseIdx === phases.length - 1 && idx + 1 >= phases[phaseIdx].questions.length)
    : idx + 1 >= total;

  function submit() {
    if (selected.length === 0) return;
    const correct = arraysEqualAsSet(selected, correctAnswers);
    const alreadyAnswered = isMock ? !!mockAnswers[q.id] : !!sessionAnswers[q.id];

    if (isMock) {
      // Deferred: don't reveal feedback, just record selection and advance
      setQsess((s) => alreadyAnswered ? ({
        ...s,
        mockAnswers: { ...s.mockAnswers, [q.id]: selected },
      }) : ({
        ...s,
        mockAnswers: { ...s.mockAnswers, [q.id]: selected },
        score: correct ? s.score + 10 : s.score,
        sessionCorrect: correct ? s.sessionCorrect + 1 : s.sessionCorrect,
        sessionWrong: correct ? s.sessionWrong : s.sessionWrong + 1,
      }));
      if (!alreadyAnswered) onComplete(q.id, correct);
      advanceImmediate();
    } else {
      // Immediate feedback
      setSubmitted(true);
      setFlash(correct ? 'correct' : 'wrong');
      if (!alreadyAnswered) {
        setQsess((s) => ({
          ...s,
          sessionAnswers: { ...s.sessionAnswers, [q.id]: { selected, wasCorrect: correct } },
          score: correct ? s.score + 10 : s.score,
          sessionCorrect: correct ? s.sessionCorrect + 1 : s.sessionCorrect,
          sessionWrong: correct ? s.sessionWrong : s.sessionWrong + 1,
        }));
        onComplete(q.id, correct);
      }
    }
  }

  function advanceImmediate() {
    setSelected([]);
    setSubmitted(false);
    setFlash(null);
    if (isPhased) {
      const len = phases[phaseIdx].questions.length;
      if (idx + 1 < len) { setIdx(idx + 1); return; }
      if (phaseIdx + 1 < phases.length) {
        setPhaseTransition(true);
        return;
      }
      finalize();
    } else {
      if (idx + 1 < total) { setIdx(idx + 1); return; }
      finalize();
    }
  }

  function next() { advanceImmediate(); }

  function continuePhase() {
    setPhaseIdx(phaseIdx + 1);
    setIdx(0);
    setPhaseTransition(false);
  }

  function finalize() {
    // Compute final score from the appropriate answer source
    let finalCorrect = 0;
    const finalResults = [];
    for (const qq of allQuestions) {
      let isRight = false;
      if (isMock) {
        const ans = mockAnswers[qq.id];
        isRight = !!ans && arraysEqualAsSet(ans, qq.correct);
      } else {
        const sa = sessionAnswers[qq.id];
        isRight = !!sa && sa.wasCorrect;
      }
      if (isRight) finalCorrect++;
      finalResults.push({ qid: qq.id, correct: isRight });
    }
    const finalTotal = total;
    // Mark mock answers as graded — onComplete updates progress storage
    if (isMock) {
      for (const r of finalResults) onComplete(r.qid, r.correct);
    }
    if (finalCorrect === finalTotal && finalTotal > 0) {
      try { localStorage.setItem('pspo_flawless', 'true'); } catch {}
    }
    onFinish({
      score: finalCorrect * 10,
      results: finalResults,
      total: finalTotal,
      correctCount: finalCorrect,
      wrongCount: finalTotal - finalCorrect,
      conceptId,
      mode,
      timeUsed: isMock ? (60 * 60 - timeLeft) : null,
    });
  }

  if (phaseTransition && isPhased) {
    const next = phases[phaseIdx + 1];
    return (
      <div className="arc-scan-in">
        <div className="pbox" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 8, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 10 }}>STAGE CLEAR · PHASE COMPLETE</div>
          <div className="arc-bounce" style={{ display: 'inline-block', marginBottom: 16 }}>
            <Mascot size={64} happy />
          </div>
          <div style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: 2, marginBottom: 6 }}>NEXT PHASE</div>
          <div style={{ fontSize: 10, color: 'var(--g5)', marginBottom: 4 }}>{next.name.toUpperCase()}</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', lineHeight: 1.7, marginBottom: 18 }}>{next.subtitle}</div>
          <button className="arc-btn" style={{ padding: '12px 24px', fontSize: 10, letterSpacing: 2 }} onClick={continuePhase}>▶ CONTINUE</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const answersMap = isMock ? mockAnswers : sessionAnswers;
  const answeredCount = Object.keys(answersMap).length;
  const progressPct = total > 0 ? (answeredCount / total) * 100 : 0;
  // Accuracy only meaningful in non-mock (mock has deferred scoring)
  const correctSoFar = isMock ? 0 : Object.values(sessionAnswers).filter((a) => a.wasCorrect).length;
  const accuracy = (!isMock && answeredCount > 0) ? Math.round((correctSoFar / answeredCount) * 100) : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const lowTime = isMock && timeLeft < 60 * 5;

  const headerLabel = mode === 'mock' ? '◉ MOCK EXAM'
    : mode === 'mixed' ? '⚡ QUICK QUIZ'
    : mode === 'review' ? '↻ REVIEW QUEUE'
    : (concept ? concept.label.toUpperCase() : 'QUIZ');

  const questionText = q.question || q.q || '';
  const displayedQuestionText = q.difficulty === 'brutal' ? defangBrutalQuestion(questionText) : questionText;
  const opts = q.options || [];

  return (
    <div className="arc-scan-in">
      {/* Top row: back + identity + accuracy/timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onExit}>◀</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 7, color: 'var(--g3)', marginBottom: 3, letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{headerLabel}</div>
            <div style={{ fontSize: 8, color: 'var(--g3)' }}>Q{globalIdx + 1}/{total}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {isMock ? (
            <>
              <div style={{ fontSize: 7, color: 'var(--g3)' }}>TIME LEFT</div>
              <div style={{ color: lowTime ? 'var(--red)' : 'var(--gold)', fontSize: 14, letterSpacing: 1 }}>{timeStr}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 7, color: 'var(--g3)' }}>ACCURACY</div>
              <div style={{ color: 'var(--gold)', fontSize: 14 }}>
                {answeredCount === 0 ? '—' : `${accuracy}%`}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Clickable per-question progress bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
        {allQuestions.map((qq, gIdx) => {
          const { p: pIdx, i: qIdx } = globalToLocal(gIdx);
          const isAnsweredHere = isMock ? !!mockAnswers[qq.id] : !!sessionAnswers[qq.id];
          const sa = !isMock ? sessionAnswers[qq.id] : null;
          const wasCorrect = sa?.wasCorrect;
          const isCurr = gIdx === globalIdx;
          const isBookmarked = isMock
            ? !!qsess.mockBookmarks?.[qq.id]
            : !!progress.bookmarks?.[qq.id];
          let bg = 'transparent';
          let bColor = 'var(--g2)';
          let txt = 'var(--g3)';
          if (isCurr) {
            bColor = 'var(--g4)'; bg = 'rgba(0,255,65,0.15)'; txt = 'var(--g4)';
          } else if (isAnsweredHere) {
            if (isMock) {
              bColor = 'var(--g3)'; bg = 'rgba(0,255,65,0.10)'; txt = 'var(--g4)';
            } else if (wasCorrect) {
              bColor = 'var(--g4)'; bg = 'rgba(0,255,65,0.18)'; txt = 'var(--g4)';
            } else {
              bColor = 'var(--red)'; bg = 'rgba(255,58,58,0.18)'; txt = 'var(--red)';
            }
          }
          return (
            <button key={gIdx} onClick={() => goTo(pIdx, qIdx)}
              title={`Q${gIdx + 1}${isBookmarked ? ' · ★ bookmarked' : ''}${isAnsweredHere && !isMock ? (wasCorrect ? ' · correct' : ' · wrong') : isAnsweredHere ? ' · answered' : ''}`}
              style={{
                flex: '0 0 auto',
                fontFamily: 'Press Start 2P, monospace',
                fontSize: 6,
                padding: '3px 4px',
                minWidth: 16,
                height: 16,
                background: bg,
                border: `1.5px solid ${isBookmarked ? 'var(--gold)' : bColor}`,
                color: txt,
                cursor: 'pointer',
                letterSpacing: 0.5,
                lineHeight: 1,
                boxShadow: isBookmarked ? '0 0 4px rgba(255,176,0,0.4)' : 'none',
              }}>{gIdx + 1}</button>
          );
        })}
      </div>
      {isPhased && (
        <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 12 }}>
          PHASE {phaseIdx + 1} / {phases.length} · {phases[phaseIdx].name.toUpperCase()} · {Math.round(progressPct)}% DONE
        </div>
      )}
      {!isPhased && (
        <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 12 }}>
          {Math.round(progressPct)}% DONE
        </div>
      )}

      {/* Selection hint */}
      <div style={{ fontSize: 7, color: 'var(--g3)', marginBottom: 12, letterSpacing: 1 }}>
        {isMulti ? `SELECT ${q.selectCount || correctAnswers.length}` : isTF ? 'TRUE OR FALSE' : 'SINGLE ANSWER'}
      </div>

      {/* Question + mascot */}
      <div className="pbox" style={{
        marginBottom: 12,
        borderColor: flash === 'correct' ? 'var(--g4)' : flash === 'wrong' ? 'var(--red)' : 'var(--g4)',
        background: flash === 'correct' ? 'rgba(0,255,65,0.08)' : flash === 'wrong' ? 'rgba(255,58,58,0.10)' : 'transparent',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className={flash ? '' : 'arc-bounce'} style={{ flexShrink: 0, marginTop: -4 }}>
            <Mascot size={36} talking={!submitted} happy={flash === 'correct'} sad={flash === 'wrong'} />
          </div>
          <p style={{ fontSize: 8, color: 'var(--g5)', lineHeight: 1.9, flex: 1 }}>{displayedQuestionText}</p>
          <button onClick={() => onToggleBookmark(q.id)} title="Bookmark"
            style={{
              flexShrink: 0, background: 'transparent',
              border: '1px solid var(--g2)', color: progress.bookmarks?.[q.id] ? 'var(--gold)' : 'var(--g3)',
              padding: '4px 6px', cursor: 'pointer', fontSize: 10, lineHeight: 1,
            }}>★</button>
        </div>
      </div>

      {/* Options */}
      <div style={{ marginBottom: 12 }}>
        {opts.map((opt) => {
          const isSel = selected.includes(opt.id);
          const isCorr = correctSet.has(opt.id);
          let cls = 'opt-btn';
          if (submitted) {
            if (isCorr) cls += ' correct';
            else if (isSel && !isCorr) cls += ' wrong';
          } else if (isSel) {
            cls += ' selected';
          }
          const optText = opt.text || opt.t || '';
          return (
            <button key={opt.id} className={cls} onClick={() => toggleSelect(opt.id)} disabled={submitted}>
              <span style={{
                color: submitted && isCorr ? '#000' : submitted && isSel && !isCorr ? 'var(--red)' : 'var(--g3)',
                marginRight: 8,
              }}>[{opt.id.toUpperCase()}]</span>
              {optText}
            </button>
          );
        })}
      </div>

      {/* Navigation row — prev / next without requiring submit */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <button className="arc-btn arc-btn-ghost" style={{ flex: 1, padding: 10, fontSize: 8 }}
          onClick={goPrev} disabled={atFirst}>◀ PREV</button>
        <button className="arc-btn arc-btn-ghost" style={{ flex: 1, padding: 10, fontSize: 8 }}
          onClick={goNext} disabled={atLast && submitted ? false : atLast}>NEXT ▶</button>
      </div>

      {/* Confirm or feedback */}
      {!submitted && (
        <div style={{ display: 'flex', gap: 8 }}>
          {isMock && (
            <button className="arc-btn arc-btn-ghost" style={{ padding: 12, fontSize: 8 }} onClick={() => {
              if (window.confirm('Submit mock exam now?')) finalize();
            }}>SUBMIT EXAM</button>
          )}
          <button className="arc-btn" style={{ flex: 1, padding: 12, fontSize: 9 }} onClick={submit} disabled={selected.length === 0}>
            ▶ CONFIRM
          </button>
        </div>
      )}

      {submitted && !isMock && (
        <div>
          <div className="pbox" style={{ marginBottom: 10, borderColor: flash === 'correct' ? 'var(--g4)' : 'var(--red)' }}>
            <div style={{ fontSize: 8, color: flash === 'correct' ? 'var(--g4)' : 'var(--red)', marginBottom: 6, letterSpacing: 1 }}>
              {flash === 'correct' ? '✓ CORRECT!' : '✕ WRONG'}
            </div>
            <div style={{ fontSize: 8, color: 'var(--g3)', lineHeight: 1.9 }}>{q.explanation}</div>
          </div>
          <button className="arc-btn" style={{ width: '100%', padding: 12, fontSize: 9 }} onClick={next}>
            {(isPhased ? (idx + 1 >= phases[phaseIdx].questions.length && phaseIdx + 1 >= phases.length) : (idx + 1 >= total))
              ? '▶ SEE RESULTS' : '▶ NEXT'}
          </button>
        </div>
      )}
    </div>
  );
}
