import React, { useMemo } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { QUESTIONS } from '../../data/questions.js';
import { masteryForConcept } from '../../lib/progress.js';
import { MasteryDots } from './MasteryDots.jsx';

export function HomeView({ progress, onPickConcept, onStartReview, onStartQuick, onStartMock }) {
  const wrongQueueSize = useMemo(() => {
    return Object.entries(progress.questions).filter(([, p]) => {
      const latestWrong = (p.wrongCount || 0) > (p.correctCount || 0);
      return latestWrong || ((p.wrongCount || 0) > 0 && (p.correctCount || 0) < 2);
    }).length;
  }, [progress]);

  const overallAccuracy = progress.totalAnswered > 0
    ? Math.round((progress.totalCorrect / progress.totalAnswered) * 100)
    : null;

  return (
    <div className="container-max fade-in">
      <section style={{ marginBottom: 48 }}>
        <p style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.224px', color: 'var(--text-dim)', margin: '0 0 14px' }}>
          2020 Scrum Guide · {QUESTIONS.length} questions · {CONCEPTS.length} concepts
        </p>
        <h1 className="display" style={{ fontSize: 'clamp(36px, 6vw, 56px)', lineHeight: 1.07, margin: '0 0 18px', fontWeight: 600, letterSpacing: '-0.022em' }}>
          Master PSPO I
        </h1>
        <p style={{ fontSize: 21, fontWeight: 400, letterSpacing: '-0.231px', color: 'var(--text-dim)', maxWidth: 600, margin: 0, lineHeight: 1.43 }}>
          A focused study engine for the PSPO I exam. Concept lessons, distractor-level feedback on wrong answers, and spaced review of what you miss.
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 32, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn primary" onClick={onStartQuick}>Quick quiz · 10 random</button>
          <button className="btn secondary" onClick={onStartMock}>
            Mock exam · 80 Qs · 60 min
          </button>
          {wrongQueueSize > 0 && (
            <button className="btn" onClick={onStartReview}>
              Review queue · <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{wrongQueueSize}</span>
            </button>
          )}
          {overallAccuracy !== null && (
            <div style={{ fontSize: 14, letterSpacing: '-0.224px', color: 'var(--text-dim)', marginLeft: 'auto' }}>
              Overall accuracy · <span className="numeric" style={{ color: 'var(--text)', fontWeight: 600 }}>{overallAccuracy}%</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-faint)', marginTop: 16, maxWidth: 560, lineHeight: 1.5, letterSpacing: '-0.156px' }}>
          The mock exam simulates real PSPO I conditions: 80 questions in 60 minutes, no feedback until the end, 85% to pass (68/80). Best used after you've worked through the concept lessons.
        </p>
      </section>

      <div className="rule" style={{ margin: '32px 0 32px' }} />

      <section aria-labelledby="concepts-heading">
        <h2 id="concepts-heading" className="display" style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.022em', margin: '0 0 20px' }}>
          Concepts
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {CONCEPTS.map((c, i) => {
            const m = masteryForConcept(progress, c.id);
            const masteryColor =
              m.level === 'mastered' ? 'var(--correct)' :
              m.level === 'practicing' ? 'var(--accent)' :
              m.level === 'learning' ? 'var(--accent-dim)' :
              'var(--border-hi)';
            return (
              <button
                key={c.id}
                className="concept-card"
                style={{ '--mastery-color': masteryColor }}
                onClick={() => onPickConcept(c.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.12px', color: 'var(--text-faint)' }}>
                    {c.optional ? 'Extra' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: '-0.12px', color: masteryColor, textTransform: 'capitalize' }}>
                    {m.level}
                  </span>
                </div>
                <div className="display" style={{ fontSize: 21, fontWeight: 600, marginBottom: 4, letterSpacing: '-0.022em', display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span>{c.label}</span>
                  {c.optional && (
                    <span className="chip accent" style={{
                      fontSize: 11, padding: '2px 8px', letterSpacing: '-0.12px', textTransform: 'none',
                    }}>Optional</span>
                  )}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 16, lineHeight: 1.4, letterSpacing: '-0.224px' }}>
                  {c.subtitle}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MasteryDots coverage={m.coverage} questionCount={m.questionCount} />
                  <span className="numeric" style={{
                    fontSize: 13, letterSpacing: '-0.156px',
                    color: m.uniqueCorrect === m.questionCount && m.questionCount > 0 ? 'var(--correct)' : 'var(--text-dim)',
                  }}>
                    <span style={{ color: m.uniqueCorrect > 0 ? 'var(--text)' : 'var(--text-faint)', fontWeight: 600 }}>{m.uniqueCorrect}</span>
                    {' / '}{m.questionCount} correct
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rule" style={{ margin: '48px 0 24px' }} />
      <footer>
        <p style={{ fontSize: 12, lineHeight: 1.5, color: 'var(--text-faint)', maxWidth: 720, margin: 0, letterSpacing: '-0.12px' }}>
          PSPO·I Trainer is an independent study tool not affiliated with, endorsed by, or officially associated with Scrum.org or any of its subsidiaries. Use of this application does not guarantee success on the Professional Scrum Product Owner I (PSPO I) assessment, nor does it confer any certification or credential. The PSPO I is an official Scrum.org assessment — candidates are encouraged to study the 2020 Scrum Guide and consult all official learning resources available at{' '}
          <span style={{ color: 'var(--text-dim)' }}>scrum.org</span> before attempting the assessment.
        </p>
      </footer>
    </div>
  );
}
