import React, { useState, useEffect, useRef } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { LESSONS } from '../../data/lessons.js';
import { Mascot } from './Mascot.jsx';

export function LessonScreen({ conceptId, onStartQuiz, onBack }) {
  const [tab, setTab] = useState(0);
  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const conceptIdx = CONCEPTS.findIndex((c) => c.id === conceptId);
  const lesson = LESSONS[conceptId] || {};
  const tabs = [
    { label: 'INTRO',   icon: '▤', color: 'var(--g4)' },
    { label: 'KEY PTS', icon: '▸', color: 'var(--cyan)' },
    { label: 'TIPS',    icon: '!', color: 'var(--gold)' },
    { label: 'TRAPS',   icon: '✕', color: 'var(--red)' },
  ];
  const activeColor = tabs[tab].color;
  const scrollRef = useRef(null);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [tab]);

  const intro = lesson.intro || lesson.summary || '';
  const sections = lesson.sections || [];
  const visual = lesson.visual || '';
  const keyPoints = lesson.keyPoints || lesson.points || [];
  const tips = lesson.tips || [];
  const traps = lesson.traps || [];
  const mnemonics = lesson.mnemonics || [];

  return (
    <div className="arc-scan-in">
      {/* Top nav */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onBack}>◀</button>
        <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2 }}>STAGE BRIEFING</div>
      </div>

      {/* Stage banner */}
      <div style={{
        position: 'relative',
        border: '2px solid var(--g3)',
        background: 'linear-gradient(180deg, #001a00 0%, #000800 100%)',
        padding: '14px 14px 12px',
        marginBottom: 14,
        boxShadow: 'inset 0 0 14px rgba(0,255,65,0.15), 0 0 10px rgba(0,255,65,0.15)',
        display: 'flex', alignItems: 'center', gap: 14,
      }}>
        {[
          { top: -2, left: -2, br: 'none', bb: 'none' },
          { top: -2, right: -2, bl: 'none', bb: 'none' },
          { bottom: -2, left: -2, br: 'none', bt: 'none' },
          { bottom: -2, right: -2, bl: 'none', bt: 'none' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: 8, height: 8,
            borderTop: s.bt || '2px solid var(--gold)',
            borderBottom: s.bb || '2px solid var(--gold)',
            borderLeft: s.bl || '2px solid var(--gold)',
            borderRight: s.br || '2px solid var(--gold)',
            top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          }} />
        ))}
        <div style={{
          fontSize: 28, color: 'var(--gold)', letterSpacing: 2,
          textShadow: '0 0 8px rgba(255,176,0,0.6), 0 4px 0 rgba(0,0,0,0.6)',
          flexShrink: 0,
        }}>{String(conceptIdx + 1).padStart(2, '0')}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 5, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 4 }}>NOW LOADING</div>
          <div style={{ fontSize: 10, color: 'var(--g5)', letterSpacing: 1, marginBottom: 4, lineHeight: 1.3 }}>{concept.label.toUpperCase()}</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', lineHeight: 1.6 }}>{concept.subtitle}</div>
        </div>
        <div className="arc-bounce" style={{ flexShrink: 0 }}><Mascot size={42} talking /></div>
      </div>

      {/* Tab pills */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
        {tabs.map((t, i) => {
          const isActive = tab === i;
          return (
            <button key={t.label} onClick={() => setTab(i)}
              style={{
                font: 'inherit', fontSize: 7, padding: '8px 6px', cursor: 'pointer',
                border: '2px solid',
                borderColor: isActive ? t.color : 'var(--g2)',
                background: isActive ? t.color : 'transparent',
                color: isActive ? '#000' : t.color,
                flex: 1, letterSpacing: 1,
                boxShadow: isActive ? `0 0 8px ${t.color}` : 'none',
                transition: 'all 0.1s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
              }}>
              <span style={{ fontSize: 9 }}>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content panel */}
      <div style={{
        position: 'relative',
        border: `3px solid ${activeColor}`,
        padding: 14, marginBottom: 14,
        boxShadow: `0 0 12px ${activeColor === 'var(--g4)' ? 'rgba(0,255,65,0.18)' :
          activeColor === 'var(--cyan)' ? 'rgba(68,221,255,0.18)' :
            activeColor === 'var(--gold)' ? 'rgba(255,176,0,0.18)' :
              'rgba(255,58,58,0.18)'}, inset 0 0 18px rgba(0,0,0,0.6)`,
        background: 'rgba(0,12,0,0.4)',
      }}>
        <div style={{
          position: 'absolute', top: -9, left: 12,
          background: '#000', padding: '0 8px',
          fontSize: 7, color: activeColor, letterSpacing: 2,
        }}>● {tabs[tab].label}</div>

        <div ref={scrollRef} className="arc-content-scroll">
          {tab === 0 && (
            <>
              <div style={{ fontSize: 7, color: 'var(--gold)', letterSpacing: 2, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>▸ BRIEF</span>
                <span style={{ flex: 1, height: 1, background: 'var(--g2)' }} />
              </div>
              {intro.split('\n\n').map((para, i) => (
                <p key={i} style={{ fontSize: 9, color: 'var(--g5)', lineHeight: 2, marginBottom: 12 }}>{para}</p>
              ))}

              {visual && (
                <div style={{
                  margin: '14px 0',
                  padding: 10,
                  border: '1px solid var(--g2)',
                  background: 'rgba(0,30,0,0.25)',
                  color: 'var(--g4)',
                }}
                  dangerouslySetInnerHTML={{ __html: visual }}
                />
              )}

              {sections.length > 0 && (
                <>
                  <div style={{ fontSize: 7, color: 'var(--cyan)', letterSpacing: 2, margin: '18px 0 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>▸ DEEP DIVE</span>
                    <span style={{ flex: 1, height: 1, background: 'var(--g2)' }} />
                  </div>
                  {sections.map((s, i) => (
                    <div key={i} style={{ marginBottom: 16 }}>
                      <div style={{
                        fontSize: 9, color: 'var(--gold)', letterSpacing: 1,
                        marginBottom: 8, lineHeight: 1.4,
                        textShadow: '0 0 6px rgba(255,176,0,0.4)',
                      }}>
                        {String(i + 1).padStart(2, '0')} · {(s.heading || '').toUpperCase()}
                      </div>
                      {(s.body || '').split('\n\n').map((para, j) => (
                        <p key={j} style={{ fontSize: 9, color: 'var(--g5)', lineHeight: 2, marginBottom: 10 }}>
                          {para}
                        </p>
                      ))}
                      {s.example && (
                        <div style={{
                          marginTop: 8, padding: '10px 12px',
                          border: '1px solid var(--g2)',
                          borderLeft: '3px solid var(--cyan)',
                          background: 'rgba(0,30,40,0.35)',
                        }}>
                          <div style={{ fontSize: 7, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 6 }}>
                            ▸ EXAMPLE · {(s.example.title || '').toUpperCase()}
                          </div>
                          {(s.example.body || '').split('\n\n').map((para, k) => (
                            <p key={k} style={{ fontSize: 8, color: 'var(--g5)', lineHeight: 1.9, marginBottom: 8 }}>
                              {para}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </>
          )}

          {tab === 1 && (
            <>
              <div style={{ fontSize: 7, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 10 }}>
                ▸ ESSENTIALS · {keyPoints.length} POINTS
              </div>
              <ol style={{ listStyle: 'none', padding: 0 }}>
                {keyPoints.map((kp, i) => (
                  <li key={i} style={{
                    fontSize: 9, color: 'var(--g5)', marginBottom: 10, lineHeight: 1.8,
                    display: 'flex', gap: 10,
                    padding: '8px 10px',
                    border: '1px solid var(--g2)',
                    background: 'rgba(0,40,0,0.25)',
                  }}>
                    <span style={{ color: 'var(--cyan)', flexShrink: 0, fontSize: 8, minWidth: 18, textShadow: '0 0 6px rgba(68,221,255,0.5)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>{typeof kp === 'string' ? kp : kp.text || kp.point || JSON.stringify(kp)}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {tab === 2 && (
            <>
              <div style={{ fontSize: 7, color: 'var(--gold)', letterSpacing: 2, marginBottom: 10 }}>
                ★ POWER-UPS · EXAM TACTICS
              </div>
              {tips.map((tip, i) => (
                <div key={i} style={{
                  fontSize: 9, color: 'var(--g5)', marginBottom: 8, lineHeight: 1.8,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '8px 10px',
                  border: '1px solid var(--g2)',
                  borderLeft: '3px solid var(--gold)',
                  background: 'rgba(40,28,0,0.35)',
                }}>
                  <span style={{ color: 'var(--gold)', flexShrink: 0, fontSize: 10, textShadow: '0 0 8px rgba(255,176,0,0.6)' }}>!</span>
                  <span>{typeof tip === 'string' ? tip : tip.text || JSON.stringify(tip)}</span>
                </div>
              ))}
            </>
          )}

          {tab === 3 && (
            <>
              <div style={{ fontSize: 7, color: 'var(--red)', letterSpacing: 2, marginBottom: 10, textShadow: '0 0 6px rgba(255,58,58,0.5)' }}>
                ⚠ DANGER ZONE · COMMON TRAPS
              </div>
              {traps.map((t, i) => (
                <div key={i} style={{
                  fontSize: 9, color: '#ffbbbb', marginBottom: 8, lineHeight: 1.8,
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '8px 10px',
                  border: '1px solid rgba(255,58,58,0.3)',
                  borderLeft: '3px solid var(--red)',
                  background: 'rgba(40,0,0,0.35)',
                }}>
                  <span style={{ color: 'var(--red)', flexShrink: 0, fontSize: 10, textShadow: '0 0 8px rgba(255,58,58,0.6)' }}>✕</span>
                  <span>{typeof t === 'string' ? t : t.text || JSON.stringify(t)}</span>
                </div>
              ))}

              {mnemonics && mnemonics.length > 0 && (
                <>
                  <div style={{ fontSize: 7, color: 'var(--magenta)', letterSpacing: 2, marginTop: 18, marginBottom: 10, textShadow: '0 0 6px rgba(255,68,170,0.5)' }}>
                    ★ MNEMONICS · MEMORY HACKS
                  </div>
                  {mnemonics.map((m, i) => (
                    <div key={i} style={{
                      marginBottom: 8, padding: 10,
                      border: '2px solid var(--magenta)',
                      background: 'rgba(40,0,30,0.3)',
                      position: 'relative',
                      boxShadow: 'inset 0 0 10px rgba(255,68,170,0.1)',
                    }}>
                      <div style={{ fontSize: 10, color: 'var(--magenta)', marginBottom: 6, letterSpacing: 1, textShadow: '0 0 6px rgba(255,68,170,0.4)' }}>
                        {m.label || m.title || '★'}
                      </div>
                      <div style={{ fontSize: 8, color: 'var(--g5)', lineHeight: 1.9 }}>
                        {m.text || m.body || (typeof m === 'string' ? m : '')}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
        {tabs.map((t, i) => (
          <div key={t.label} style={{
            width: 8, height: 8,
            background: i === tab ? t.color : 'var(--g2)',
            boxShadow: i === tab ? `0 0 6px ${t.color}` : 'none',
            transition: 'all 0.15s',
          }} />
        ))}
      </div>

      <button className="arc-btn" style={{
        width: '100%', padding: 16, fontSize: 10, letterSpacing: 3,
        boxShadow: '0 0 16px rgba(0,255,65,0.5), inset 0 0 0 2px #00ff41',
      }} onClick={onStartQuiz}>
        ▶ START QUIZ
      </button>
    </div>
  );
}
