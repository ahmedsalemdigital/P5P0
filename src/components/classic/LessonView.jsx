import React from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { LESSONS } from '../../data/lessons.js';
import { QUESTIONS } from '../../data/questions.js';

export function LessonView({ conceptId, onStart, onBack }) {
  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const lesson = LESSONS[conceptId];
  const questionCount = QUESTIONS.filter((q) => q.concept === conceptId).length;

  return (
    <div className="container-max fade-in">
      <button className="btn ghost" onClick={onBack} style={{ marginBottom: 24 }}>← Back</button>

      <div className="mono faint" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12 }}>
        Lesson · {concept.subtitle}
      </div>
      <h1 className="display" style={{ fontSize: 'clamp(32px, 5vw, 44px)', lineHeight: 1.1, margin: '0 0 28px', fontWeight: 500, letterSpacing: '-0.02em' }}>
        {concept.label}
      </h1>

      {/* Opening framing */}
      {lesson.intro && (
        <div className="display" style={{ fontSize: 18, lineHeight: 1.6, margin: '0 0 36px', color: 'var(--text)', fontWeight: 400, maxWidth: 680 }}>
          {lesson.intro}
        </div>
      )}

      {/* Visual diagram (if present) */}
      {lesson.visual && (
        <div style={{ margin: '0 0 40px', padding: '28px 20px', background: 'var(--surface)', border: '1px solid var(--border)', textAlign: 'center' }}
             dangerouslySetInnerHTML={{ __html: lesson.visual }} />
      )}

      {/* Teaching sections */}
      {lesson.sections && lesson.sections.map((s, i) => (
        <section key={i} style={{ marginBottom: 40 }}>
          <div className="mono accent" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 10 }}>
            § {String(i + 1).padStart(2, '0')}
          </div>
          <h2 className="display" style={{ fontSize: 24, fontWeight: 500, margin: '0 0 16px', letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {s.heading}
          </h2>
          <div style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--text)', whiteSpace: 'pre-wrap', maxWidth: 680 }}>
            {s.body}
          </div>
          {s.example && (
            <div style={{ marginTop: 20, padding: '18px 22px', background: 'var(--accent-soft)', borderLeft: '3px solid var(--accent)', maxWidth: 680 }}>
              <div className="mono accent" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 8 }}>
                Example · {s.example.title}
              </div>
              <div style={{ fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                {s.example.body}
              </div>
            </div>
          )}
        </section>
      ))}

      {/* Mnemonics */}
      {lesson.mnemonics && lesson.mnemonics.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>
            Mnemonics
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {lesson.mnemonics.map((m, i) => (
              <div key={i} style={{ padding: '16px 18px', border: '1px solid var(--border)', background: 'var(--surface)' }}>
                <div className="mono accent" style={{ fontSize: 13, letterSpacing: '0.08em', marginBottom: 6, fontWeight: 600 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--text-dim)' }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tips */}
      {lesson.tips && lesson.tips.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14, color: 'var(--accent)' }}>
            ✦ Exam tips
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lesson.tips.map((t, i) => (
              <li key={i} style={{ display: 'flex', gap: 14, paddingLeft: 4 }}>
                <span className="accent" style={{ fontSize: 13, paddingTop: 2 }}>→</span>
                <span style={{ lineHeight: 1.6, fontSize: 14 }}>{t}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="rule" style={{ margin: '8px 0 32px' }} />

      {/* Key points — condensed summary */}
      <section style={{ marginBottom: 32 }}>
        <div className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14 }}>Key points to remember</div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.keyPoints.map((pt, i) => (
            <li key={i} style={{ display: 'flex', gap: 14, paddingLeft: 4 }}>
              <span className="mono faint" style={{ fontSize: 11, paddingTop: 3, letterSpacing: '0.08em' }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ lineHeight: 1.55, fontSize: 14 }}>{pt}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Traps */}
      <section style={{ marginBottom: 32 }}>
        <div className="mono" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: 14, color: 'var(--wrong)' }}>⚠ Exam traps</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.traps.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                borderLeft: '2px solid var(--wrong)',
                background: 'var(--wrong-soft)',
                fontSize: 14,
                lineHeight: 1.55,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </section>

      <div className="rule" style={{ margin: '8px 0 24px' }} />

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn primary" onClick={onStart}>Start Quiz · {questionCount} Qs →</button>
        <span className="mono faint" style={{ fontSize: 11, letterSpacing: '0.1em' }}>
          You can leave any time — progress is saved
        </span>
      </div>
    </div>
  );
}
