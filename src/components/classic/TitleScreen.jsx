import React from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { masteryForConcept } from '../../lib/progress.js';
import { overallProgress } from '../../lib/quiz.js';

export function TitleScreen({ progress, onStart, onToggleTheme }) {
  const { total: totalPct, maxTotal } = overallProgress(progress);
  const requiredConcepts = CONCEPTS.filter((c) => !c.optional);
  const totalCleared = requiredConcepts.filter(
    (c) => masteryForConcept(progress, c.id).level === 'mastered',
  ).length;

  return (
    <div className="container-max fade-in">
      {/* Hero */}
      <section style={{ marginBottom: 64 }}>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '-0.224px',
            color: 'var(--text-dim)',
            margin: '0 0 14px',
          }}
        >
          Independent study tool for the Professional Scrum Product Owner I exam
        </p>
        <h1
          className="display"
          style={{
            fontSize: 'clamp(36px, 6vw, 56px)',
            lineHeight: 1.07,
            fontWeight: 600,
            letterSpacing: '-0.022em',
            margin: '0 0 20px',
            maxWidth: 760,
          }}
        >
          Study for the <span style={{ color: 'var(--accent)' }}>PSPO I</span> exam — and pass it.
        </h1>
        <p
          style={{
            fontSize: 21,
            lineHeight: 1.43,
            fontWeight: 400,
            letterSpacing: '-0.231px',
            color: 'var(--text-dim)',
            maxWidth: 620,
            margin: 0,
          }}
        >
          Concept lessons grounded in the 2020 Scrum Guide. Distractor-level
          feedback on every wrong answer. A spaced-review queue that brings
          back exactly what you miss — until you don't miss it anymore.
        </p>

        {/* Primary action row — Apple primary + secondary pills */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            marginTop: 32,
            flexWrap: 'wrap',
          }}
        >
          <button className="btn primary" onClick={onStart}>
            Start studying
          </button>
          <button
            className="btn secondary"
            onClick={onToggleTheme}
            aria-label="Switch to retro arcade theme"
          >
            Try retro arcade
          </button>
        </div>
      </section>

      {/* Progress overview */}
      <section style={{ marginBottom: 64 }} aria-labelledby="progress-heading">
        <h2
          id="progress-heading"
          className="display"
          style={{
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: '-0.022em',
            margin: '0 0 20px',
          }}
        >
          Your progress
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 16,
            marginBottom: 28,
            maxWidth: 560,
          }}
        >
          <div className="card">
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-dim)',
                letterSpacing: '-0.224px',
                marginBottom: 10,
              }}
            >
              Concepts cleared
            </div>
            <div className="numeric" style={{ fontSize: 40, color: 'var(--text)', lineHeight: 1.1 }}>
              {totalCleared}
              <span
                style={{
                  fontSize: 17,
                  color: 'var(--text-dim)',
                  marginLeft: 6,
                  fontWeight: 400,
                  letterSpacing: '-0.374px',
                }}
              >
                / {requiredConcepts.length}
              </span>
            </div>
          </div>
          <div className="card">
            <div
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--text-dim)',
                letterSpacing: '-0.224px',
                marginBottom: 10,
              }}
            >
              Total progress
            </div>
            <div
              className="numeric"
              style={{
                fontSize: 40,
                color: totalPct > 100 ? 'var(--accent)' : 'var(--text)',
                lineHeight: 1.1,
              }}
            >
              {totalPct}
              <span
                style={{
                  fontSize: 17,
                  color: 'var(--text-dim)',
                  marginLeft: 2,
                  fontWeight: 400,
                  letterSpacing: '-0.374px',
                }}
              >
                %
              </span>
              <span
                style={{
                  fontSize: 13,
                  color: 'var(--text-faint)',
                  marginLeft: 8,
                  fontWeight: 400,
                  letterSpacing: '-0.156px',
                }}
              >
                of {maxTotal}%
              </span>
            </div>
          </div>
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
          }}
        >
          {CONCEPTS.map((c) => {
            const m = masteryForConcept(progress, c.id);
            const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
            const cleared = m.level === 'mastered';
            const barColor = c.optional ? 'var(--accent)' : 'var(--correct)';
            return (
              <li
                key={c.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 120px 48px',
                  alignItems: 'center',
                  gap: 14,
                  padding: '8px 0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontSize: 13,
                      color: cleared ? 'var(--correct)' : 'var(--text-faint)',
                      width: 14,
                      flexShrink: 0,
                    }}
                  >
                    {cleared ? '✓' : '○'}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      color: cleared ? 'var(--text)' : 'var(--text-dim)',
                      letterSpacing: '-0.156px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.label}
                  </span>
                  {c.optional && (
                    <span
                      className="chip accent"
                      style={{
                        fontSize: 10,
                        padding: '2px 8px',
                        letterSpacing: '-0.08px',
                        textTransform: 'none',
                        flexShrink: 0,
                      }}
                    >
                      Optional
                    </span>
                  )}
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${c.label} mastery`}
                  style={{ height: 4, background: 'var(--border)', borderRadius: 2, position: 'relative' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: `${pct}%`,
                      background: barColor,
                      borderRadius: 2,
                    }}
                  />
                </div>
                <div
                  className="numeric"
                  style={{
                    fontSize: 13,
                    color: 'var(--text-dim)',
                    textAlign: 'right',
                    letterSpacing: '-0.156px',
                  }}
                >
                  {pct}%
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="rule" style={{ margin: '0 0 24px' }} />
      <footer>
        <p
          style={{
            fontSize: 12,
            lineHeight: 1.5,
            color: 'var(--text-faint)',
            maxWidth: 720,
            margin: 0,
            letterSpacing: '-0.12px',
          }}
        >
          PSPO·I Trainer is an independent study tool not affiliated with,
          endorsed by, or officially associated with Scrum.org or any of its
          subsidiaries. Use of this application does not guarantee success on
          the Professional Scrum Product Owner I (PSPO I) assessment, nor does
          it confer any certification or credential.
        </p>
        <nav
          aria-label="Legal"
          style={{
            marginTop: 14,
            display: 'flex',
            gap: 18,
            flexWrap: 'wrap',
            fontSize: 12,
            letterSpacing: '-0.12px',
          }}
        >
          <a href="/privacy.html" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms.html" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Terms</a>
          <a href="/cookies.html" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Cookies</a>
          <a href="mailto:ahmed3abdul3aal@gmail.com" style={{ color: 'var(--text-dim)', textDecoration: 'none' }}>Contact</a>
        </nav>
      </footer>
    </div>
  );
}
