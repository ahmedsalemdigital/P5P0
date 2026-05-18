import React, { useState, useEffect, useRef } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { QUESTIONS } from '../../data/questions.js';
import { masteryForConcept } from '../../lib/progress.js';

export function StatsScreen({ progress, onBack, onReset }) {
  const allQids = QUESTIONS.map((q) => q.id);
  const seen = allQids.filter((id) => progress.questions[id]).length;
  const masteredQs = allQids.filter((id) => {
    const p = progress.questions[id];
    return p && (p.correctCount || 0) >= 2 && (p.correctCount || 0) > (p.wrongCount || 0);
  }).length;
  const accuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : null;

  const [confirming, setConfirming] = useState(false);
  const timer = useRef(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function handleReset() {
    if (confirming) {
      if (timer.current) clearTimeout(timer.current);
      setConfirming(false);
      onReset();
    } else {
      setConfirming(true);
      timer.current = setTimeout(() => setConfirming(false), 4000);
    }
  }

  const stats = [
    ['QUESTIONS SEEN', `${seen}/${allQids.length}`],
    ['QUESTIONS MASTERED', `${masteredQs}/${allQids.length}`],
    ['TOTAL ANSWERED', progress.totalAnswered],
    ['OVERALL ACCURACY', accuracy === null ? '—' : `${accuracy}%`],
  ];

  return (
    <div className="arc-scan-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onBack} aria-label="Back to concepts">
          <span aria-hidden="true">◀ </span>BACK
        </button>
        <h1 style={{ fontSize: 10, letterSpacing: 2, margin: 0, fontWeight: 400 }}>PLAYER STATS</h1>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8, marginBottom: 16,
      }}>
        {stats.map(([label, val]) => (
          <div key={label} className="pbox" style={{ padding: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 16, color: 'var(--gold)' }}>{val}</div>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2, marginBottom: 8 }}>● CONCEPT BREAKDOWN</div>
      <div style={{ marginBottom: 22 }}>
        {CONCEPTS.map((c) => {
          const m = masteryForConcept(progress, c.id);
          const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
          const cleared = m.level === 'mastered';
          return (
            <div key={c.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3, gap: 6 }}>
                <div style={{ fontSize: 7, color: cleared ? 'var(--g4)' : 'var(--g3)', letterSpacing: 0.5 }}>
                  {cleared ? '★ ' : '• '}{c.label.toUpperCase()}
                  {c.optional && (
                    <span style={{ fontSize: 5, color: 'var(--magenta)', letterSpacing: 1, padding: '1px 4px', border: '1px solid var(--magenta)', marginLeft: 6 }}>+EXTRA</span>
                  )}
                </div>
                <div style={{ fontSize: 6, color: 'var(--g2)' }}>{pct}%</div>
              </div>
              <div className="pbar-wrap" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.label} mastery, ${pct} percent`} style={{ height: 5 }}>
                <div className="pbar-fill" style={{ width: `${pct}%`, height: '100%', background: c.optional ? 'var(--magenta)' : 'var(--g4)' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ paddingTop: 14, borderTop: '1px dashed var(--g2)' }}>
        <div style={{ fontSize: 7, color: 'var(--magenta)', letterSpacing: 2, marginBottom: 10 }}>● DANGER ZONE</div>
        <button
          className="arc-btn"
          onClick={handleReset}
          style={{
            fontSize: 10,
            padding: '14px 18px',
            background: confirming ? 'var(--magenta)' : '#000',
            color: confirming ? '#000' : 'var(--magenta)',
            border: '2px solid var(--magenta)',
            letterSpacing: 2,
          }}
        >
          {confirming ? 'CONFIRM RESET' : 'RESET ALL PROGRESS'}
        </button>
        {confirming && (
          <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginTop: 8 }}>
            ▸ THIS WILL ERASE ALL MASTERY AND ANSWER HISTORY
          </div>
        )}
        <div style={{ fontSize: 6, color: 'var(--g2)', letterSpacing: 1, marginTop: 14, textAlign: 'center' }}>
          PROGRESS STORED IN THIS BROWSER · NOT SYNCED
        </div>
      </div>
    </div>
  );
}
