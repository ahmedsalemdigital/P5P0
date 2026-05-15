import React from 'react';
import { CONCEPTS } from '../../data/concepts.js';

export function ReviewScreen({ queue, onStart, onBack }) {
  // Group queued questions by concept so the player sees where their misses live.
  const conceptMap = new Map(CONCEPTS.map((c) => [c.id, c]));
  const byConcept = queue.reduce((acc, q) => {
    acc[q.concept] = (acc[q.concept] || 0) + 1;
    return acc;
  }, {});
  const rows = Object.entries(byConcept)
    .map(([id, count]) => ({ id, count, label: conceptMap.get(id)?.label || id }))
    .sort((a, b) => b.count - a.count);

  const empty = queue.length === 0;

  return (
    <div className="arc-scan-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onBack} aria-label="Back to concepts">
          <span aria-hidden="true">◀ </span>BACK
        </button>
        <h1 style={{ fontSize: 10, letterSpacing: 2, color: 'var(--magenta)', textShadow: '0 0 6px rgba(255,68,170,0.4)', margin: 0, fontWeight: 400 }}>
          REVIEW QUEUE
        </h1>
      </div>

      <div className="pbox" style={{
        padding: 18,
        marginBottom: 18,
        borderColor: 'var(--magenta)',
        background: 'rgba(255,68,170,0.05)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2, marginBottom: 8 }}>QUESTIONS PENDING</div>
        <div style={{ fontSize: 40, color: 'var(--magenta)', letterSpacing: 4, lineHeight: 1, textShadow: '0 0 12px rgba(255,68,170,0.5)' }}>
          {queue.length}
        </div>
        <div style={{ fontSize: 8, color: 'var(--g3)', letterSpacing: 1, marginTop: 10, lineHeight: 1.7 }}>
          {empty
            ? 'NO MISSES YET — ANSWER A QUIZ TO FILL THE QUEUE.'
            : 'QUESTIONS YOU’VE MISSED OR NOT YET ANSWERED CORRECTLY TWICE.'}
        </div>
      </div>

      {rows.length > 0 && (
        <>
          <h2 style={{ fontSize: 10, color: 'var(--g4)', letterSpacing: 3, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 400 }}>
            <span>BY CONCEPT</span>
            <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--g2)' }} />
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 22 }}>
            {rows.map((r) => (
              <div key={r.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '8px 12px', border: '1px solid var(--g2)', background: 'rgba(0,30,0,0.4)',
              }}>
                <span style={{ fontSize: 9, color: 'var(--g4)', letterSpacing: 1 }}>
                  {r.label.toUpperCase()}
                </span>
                <span style={{ fontSize: 9, color: 'var(--magenta)', letterSpacing: 1 }}>
                  × {r.count}
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <button
        onClick={onStart}
        disabled={empty}
        className="arc-btn"
        style={{
          width: '100%',
          fontFamily: 'Press Start 2P, monospace',
          fontSize: 14,
          padding: '22px 18px',
          letterSpacing: 4,
          background: empty ? 'var(--g1)' : 'var(--magenta)',
          color: empty ? 'var(--g2)' : '#000',
          border: 'none',
          cursor: empty ? 'not-allowed' : 'pointer',
          boxShadow: empty ? 'none' : '0 0 22px rgba(255,68,170,0.7), inset 0 0 0 3px #ff44aa',
          minHeight: 72,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          textTransform: 'uppercase', whiteSpace: 'nowrap',
        }}
      >
        <span style={{ fontSize: 16 }}>▶</span>
        <span>{empty ? 'QUEUE EMPTY' : 'START REVIEW'}</span>
      </button>
    </div>
  );
}
