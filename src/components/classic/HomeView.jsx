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
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 16 }}>
          2020 Scrum Guide · {QUESTIONS.length} questions · {CONCEPTS.length} concepts
        </div>
        <h1 className="display" style={{ fontSize: 'clamp(34px, 6vw, 52px)', lineHeight: 1.05, margin: '0 0 20px', fontWeight: 500, letterSpacing: '-0.02em' }}>
          Master PSPO I
        </h1>
        <p className="dim" style={{ fontSize: 17, maxWidth: 560, margin: 0, lineHeight: 1.55 }}>
          A focused study engine for the PSPO I exam. Concept lessons, distractor-level feedback on wrong answers, and spaced review of what you miss.
        </p>

        <div style={{ display: 'flex', gap: 12, marginTop: 32, flexWrap: 'wrap' }}>
          <button className="btn primary" onClick={onStartQuick}>Quick Quiz · 10 random</button>
          <button className="btn" onClick={onStartMock} style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
            ◉ Mock Exam · 80 Qs · 60 min
          </button>
          {wrongQueueSize > 0 && (
            <button className="btn" onClick={onStartReview}>
              Review Queue · <span style={{ color: 'var(--accent)' }}>{wrongQueueSize}</span>
            </button>
          )}
          {overallAccuracy !== null && (
            <div className="mono dim" style={{ fontSize: 11, alignSelf: 'center', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
              Overall accuracy · <span className="numeric" style={{ color: 'var(--text)' }}>{overallAccuracy}%</span>
            </div>
          )}
        </div>
        <p className="mono faint" style={{ fontSize: 10, letterSpacing: '0.12em', marginTop: 14, maxWidth: 540, lineHeight: 1.5 }}>
          MOCK EXAM simulates the real PSPO I conditions: 80 questions in 60 minutes, no feedback until the end, 85% to pass (68/80). Best used after you've worked through the concept lessons and feel ready to pressure-test yourself.
        </p>
      </section>

      <div className="rule" style={{ margin: '32px 0 40px' }} />

      <section>
        <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 20 }}>Concepts</div>
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <span className="mono faint" style={{ fontSize: 10, letterSpacing: '0.16em' }}>
                    {c.optional ? '+ EXTRA' : String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.12em', color: masteryColor }}>
                    {m.level}
                  </span>
                </div>
                <div className="display" style={{ fontSize: 20, fontWeight: 500, marginBottom: 4, letterSpacing: '-0.01em', display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span>{c.label}</span>
                  {c.optional && (
                    <span className="mono" style={{
                      fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase',
                      color: 'var(--accent)', padding: '2px 6px',
                      border: '1px solid var(--accent-dim)', borderRadius: 3,
                    }}>Optional</span>
                  )}
                </div>
                <div className="dim" style={{ fontSize: 13, marginBottom: 14 }}>
                  {c.subtitle}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <MasteryDots coverage={m.coverage} questionCount={m.questionCount} />
                  <span className="mono" style={{
                    fontSize: 10, letterSpacing: '0.1em',
                    color: m.uniqueCorrect === m.questionCount && m.questionCount > 0 ? 'var(--correct)' : m.uniqueCorrect > 0 ? 'var(--text-dim)' : 'var(--text-faint)',
                  }}>
                    <span style={{ color: m.uniqueCorrect > 0 ? 'var(--text)' : undefined }}>{m.uniqueCorrect}</span>
                    {' / '}{m.questionCount} correct
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="rule" style={{ margin: '48px 0 24px' }} />
      <p className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>Disclaimer</p>
      <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--text-faint)', maxWidth: 640, margin: 0 }}>
        PSPO·I Trainer is an independent study tool not affiliated with, endorsed by, or officially associated with Scrum.org or any of its subsidiaries. Use of this application does not guarantee success on the Professional Scrum Product Owner I (PSPO I) assessment, nor does it confer any certification or credential. The PSPO I is an official Scrum.org assessment — candidates are encouraged to study the 2020 Scrum Guide and consult all official learning resources available at{' '}
        <span style={{ color: 'var(--text-dim)' }}>scrum.org</span> before attempting the assessment.
      </p>
    </div>
  );
}
