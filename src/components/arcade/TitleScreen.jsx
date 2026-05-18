import React, { useState } from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { masteryForConcept } from '../../lib/progress.js';
import { overallProgress } from '../../lib/quiz.js';
import { Mascot } from './Mascot.jsx';
import { AchievementIcon } from './AchievementIcon.jsx';

export function TitleScreen({ progress, onStart, onToggleTheme }) {
  const conceptStats = CONCEPTS.map((c) => ({ id: c.id, optional: !!c.optional, m: masteryForConcept(progress, c.id) }));
  const { total: totalPct, maxTotal } = overallProgress(progress);
  // Required-only count for the "STAGES" tile
  const requiredStats = conceptStats.filter((c) => !c.optional);
  const totalCleared = requiredStats.filter((c) => c.m.level === 'mastered').length;

  const allCleared = requiredStats.every((c) => c.m.level === 'mastered');
  const flawless = (() => {
    try { return JSON.parse(localStorage.getItem('pspo_flawless') || 'false'); } catch { return false; }
  })();

  return (
    <div className="arc-scan-in" style={{ textAlign: 'center', padding: '4px 0' }}>
      {/* Marquee */}
      <div style={{
        position: 'relative',
        border: '2px solid var(--g3)',
        background: 'linear-gradient(180deg, #001a00 0%, #000800 100%)',
        padding: '14px 8px 12px',
        marginBottom: 12,
        boxShadow: 'inset 0 0 16px rgba(0,255,65,0.18), 0 0 14px rgba(0,255,65,0.2)',
      }}>
        {[
          { top: -2, left: -2, bb: 'none', br: 'none' },
          { top: -2, right: -2, bb: 'none', bl: 'none' },
          { bottom: -2, left: -2, bt: 'none', br: 'none' },
          { bottom: -2, right: -2, bt: 'none', bl: 'none' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', width: 10, height: 10,
            borderTop: s.bt || '2px solid var(--g4)',
            borderBottom: s.bb || '2px solid var(--g4)',
            borderLeft: s.bl || '2px solid var(--g4)',
            borderRight: s.br || '2px solid var(--g4)',
            top: s.top, bottom: s.bottom, left: s.left, right: s.right,
          }} />
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 6, letterSpacing: 1, marginBottom: 10, padding: '0 2px' }}>
          <span style={{ color: 'var(--g3)' }}>1P</span>
          <span style={{ color: 'var(--gold)' }}>● ● ●</span>
          <span style={{ color: 'var(--gold)' }}>HI {totalPct}%</span>
        </div>

        <h1 className="arc-glitch" style={{
          fontSize: 34, letterSpacing: 6, color: 'var(--g4)',
          textShadow: '0 0 4px #00ff41, 0 0 12px #00ff41, 0 0 24px rgba(0,255,65,0.6), 0 4px 0 #003300',
          margin: '0 0 2px', lineHeight: 1, fontWeight: 400,
        }}>
          <span aria-hidden="true">P5P0 I</span>
          <span className="sr-only">PSPO·I Trainer</span>
        </h1>
        <div aria-hidden="true" style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: 8, marginBottom: 12, textShadow: '0 0 6px rgba(255,176,0,0.5)' }}>★ TRAINER ★</div>

        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 8 }}>
          <div style={{
            position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
            width: 88, height: 4,
            background: 'linear-gradient(90deg, transparent 0%, var(--g3) 20%, var(--g4) 50%, var(--g3) 80%, transparent 100%)',
            opacity: 0.6,
          }} />
          <div style={{
            position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)',
            width: 72, height: 2, background: 'var(--g2)', opacity: 0.4,
          }} />
          <div className="arc-bounce" style={{ display: 'inline-block', position: 'relative' }}>
            <Mascot size={104} />
          </div>
        </div>

        <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2, marginTop: 14 }}>
          ▸ SCRUM PRODUCT OWNER ◂
        </div>
      </div>

      {/* Primary CTAs — Start + Switch Style. Sized as the dominant element on the screen.
          minmax(220px,1fr) is wide enough for both labels to fit on one line at the chosen
          font size, so no awkward wrapping. */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 10,
        marginBottom: 8,
        marginTop: 4,
      }}>
        <button className="arc-btn" style={{
          fontFamily: 'Press Start 2P, monospace',
          fontSize: 14, padding: '22px 18px', letterSpacing: 4,
          background: 'var(--g4)', color: '#000',
          boxShadow: '0 0 22px rgba(0,255,65,0.7), inset 0 0 0 3px #00ff41',
          minHeight: 72,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          whiteSpace: 'nowrap',
          textTransform: 'uppercase',
        }} onClick={onStart}>
          <span style={{ fontSize: 16 }}>▶</span>
          <span>START</span>
        </button>
        <button
          onClick={onToggleTheme}
          className="arc-classic-cta"
          title="Switch to classic theme"
          style={{
            fontFamily: 'Press Start 2P, monospace',
            fontSize: 14, padding: '22px 18px', letterSpacing: 4,
            background: '#000', color: 'var(--gold)',
            border: '3px solid var(--gold)',
            cursor: 'pointer',
            boxShadow: '0 0 18px rgba(255,176,0,0.5), inset 0 0 12px rgba(255,176,0,0.2)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            textTransform: 'uppercase', whiteSpace: 'nowrap',
            minHeight: 72,
          }}>
          <span className="arc-classic-cta-icon" style={{ fontSize: 16 }}>◐</span>
          <span>CLASSIC</span>
        </button>
      </div>
      <div className="arc-blink" style={{ fontSize: 7, color: 'var(--gold)', letterSpacing: 2, marginBottom: 14 }}>
        ▸ INSERT COIN ◂
      </div>

      {/* Mission Log */}
      <section
        className="pbox"
        aria-labelledby="mission-log-heading"
        style={{ textAlign: 'left', marginBottom: 12, background: 'rgba(0,30,0,0.4)', position: 'relative' }}
      >
        <h2
          id="mission-log-heading"
          style={{
            position: 'absolute', top: -9, left: 12,
            background: '#000', padding: '0 8px',
            fontSize: 7, color: 'var(--g4)', letterSpacing: 2,
            margin: 0, fontWeight: 400,
          }}
        >● MISSION LOG</h2>

        <div style={{
          display: 'flex', justifyContent: 'space-around', marginTop: 4, marginBottom: 12,
          padding: '8px 0', borderBottom: '1px dashed var(--g2)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--g3)', marginBottom: 4, letterSpacing: 1 }}>STAGES</div>
            <div style={{ fontSize: 14, color: 'var(--gold)' }}>{totalCleared}<span style={{ color: 'var(--g2)', fontSize: 9 }}>/{requiredStats.length}</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--g3)', marginBottom: 4, letterSpacing: 1 }}>PROGRESS</div>
            <div style={{ fontSize: 14, color: 'var(--gold)' }}>{totalPct}<span style={{ color: 'var(--g2)', fontSize: 9 }}>%</span></div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--g3)', marginBottom: 4, letterSpacing: 1 }}>TROPHIES</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 2 }}>
              <AchievementIcon icon="🎓" title="MOCK COMPLETE" hint="Master all 10 concepts." unlocked={allCleared} />
              <AchievementIcon icon="⚡" title="FLAWLESS VICTORY" hint="Complete any quiz without missing a single question." unlocked={flawless} />
            </div>
          </div>
        </div>

        <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 8 }}>
          STAGE PROGRESS · {totalPct}% / {maxTotal}%
        </div>
        {CONCEPTS.map((c) => {
          const m = masteryForConcept(progress, c.id);
          const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
          const cleared = m.level === 'mastered';
          return (
            <div key={c.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3, gap: 6 }}>
                <div style={{ fontSize: 7, color: cleared ? 'var(--g4)' : 'var(--g3)', letterSpacing: 0.5, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span>{cleared ? '★ ' : '• '}{c.label.toUpperCase()}</span>
                  {c.optional && (
                    <span style={{ fontSize: 5, color: 'var(--magenta)', letterSpacing: 1, padding: '1px 4px', border: '1px solid var(--magenta)' }}>+EXTRA</span>
                  )}
                </div>
                <div style={{ fontSize: 6, color: 'var(--g2)' }}>{pct}%</div>
              </div>
              <div
                className="pbar-wrap"
                role="progressbar"
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${c.label} mastery, ${pct} percent`}
                style={{ height: 5 }}
              >
                <div className="pbar-fill" style={{ width: `${pct}%`, height: '100%', background: c.optional ? 'var(--magenta)' : 'var(--g4)' }} />
              </div>
            </div>
          );
        })}
      </section>

      <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed var(--g2)', textAlign: 'left' }}>
        <div style={{ fontSize: 8, color: 'var(--g4)', letterSpacing: 2, marginBottom: 10 }}>DISCLAIMER</div>
        <div style={{ fontSize: 7, color: 'var(--g2)', lineHeight: 1.9 }}>
          PSPO·I Trainer is an independent study tool not affiliated with,
          endorsed by, or officially associated with Scrum.org or any of its
          subsidiaries. Use of this application does not guarantee success on
          the Professional Scrum Product Owner I (PSPO I) assessment, nor does
          it confer any certification or credential.
        </div>
        <nav
          aria-label="Legal"
          style={{
            marginTop: 12,
            display: 'flex',
            gap: 14,
            flexWrap: 'wrap',
            fontSize: 7,
            letterSpacing: 2,
          }}
        >
          <a href="/privacy.html" style={{ color: 'var(--g4)', textDecoration: 'none' }}>PRIVACY</a>
          <a href="/terms.html" style={{ color: 'var(--g4)', textDecoration: 'none' }}>TERMS</a>
          <a href="/cookies.html" style={{ color: 'var(--g4)', textDecoration: 'none' }}>COOKIES</a>
          <a href="mailto:ahmedsalemdigital@gmail.com" style={{ color: 'var(--g4)', textDecoration: 'none' }}>CONTACT</a>
        </nav>
        <div style={{ fontSize: 6, color: 'var(--g2)', letterSpacing: 2, marginTop: 14, textAlign: 'center' }}>
          © 2026 · 2020 SCRUM GUIDE
        </div>
      </div>
    </div>
  );
}
