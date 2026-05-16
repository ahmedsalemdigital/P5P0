import React, { useState } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { QUESTIONS } from '../../data/questions.js';
import { masteryForConcept } from '../../lib/progress.js';

export function ConceptSelect({ progress, onSelect, onBack, onStartQuick, onStartMock, onStartReview, reviewQueueSize }) {
  const [hover, setHover] = useState(null);
  const totalQs = QUESTIONS.length;

  return (
    <div className="arc-scan-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onBack} aria-label="Back to title">
          <span aria-hidden="true">◀ </span>BACK
        </button>
        <h1 style={{ fontSize: 10, letterSpacing: 2, margin: 0, fontWeight: 400 }}>SELECT STAGE</h1>
      </div>

      <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2, display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <span>2020 SCRUM GUIDE</span>
        <span style={{ color: 'var(--g2)' }}>·</span>
        <span>{totalQs} QUESTIONS</span>
        <span style={{ color: 'var(--g2)' }}>·</span>
        <span>{CONCEPTS.length} CONCEPTS</span>
      </div>

      <h2 style={{ fontSize: 18, color: 'var(--g5)', lineHeight: 1.4, margin: '0 0 12px', letterSpacing: 1, fontWeight: 400 }}>
        Master PSPO I
      </h2>

      <div style={{ fontSize: 9, color: 'var(--g3)', lineHeight: 1.9, marginBottom: 18 }}>
        A focused study engine for the PSPO I exam. Concept lessons,
        distractor-level feedback on wrong answers, and spaced review of
        what you miss.
      </div>

      {/* Action chips — three across */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }} role="group" aria-label="Quick actions">
        <button onClick={onStartQuick} className="pbox" aria-label="Start quick quiz, 10 questions" style={{
          flex: 1, minWidth: 0,
          padding: '12px 8px', cursor: 'pointer', borderColor: 'var(--cyan)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'transparent', textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--cyan)', letterSpacing: 2, textShadow: '0 0 6px rgba(68,221,255,0.4)' }}>QUICK</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1 }}>10 QS</div>
        </button>
        <button onClick={onStartMock} className="pbox" aria-label="Start mock exam, 80 questions in 60 minutes" style={{
          flex: 1, minWidth: 0,
          padding: '12px 8px', cursor: 'pointer', borderColor: 'var(--purple)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'transparent', textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--purple)', letterSpacing: 2, textShadow: '0 0 6px rgba(176,102,255,0.4)' }}>
            <span aria-hidden="true">◉ </span>MOCK
          </div>
          <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1 }}>80·60M</div>
        </button>
        <button
          onClick={onStartReview}
          disabled={reviewQueueSize === 0}
          className="pbox"
          aria-label={`Start review queue, ${reviewQueueSize} items`}
          style={{
            flex: 1, minWidth: 0,
            padding: '12px 8px', cursor: reviewQueueSize === 0 ? 'not-allowed' : 'pointer',
            opacity: reviewQueueSize === 0 ? 0.5 : 1,
            borderColor: 'var(--magenta)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
            background: 'transparent', textAlign: 'center',
          }}>
          <div style={{ fontSize: 9, color: 'var(--magenta)', letterSpacing: 2, textShadow: '0 0 6px rgba(255,68,170,0.4)' }}>REVIEW</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1 }}>{reviewQueueSize} ITEMS</div>
        </button>
      </div>

      <h2 style={{ fontSize: 10, color: 'var(--g4)', letterSpacing: 3, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 10, fontWeight: 400 }}>
        <span>CONCEPTS</span>
        <span aria-hidden="true" style={{ flex: 1, height: 1, background: 'var(--g2)' }} />
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONCEPTS.map((c, i) => {
          const m = masteryForConcept(progress, c.id);
          const cleared = m.level === 'mastered';
          const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
          return (
            <button key={c.id} className="pbox"
              style={{
                cursor: 'pointer', textAlign: 'left',
                border: `2px solid ${hover === c.id ? 'var(--g4)' : 'var(--g2)'}`,
                background: hover === c.id ? 'var(--g1)' : 'transparent',
                padding: '12px 14px', transition: 'all 0.1s', outline: 'none',
                boxShadow: cleared ? '0 0 8px rgba(0,255,65,0.4)' : 'none',
                color: 'var(--g4)',
              }}
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => setHover(c.id)}
              onMouseLeave={() => setHover(null)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 18, color: c.optional ? 'var(--magenta)' : 'var(--gold)', letterSpacing: 1, flexShrink: 0, minWidth: 28, textAlign: 'center' }}>
                  {c.optional ? '+' : String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 6, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: 'var(--g5)', letterSpacing: 1 }}>{c.label.toUpperCase()}</div>
                      {c.optional && (
                        <span style={{
                          fontSize: 6, color: 'var(--magenta)', letterSpacing: 1,
                          padding: '1px 5px', border: '1px solid var(--magenta)',
                          textShadow: '0 0 4px rgba(255,68,170,0.4)',
                        }}>OPTIONAL · +EXTRA</span>
                      )}
                    </div>
                    <div style={{ fontSize: 7, color: cleared ? 'var(--gold)' : 'var(--g3)', letterSpacing: 1, flexShrink: 0 }}>
                      {cleared ? '★ CLEARED' : 'LEARNING'}
                    </div>
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--g3)', marginBottom: 10, lineHeight: 1.6 }}>{c.subtitle}</div>
                  <div
                    className="pbar-wrap"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${c.label} mastery, ${pct} percent`}
                    style={{ height: 5, marginBottom: 5 }}
                  >
                    <div className="pbar-fill" style={{ width: `${pct}%`, height: '100%', background: c.optional ? 'var(--magenta)' : 'var(--g4)' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 7, color: 'var(--g3)' }}>
                    <span>{m.uniqueCorrect} / {m.questionCount} CORRECT</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px dashed var(--g2)' }}>
        <div style={{ fontSize: 8, color: 'var(--g4)', letterSpacing: 2, marginBottom: 10 }}>DISCLAIMER</div>
        <div style={{ fontSize: 7, color: 'var(--g2)', lineHeight: 1.9 }}>
          PSPO·I Trainer is an independent study tool not affiliated with,
          endorsed by, or officially associated with Scrum.org or any of its
          subsidiaries. Use of this application does not guarantee success on
          the Professional Scrum Product Owner I (PSPO I) assessment, nor does
          it confer any certification or credential.
        </div>
      </div>
    </div>
  );
}
