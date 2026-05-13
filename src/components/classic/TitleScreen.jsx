import React from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { masteryForConcept } from '../../lib/progress.js';
import { overallProgress } from '../../lib/quiz.js';

export function TitleScreen({ progress, onStart, onToggleTheme }) {
  const { total: totalPct, maxTotal } = overallProgress(progress);
  const requiredConcepts = CONCEPTS.filter((c) => !c.optional);
  const totalCleared = requiredConcepts.filter((c) => masteryForConcept(progress, c.id).level === 'mastered').length;

  return (
    <div className="container-max fade-in">
      <section style={{ marginBottom: 48 }}>
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          PSPO·I Trainer
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(40px, 7vw, 64px)', lineHeight: 1.02, margin: '0 0 20px', fontWeight: 500, letterSpacing: '-0.025em' }}>
          Master PSPO I
        </h1>
        <p className="dim" style={{ fontSize: 17, maxWidth: 580, margin: 0, lineHeight: 1.55 }}>
          A focused study engine for the PSPO I exam. Concept lessons,
          distractor-level feedback on wrong answers, and spaced review of
          what you miss.
        </p>

        {/* Primary action row — Start + Switch Style */}
        <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
          <button
            className="btn primary"
            onClick={onStart}
            style={{ fontSize: 14, padding: '14px 28px', letterSpacing: '0.04em' }}
          >
            Start studying →
          </button>
          <button
            onClick={onToggleTheme}
            className="mono"
            style={{
              fontSize: 12,
              padding: '14px 24px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              background: 'transparent',
              border: '1px solid var(--accent)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
            }}
            title="Switch to arcade theme"
          >
            <span style={{ fontSize: 14 }}>◉</span>
            <span>Try arcade theme</span>
          </button>
        </div>
      </section>

      {/* Progress overview */}
      <section style={{ marginBottom: 48 }}>
        <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 14 }}>
          Mission log
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginBottom: 24, maxWidth: 560 }}>
          <div className="card" style={{ textAlign: 'left' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Concepts cleared</div>
            <div className="numeric" style={{ fontSize: 36, color: 'var(--text)' }}>
              {totalCleared}<span className="mono faint" style={{ fontSize: 14, marginLeft: 4 }}>/{requiredConcepts.length}</span>
            </div>
          </div>
          <div className="card" style={{ textAlign: 'left' }}>
            <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>Total progress</div>
            <div className="numeric" style={{ fontSize: 36, color: totalPct > 100 ? 'var(--accent)' : 'var(--text)' }}>
              {totalPct}<span className="mono faint" style={{ fontSize: 14, marginLeft: 2 }}>%</span>
              <span className="mono faint" style={{ fontSize: 11, marginLeft: 6 }}>/ {maxTotal}%</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {CONCEPTS.map((c) => {
            const m = masteryForConcept(progress, c.id);
            const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
            const cleared = m.level === 'mastered';
            const barColor = c.optional ? 'var(--accent)' : 'var(--correct)';
            return (
              <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 50px', alignItems: 'center', gap: 12, padding: '6px 0' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, minWidth: 0 }}>
                  <span className="mono" style={{
                    fontSize: 11,
                    color: cleared ? 'var(--correct)' : 'var(--text-dim)',
                    letterSpacing: '0.04em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {cleared ? '★ ' : '• '}{c.label}
                  </span>
                  {c.optional && (
                    <span className="mono" style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--accent)', padding: '1px 5px',
                      border: '1px solid var(--accent-dim)', borderRadius: 3,
                      flexShrink: 0,
                    }}>Optional</span>
                  )}
                </div>
                <div style={{ height: 4, background: 'var(--border)', position: 'relative' }}>
                  <div style={{ position: 'absolute', inset: 0, width: `${pct}%`, background: barColor }} />
                </div>
                <div className="mono faint" style={{ fontSize: 10, textAlign: 'right' }}>{pct}%</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="rule" style={{ margin: '24px 0' }} />
      <p className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Disclaimer</p>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-faint)', maxWidth: 640, margin: 0 }}>
        PSPO·I Trainer is an independent study tool not affiliated with, endorsed by, or officially associated with Scrum.org or any of its subsidiaries. Use of this application does not guarantee success on the Professional Scrum Product Owner I (PSPO I) assessment, nor does it confer any certification or credential.
      </p>
    </div>
  );
}
