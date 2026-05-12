import React, { useState, useEffect, useRef } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { QUESTIONS } from '../../data/questions.js';
import { masteryForConcept } from '../../lib/progress.js';

export function StatsView({ progress, onBack, onReset }) {
  const allQids = QUESTIONS.map((q) => q.id);
  const seen = allQids.filter((id) => progress.questions[id]).length;
  const masteredQs = allQids.filter((id) => {
    const p = progress.questions[id];
    return p && (p.correctCount || 0) >= 2 && (p.correctCount || 0) > (p.wrongCount || 0);
  }).length;
  const [confirmingReset, setConfirmingReset] = useState(false);
  const resetTimer = useRef(null);

  function handleResetClick() {
    if (confirmingReset) {
      if (resetTimer.current) clearTimeout(resetTimer.current);
      setConfirmingReset(false);
      onReset();
    } else {
      setConfirmingReset(true);
      resetTimer.current = setTimeout(() => setConfirmingReset(false), 4000);
    }
  }

  useEffect(() => {
    return () => { if (resetTimer.current) clearTimeout(resetTimer.current); };
  }, []);

  return (
    <div className="container-max fade-in">
      <button className="btn ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Back</button>

      <h1 className="display" style={{ fontSize: 'clamp(30px, 5vw, 42px)', fontWeight: 500, margin: '0 0 24px', letterSpacing: '-0.02em' }}>Your progress</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 40 }}>
        {[
          ['Questions seen', `${seen} / ${allQids.length}`],
          ['Questions mastered', `${masteredQs} / ${allQids.length}`],
          ['Total answered', progress.totalAnswered],
          ['Overall accuracy', progress.totalAnswered > 0 ? `${Math.round((progress.totalCorrect / progress.totalAnswered) * 100)}%` : '—'],
        ].map(([label, val]) => (
          <div key={label} className="card" style={{ padding: 20 }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 8 }}>{label}</div>
            <div className="numeric" style={{ fontSize: 32, lineHeight: 1 }}>{val}</div>
          </div>
        ))}
      </div>

      <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>Concept breakdown</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {CONCEPTS.map((c) => {
          const m = masteryForConcept(progress, c.id);
          return (
            <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
              <div style={{ flex: 1 }}>
                <div className="display" style={{ fontSize: 17, fontWeight: 500 }}>{c.label}</div>
                <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                  {m.level} · {m.totalAnswered} answered
                </div>
              </div>
              <div style={{ width: 140, height: 4, background: 'var(--border)', position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, width: `${Math.round(m.coverage * 100)}%`, background: 'var(--accent)' }} />
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--text-dim)', minWidth: 40, textAlign: 'right' }}>
                {m.totalAnswered > 0 ? `${Math.round(m.accuracy * 100)}%` : '—'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rule" style={{ margin: '32px 0 20px' }} />

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div className="mono faint" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Danger zone</div>
        <button
          className="btn"
          onClick={handleResetClick}
          style={{
            borderColor: confirmingReset ? 'var(--wrong)' : 'var(--border)',
            color: confirmingReset ? 'var(--wrong)' : 'var(--text-dim)',
            background: confirmingReset ? 'var(--wrong-soft)' : 'var(--surface)',
          }}
        >
          {confirmingReset ? 'Click again to confirm reset' : 'Reset all progress'}
        </button>
        {confirmingReset && (
          <div className="mono faint fade-in" style={{ fontSize: 10, letterSpacing: '0.12em' }}>
            This will clear all mastery and answer history
          </div>
        )}
      </div>

      <div className="mono faint" style={{ fontSize: 10, letterSpacing: '0.14em', textAlign: 'center' }}>
        Progress stored in this browser · not synced
      </div>
    </div>
  );
}
