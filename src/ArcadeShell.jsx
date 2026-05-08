import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CONCEPTS, LESSONS, QUESTIONS, masteryForConcept, arraysEqualAsSet, defangBrutalQuestion } from './App.jsx';

/* ──────────────────────────────────────────────────────────────────────────
   ARCADE STYLE
   ────────────────────────────────────────────────────────────────────────── */

export const ARCADE_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');

.arcade-root {
  --g0:#000000; --g1:#003300; --g2:#006600;
  --g3:#00aa00; --g4:#00ff41; --g5:#ccffdd;
  --red:#ff3a3a; --gold:#ffb000; --amber:#ff9933;
  --cyan:#44ddff; --magenta:#ff44aa; --purple:#b066ff;
  background: radial-gradient(ellipse 90% 95% at center, #000 60%, #050505 100%) #000;
  color: var(--g4);
  font-family: 'Press Start 2P', monospace;
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}
.arcade-root *, .arcade-root *::before, .arcade-root *::after {
  box-sizing: border-box;
}
.arcade-root button { font-family: inherit; }

/* CRT scanlines */
.arcade-root::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px,
    transparent 1px, transparent 2px);
}
/* CRT vignette + flicker */
.arcade-root::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1001;
  background: radial-gradient(ellipse at center,
    transparent 35%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0.7) 100%);
  box-shadow: inset 0 0 120px rgba(0,255,65,0.08);
  animation: arcadeFlicker 6s infinite;
}
@keyframes arcadeFlicker {
  0%, 92%, 100% { opacity: 1; }
  93% { opacity: 0.85; }
  94% { opacity: 1; }
  96% { opacity: 0.92; }
}
/* Slow rolling scanline band */
.arcade-scanline {
  content: ''; position: fixed; left: 0; right: 0; height: 80px;
  pointer-events: none; z-index: 1000;
  background: linear-gradient(180deg, transparent, rgba(0,255,65,0.06), transparent);
  animation: arcadeRoll 7s linear infinite;
}
@keyframes arcadeRoll {
  from { top: -100px; }
  to   { top: 100%; }
}
/* CRT jitter on the content */
.arcade-stage {
  filter: contrast(1.06) brightness(1.02);
  animation: arcadeJitter 9s infinite;
}
@keyframes arcadeJitter {
  0%, 97%, 100% { transform: translate(0,0); filter: contrast(1.06) brightness(1.02); }
  97.5% { transform: translate(-1px, 0); filter: contrast(1.2) brightness(1.1) hue-rotate(2deg); }
  98%   { transform: translate(2px, 0); }
  98.5% { transform: translate(-1px, 1px); }
}

/* Animations */
@keyframes arcBlink    { 0%,49%{opacity:1} 50%,100%{opacity:0} }
@keyframes arcBounce   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
@keyframes arcGlitch   { 0%,96%{transform:none;text-shadow:0 0 8px var(--g4)} 97%{transform:translateX(2px);text-shadow:-2px 0 var(--magenta)} 98%{transform:translateX(-2px);text-shadow:2px 0 var(--cyan)} 99%{transform:none} }
@keyframes arcScanIn   { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
.arc-blink   { animation: arcBlink 1s step-end infinite; }
.arc-bounce  { animation: arcBounce 1.4s ease-in-out infinite; }
.arc-glitch  { animation: arcGlitch 4s infinite; }
.arc-scan-in { animation: arcScanIn 0.2s ease-out both; }

/* Frame box */
.arcade-root .pbox {
  border: 3px solid var(--g4); padding: 14px; position: relative;
  box-shadow: 0 0 10px rgba(0,255,65,0.25), inset 0 0 20px rgba(0,0,0,0.6);
}
.arcade-root .pbox::before {
  content: ''; position: absolute; inset: 2px;
  border: 1px solid var(--g1); pointer-events: none;
}

/* Buttons */
.arcade-root .arc-btn {
  font-family: 'Press Start 2P', monospace; font-size: 9px;
  color: #000; background: var(--g4); border: none;
  padding: 10px 16px; cursor: pointer;
  outline: 3px solid var(--g2); outline-offset: 2px;
  transition: transform 0.08s, background 0.08s;
  text-transform: uppercase; letter-spacing: 1px;
}
.arcade-root .arc-btn:hover:not(:disabled) { background: var(--g5); transform: translateY(-2px); }
.arcade-root .arc-btn:active:not(:disabled) { transform: translateY(1px); }
.arcade-root .arc-btn:disabled { opacity: 0.4; cursor: default; }
.arcade-root .arc-btn-ghost {
  background: transparent; color: var(--g4); border: 2px solid var(--g4); outline: none;
}
.arcade-root .arc-btn-ghost:hover { background: var(--g1); }
.arcade-root .arc-btn-sm { font-size: 7px; padding: 7px 12px; }

/* Progress bars */
.arcade-root .pbar-wrap { height: 10px; background: var(--g1); border: 2px solid var(--g3); }
.arcade-root .pbar-fill { height: 100%; background: var(--g4); transition: width 0.4s; box-shadow: 0 0 6px var(--g4); }

/* Option buttons */
.arcade-root .opt-btn {
  display: block; width: 100%;
  font-family: 'Press Start 2P', monospace; font-size: 8px; line-height: 1.8;
  text-align: left; background: transparent; color: var(--g4);
  border: 2px solid var(--g2); padding: 10px 12px;
  cursor: pointer; margin-bottom: 6px; transition: border-color 0.1s, background 0.1s;
}
.arcade-root .opt-btn:hover:not(:disabled) { border-color: var(--g4); background: var(--g1); }
.arcade-root .opt-btn.selected { border-color: var(--g4); background: var(--g1); }
.arcade-root .opt-btn.correct  { border-color: var(--g4); background: var(--g4); color: #000; }
.arcade-root .opt-btn.wrong    { border-color: var(--red); background: rgba(255,58,58,0.12); color: var(--red); }
.arcade-root .opt-btn:disabled { cursor: default; }

.arcade-root .arc-divider { border: none; border-top: 2px solid var(--g2); margin: 12px 0; }

/* Inner scroll panel inside lesson */
.arcade-root .arc-content-scroll {
  max-height: 60vh; overflow-y: auto; padding-right: 8px;
  scrollbar-width: thin; scrollbar-color: var(--g3) var(--g1);
}
.arcade-root .arc-content-scroll::-webkit-scrollbar { width: 6px; }
.arcade-root .arc-content-scroll::-webkit-scrollbar-track { background: var(--g1); }
.arcade-root .arc-content-scroll::-webkit-scrollbar-thumb { background: var(--g3); }

/* SVG text shouldn't inherit the arcade pixel font — it's far too wide and overlaps */
.arcade-root svg text { font-family: 'JetBrains Mono', monospace; }

/* Responsive container — pixel-perfect base, scales up on bigger screens */
.arcade-stage {
  max-width: 460px;
  margin: 0 auto;
  padding: 16px 12px 60px;
  position: relative;
  z-index: 2;
}
@media (max-width: 480px) {
  .arcade-stage { padding: 12px 10px 48px; }
}
@media (min-width: 768px) {
  .arcade-stage { zoom: 1.2; }
}
@media (min-width: 1024px) {
  .arcade-stage { zoom: 1.4; }
}
@media (min-width: 1440px) {
  .arcade-stage { zoom: 1.6; }
}
@media (min-width: 1920px) {
  .arcade-stage { zoom: 1.8; }
}
/* Firefox doesn't support zoom — fall back to transform scale */
@-moz-document url-prefix() {
  @media (min-width: 768px) {
    .arcade-stage { zoom: unset; transform: scale(1.2); transform-origin: top center; }
  }
  @media (min-width: 1024px) {
    .arcade-stage { transform: scale(1.4); }
  }
  @media (min-width: 1440px) {
    .arcade-stage { transform: scale(1.6); }
  }
  @media (min-width: 1920px) {
    .arcade-stage { transform: scale(1.8); }
  }
}

/* Theme toggle — pulsing arcade button */
.arcade-theme-toggle {
  position: fixed; top: 14px; right: 14px;
  z-index: 1100;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  padding: 9px 14px;
  background: #000;
  color: var(--gold);
  border: 2px solid var(--gold);
  cursor: pointer;
  letter-spacing: 2px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-shadow:
    0 0 0 0 rgba(255,176,0,0.6),
    inset 0 0 8px rgba(255,176,0,0.15);
  transition: transform 0.1s, background 0.12s;
  animation: arcadeTogglePulse 2s ease-in-out infinite;
}
.arcade-theme-toggle:hover {
  background: var(--gold);
  color: #000;
  transform: translateY(-1px);
}
.arcade-theme-toggle:active { transform: translateY(1px); }
.arcade-theme-toggle .theme-toggle-icon {
  display: inline-block;
  animation: arcadeToggleSpin 4s linear infinite, arcadeToggleGlitch 11s infinite;
}
@keyframes arcadeTogglePulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,176,0,0.6), inset 0 0 8px rgba(255,176,0,0.2); }
  50%      { box-shadow: 0 0 0 10px rgba(255,176,0,0), inset 0 0 8px rgba(255,176,0,0.2); }
}
@keyframes arcadeToggleSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Brief, rare CRT glitch — about 250ms every 11s */
@keyframes arcadeToggleGlitch {
  0%, 97%, 100% { text-shadow: none; filter: none; }
  97.5%         { text-shadow: 1px 0 rgba(255,68,170,0.55), -1px 0 rgba(68,221,255,0.55); filter: brightness(1.1); }
  98%           { text-shadow: -1px 0 rgba(255,68,170,0.55), 1px 0 rgba(68,221,255,0.55); }
  98.8%         { text-shadow: 1px 0 rgba(255,68,170,0.4), -1px 0 rgba(68,221,255,0.4); }
}
`;

/* ──────────────────────────────────────────────────────────────────────────
   MASCOT
   ────────────────────────────────────────────────────────────────────────── */

function Mascot({ size = 72, talking = false, happy = false, sad = false }) {
  const [blink, setBlink] = useState(false);
  useEffect(() => {
    const iv = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3200);
    return () => clearInterval(iv);
  }, []);
  const eyeColor = happy ? '#00ff41' : sad ? '#006600' : '#00ff41';
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" shapeRendering="crispEdges" style={{ imageRendering: 'pixelated', display: 'block' }}>
      <rect x="3" y="3" width="10" height="9" fill="#00aa00" />
      {!blink && <rect x="4" y="5" width="3" height="3" fill="#003300" />}
      {!blink && <rect x="9" y="5" width="3" height="3" fill="#003300" />}
      {!blink && <rect x="5" y="5" width="2" height="2" fill={eyeColor} />}
      {!blink && <rect x="10" y="5" width="2" height="2" fill={eyeColor} />}
      {blink && <rect x="4" y="6" width="3" height="1" fill="#003300" />}
      {blink && <rect x="9" y="6" width="3" height="1" fill="#003300" />}
      <rect x="4" y="12" width="8" height="4" fill="#004400" />
      <rect x="7" y="12" width="2" height="4" fill="#ccffdd" />
      <rect x="7" y="13" width="2" height="3" fill="#00ff41" />
      <rect x="7" y="13" width="1" height="1" fill="#ccffdd" />
      <rect x="5" y="12" width="2" height="2" fill="#ccffdd" />
      <rect x="4" y="12" width="2" height="3" fill="#004400" />
      <rect x="9" y="12" width="2" height="2" fill="#ccffdd" />
      <rect x="10" y="12" width="2" height="3" fill="#004400" />
      <rect x="2" y="12" width="2" height="3" fill="#004400" />
      <rect x="12" y="12" width="2" height="3" fill="#004400" />
      <rect x="2" y="14" width="2" height="1" fill="#ccffdd" />
      <rect x="12" y="14" width="2" height="1" fill="#ccffdd" />
      <rect x="5" y="15" width="2" height="1" fill="#002200" />
      <rect x="9" y="15" width="2" height="1" fill="#002200" />
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ACHIEVEMENT ICON
   ────────────────────────────────────────────────────────────────────────── */

function AchievementIcon({ icon, title, hint, unlocked }) {
  const [hovered, setHovered] = useState(false);
  const col = unlocked ? '#00aa00' : '#003300';
  return (
    <div
      style={{
        position: 'relative', display: 'inline-block', cursor: unlocked ? 'default' : 'help',
        animation: 'arcBounce 1.4s ease-in-out infinite',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg width="28" height="28" viewBox="0 0 11 11" shapeRendering="crispEdges"
        style={{ display: 'block', imageRendering: 'pixelated',
          filter: unlocked ? 'none' : 'brightness(0.35) grayscale(1)',
          boxShadow: unlocked ? '0 0 8px rgba(0,255,65,0.4)' : 'none' }}>
        <rect x="2" y="0" width="7" height="1" fill={col} />
        <rect x="1" y="1" width="9" height="1" fill={col} />
        <rect x="0" y="2" width="11" height="7" fill={col} />
        <rect x="1" y="9" width="9" height="1" fill={col} />
        <rect x="2" y="10" width="7" height="1" fill={col} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, lineHeight: 1, userSelect: 'none' }}>
        {unlocked ? icon : '🔒'}
      </div>
      {hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)',
          background: '#000', border: '2px solid var(--g3)', padding: '6px 8px', zIndex: 50,
          whiteSpace: 'nowrap', boxShadow: '0 0 10px rgba(0,255,65,0.3)', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 7, color: 'var(--g4)', marginBottom: 2, letterSpacing: 1 }}>
            {unlocked ? title : '???'}
          </div>
          <div style={{ fontSize: 6, color: 'var(--g3)', lineHeight: 1.7 }}>
            {unlocked ? title : hint}
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TITLE SCREEN
   ────────────────────────────────────────────────────────────────────────── */

function TitleScreen({ progress, onStart }) {
  const totalQuestions = QUESTIONS.length;
  const conceptStats = CONCEPTS.map((c) => ({ id: c.id, m: masteryForConcept(progress, c.id) }));
  const totalAsked = conceptStats.reduce((s, c) => s + Math.min(c.m.questionCount, c.m.uniqueCorrect), 0);
  const totalPct = totalQuestions ? Math.round((totalAsked / totalQuestions) * 100) : 0;
  const totalCleared = conceptStats.filter((c) => c.m.level === 'mastered').length;

  const allCleared = conceptStats.every((c) => c.m.level === 'mastered');
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

        <div className="arc-glitch" style={{
          fontSize: 34, letterSpacing: 6, color: 'var(--g4)',
          textShadow: '0 0 4px #00ff41, 0 0 12px #00ff41, 0 0 24px rgba(0,255,65,0.6), 0 4px 0 #003300',
          marginBottom: 2, lineHeight: 1,
        }}>P5P0</div>
        <div style={{ fontSize: 8, color: 'var(--gold)', letterSpacing: 8, marginBottom: 12, textShadow: '0 0 6px rgba(255,176,0,0.5)' }}>★ TRAINER ★</div>

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

      {/* Start button */}
      <button className="arc-btn" style={{
        fontSize: 12, padding: '14px 36px', letterSpacing: 4,
        background: 'var(--g4)', color: '#000',
        boxShadow: '0 0 16px rgba(0,255,65,0.6), inset 0 0 0 2px #00ff41',
        marginBottom: 6,
      }} onClick={onStart}>▶ PRESS START</button>
      <div className="arc-blink" style={{ fontSize: 7, color: 'var(--gold)', letterSpacing: 2, marginBottom: 14 }}>
        ▸ INSERT COIN ◂
      </div>

      {/* Mission Log */}
      <div className="pbox" style={{ textAlign: 'left', marginBottom: 12, background: 'rgba(0,30,0,0.4)', position: 'relative' }}>
        <div style={{
          position: 'absolute', top: -9, left: 12,
          background: '#000', padding: '0 8px',
          fontSize: 7, color: 'var(--g4)', letterSpacing: 2,
        }}>● MISSION LOG</div>

        <div style={{
          display: 'flex', justifyContent: 'space-around', marginTop: 4, marginBottom: 12,
          padding: '8px 0', borderBottom: '1px dashed var(--g2)',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 6, color: 'var(--g3)', marginBottom: 4, letterSpacing: 1 }}>STAGES</div>
            <div style={{ fontSize: 14, color: 'var(--gold)' }}>{totalCleared}<span style={{ color: 'var(--g2)', fontSize: 9 }}>/{CONCEPTS.length}</span></div>
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

        <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 8 }}>STAGE PROGRESS</div>
        {CONCEPTS.map((c) => {
          const m = masteryForConcept(progress, c.id);
          const pct = m.questionCount > 0 ? Math.round((m.uniqueCorrect / m.questionCount) * 100) : 0;
          const cleared = m.level === 'mastered';
          return (
            <div key={c.id} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 3 }}>
                <div style={{ fontSize: 7, color: cleared ? 'var(--g4)' : 'var(--g3)', letterSpacing: 0.5 }}>
                  {cleared ? '★ ' : '• '}{c.label.toUpperCase()}
                </div>
                <div style={{ fontSize: 6, color: 'var(--g2)' }}>{pct}%</div>
              </div>
              <div className="pbar-wrap" style={{ height: 5 }}>
                <div className="pbar-fill" style={{ width: `${pct}%`, height: '100%' }} />
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 6, color: 'var(--g2)', letterSpacing: 2 }}>© 2026 · 2020 SCRUM GUIDE</div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   CONCEPT SELECT
   ────────────────────────────────────────────────────────────────────────── */

function ConceptSelect({ progress, onSelect, onBack, onStartQuick, onStartMock, onStartReview, reviewQueueSize }) {
  const [hover, setHover] = useState(null);
  const totalQs = QUESTIONS.length;

  return (
    <div className="arc-scan-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onBack}>◀ BACK</button>
        <span style={{ fontSize: 10, letterSpacing: 2 }}>SELECT STAGE</span>
      </div>

      <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 2, display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        <span>2020 SCRUM GUIDE</span>
        <span style={{ color: 'var(--g2)' }}>·</span>
        <span>{totalQs} QUESTIONS</span>
        <span style={{ color: 'var(--g2)' }}>·</span>
        <span>{CONCEPTS.length} CONCEPTS</span>
      </div>

      <div style={{ fontSize: 18, color: 'var(--g5)', lineHeight: 1.4, marginBottom: 12, letterSpacing: 1 }}>
        Master PSPO I
      </div>

      <div style={{ fontSize: 9, color: 'var(--g3)', lineHeight: 1.9, marginBottom: 18 }}>
        A focused study engine for the PSPO I exam. Concept lessons,
        distractor-level feedback on wrong answers, and spaced review of
        what you miss.
      </div>

      {/* Action chips — three across */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 22 }}>
        <button onClick={onStartQuick} className="pbox" style={{
          flex: 1, minWidth: 0,
          padding: '12px 8px', cursor: 'pointer', borderColor: 'var(--cyan)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'transparent', textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--cyan)', letterSpacing: 2, textShadow: '0 0 6px rgba(68,221,255,0.4)' }}>QUICK</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1 }}>10 QS</div>
        </button>
        <button onClick={onStartMock} className="pbox" style={{
          flex: 1, minWidth: 0,
          padding: '12px 8px', cursor: 'pointer', borderColor: 'var(--purple)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
          background: 'transparent', textAlign: 'center',
        }}>
          <div style={{ fontSize: 9, color: 'var(--purple)', letterSpacing: 2, textShadow: '0 0 6px rgba(176,102,255,0.4)' }}>◉ MOCK</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1 }}>80·60M</div>
        </button>
        <button onClick={onStartReview} disabled={reviewQueueSize === 0} className="pbox" style={{
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

      <div style={{ fontSize: 10, color: 'var(--g4)', letterSpacing: 3, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>CONCEPTS</span>
        <span style={{ flex: 1, height: 1, background: 'var(--g2)' }} />
      </div>

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
                <div style={{ fontSize: 18, color: 'var(--gold)', letterSpacing: 1, flexShrink: 0, minWidth: 28, textAlign: 'center' }}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4, gap: 6 }}>
                    <div style={{ fontSize: 10, color: 'var(--g5)', letterSpacing: 1 }}>{c.label.toUpperCase()}</div>
                    <div style={{ fontSize: 7, color: cleared ? 'var(--gold)' : 'var(--g3)', letterSpacing: 1, flexShrink: 0 }}>
                      {cleared ? '★ CLEARED' : 'LEARNING'}
                    </div>
                  </div>
                  <div style={{ fontSize: 8, color: 'var(--g3)', marginBottom: 10, lineHeight: 1.6 }}>{c.subtitle}</div>
                  <div className="pbar-wrap" style={{ height: 5, marginBottom: 5 }}>
                    <div className="pbar-fill" style={{ width: `${pct}%`, height: '100%' }} />
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

/* ──────────────────────────────────────────────────────────────────────────
   LESSON SCREEN
   ────────────────────────────────────────────────────────────────────────── */

function LessonScreen({ conceptId, onStartQuiz, onBack }) {
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

/* ──────────────────────────────────────────────────────────────────────────
   QUIZ SCREEN — handles concept (phased), mixed (quick), mock, review
   ────────────────────────────────────────────────────────────────────────── */

function QuizScreen({ mode, conceptId, phases, questions, progress, onComplete, onToggleBookmark, onFinish, onExit }) {
  const isMock = mode === 'mock';
  const isPhased = !!phases;
  const allQuestions = useMemo(() => isPhased ? phases.flatMap((p) => p.questions) : (questions || []), [isPhased, phases, questions]);
  const total = allQuestions.length;

  // Phased index → flat
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [idx, setIdx] = useState(0);
  const phaseOffset = isPhased ? phases.slice(0, phaseIdx).reduce((s, p) => s + p.questions.length, 0) : 0;
  const globalIdx = isPhased ? phaseOffset + idx : idx;
  const q = isPhased ? phases[phaseIdx]?.questions[idx] : questions[idx];

  const [selected, setSelected] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [answered, setAnswered] = useState(new Map()); // globalIdx → boolean correct
  const [results, setResults] = useState([]); // {qid, correct}
  const [score, setScore] = useState(0);
  const [flash, setFlash] = useState(null);
  const [phaseTransition, setPhaseTransition] = useState(false);

  // Mock timer
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  useEffect(() => {
    if (!isMock) return;
    const iv = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(iv);
  }, [isMock]);
  useEffect(() => {
    if (isMock && timeLeft === 0) finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const concept = conceptId ? CONCEPTS.find((c) => c.id === conceptId) : null;
  const isMulti = q && q.type === 'multi';
  const isTF = q && q.type === 'tf';
  const correctAnswers = q?.correct || [];
  const correctSet = new Set(correctAnswers);

  function toggleSelect(optId) {
    if (submitted) return;
    if (isMulti) {
      setSelected((p) => p.includes(optId) ? p.filter((x) => x !== optId) : [...p, optId]);
    } else {
      setSelected([optId]);
    }
  }

  function submit() {
    if (selected.length === 0) return;
    const correct = arraysEqualAsSet(selected, correctAnswers);

    if (isMock) {
      // Deferred: don't reveal feedback, just record and advance
      if (!answered.has(globalIdx)) {
        setAnswered((prev) => { const n = new Map(prev); n.set(globalIdx, correct); return n; });
        setResults((p) => [...p, { qid: q.id, correct }]);
        if (correct) setScore((s) => s + 10);
      }
      onComplete(q.id, correct);
      advanceImmediate();
    } else {
      // Immediate feedback
      setSubmitted(true);
      setFlash(correct ? 'correct' : 'wrong');
      if (!answered.has(globalIdx)) {
        setAnswered((prev) => { const n = new Map(prev); n.set(globalIdx, correct); return n; });
        setResults((p) => [...p, { qid: q.id, correct }]);
        if (correct) setScore((s) => s + 10);
        onComplete(q.id, correct);
      }
    }
  }

  function advanceImmediate() {
    setSelected([]);
    setSubmitted(false);
    setFlash(null);
    if (isPhased) {
      const len = phases[phaseIdx].questions.length;
      if (idx + 1 < len) { setIdx(idx + 1); return; }
      if (phaseIdx + 1 < phases.length) {
        setPhaseTransition(true);
        return;
      }
      finalize();
    } else {
      if (idx + 1 < total) { setIdx(idx + 1); return; }
      finalize();
    }
  }

  function next() { advanceImmediate(); }

  function continuePhase() {
    setPhaseIdx(phaseIdx + 1);
    setIdx(0);
    setPhaseTransition(false);
  }

  function finalize() {
    const correctCount = (results.length === total) ? results.filter((r) => r.correct).length : results.filter((r) => r.correct).length;
    const finalCorrect = correctCount;
    const finalTotal = total;
    // flawless achievement
    if (finalCorrect === finalTotal && finalTotal > 0) {
      try { localStorage.setItem('pspo_flawless', 'true'); } catch {}
    }
    onFinish({
      score, results, total: finalTotal, correctCount: finalCorrect,
      wrongCount: finalTotal - finalCorrect, conceptId, mode,
      timeUsed: isMock ? (60 * 60 - timeLeft) : null,
    });
  }

  if (phaseTransition && isPhased) {
    const next = phases[phaseIdx + 1];
    return (
      <div className="arc-scan-in">
        <div className="pbox" style={{ textAlign: 'center', padding: 20 }}>
          <div style={{ fontSize: 8, color: 'var(--cyan)', letterSpacing: 2, marginBottom: 10 }}>STAGE CLEAR · PHASE COMPLETE</div>
          <div className="arc-bounce" style={{ display: 'inline-block', marginBottom: 16 }}>
            <Mascot size={64} happy />
          </div>
          <div style={{ fontSize: 14, color: 'var(--gold)', letterSpacing: 2, marginBottom: 6 }}>NEXT PHASE</div>
          <div style={{ fontSize: 10, color: 'var(--g5)', marginBottom: 4 }}>{next.name.toUpperCase()}</div>
          <div style={{ fontSize: 7, color: 'var(--g3)', lineHeight: 1.7, marginBottom: 18 }}>{next.subtitle}</div>
          <button className="arc-btn" style={{ padding: '12px 24px', fontSize: 10, letterSpacing: 2 }} onClick={continuePhase}>▶ CONTINUE</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const progressPct = total > 0 ? (answered.size / total) * 100 : 0;
  const accuracy = answered.size > 0 ? Math.round(([...answered.values()].filter((v) => v).length / answered.size) * 100) : 0;
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  const lowTime = isMock && timeLeft < 60 * 5;

  const headerLabel = mode === 'mock' ? '◉ MOCK EXAM'
    : mode === 'mixed' ? '⚡ QUICK QUIZ'
    : mode === 'review' ? '↻ REVIEW QUEUE'
    : (concept ? concept.label.toUpperCase() : 'QUIZ');

  const questionText = q.question || q.q || '';
  const displayedQuestionText = q.difficulty === 'brutal' ? defangBrutalQuestion(questionText) : questionText;
  const opts = q.options || [];

  return (
    <div className="arc-scan-in">
      {/* Top row: back + identity + accuracy/timer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <button className="arc-btn arc-btn-ghost arc-btn-sm" onClick={onExit}>◀</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 7, color: 'var(--g3)', marginBottom: 3, letterSpacing: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{headerLabel}</div>
            <div style={{ fontSize: 8, color: 'var(--g3)' }}>Q{globalIdx + 1}/{total}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          {isMock ? (
            <>
              <div style={{ fontSize: 7, color: 'var(--g3)' }}>TIME LEFT</div>
              <div style={{ color: lowTime ? 'var(--red)' : 'var(--gold)', fontSize: 14, letterSpacing: 1 }}>{timeStr}</div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 7, color: 'var(--g3)' }}>ACCURACY</div>
              <div style={{ color: 'var(--gold)', fontSize: 14 }}>
                {answered.size === 0 ? '—' : `${accuracy}%`}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="pbar-wrap" style={{ marginBottom: 8 }}>
        <div className="pbar-fill" style={{ width: `${progressPct}%` }} />
      </div>
      {isPhased && (
        <div style={{ fontSize: 6, color: 'var(--g3)', letterSpacing: 1, marginBottom: 12 }}>
          PHASE {phaseIdx + 1} / {phases.length} · {phases[phaseIdx].name.toUpperCase()}
        </div>
      )}

      {/* Selection hint */}
      <div style={{ fontSize: 7, color: 'var(--g3)', marginBottom: 12, letterSpacing: 1 }}>
        {isMulti ? `SELECT ${q.selectCount || correctAnswers.length}` : isTF ? 'TRUE OR FALSE' : 'SINGLE ANSWER'}
      </div>

      {/* Question + mascot */}
      <div className="pbox" style={{
        marginBottom: 12,
        borderColor: flash === 'correct' ? 'var(--g4)' : flash === 'wrong' ? 'var(--red)' : 'var(--g4)',
        background: flash === 'correct' ? 'rgba(0,255,65,0.08)' : flash === 'wrong' ? 'rgba(255,58,58,0.10)' : 'transparent',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <div className={flash ? '' : 'arc-bounce'} style={{ flexShrink: 0, marginTop: -4 }}>
            <Mascot size={36} talking={!submitted} happy={flash === 'correct'} sad={flash === 'wrong'} />
          </div>
          <p style={{ fontSize: 8, color: 'var(--g5)', lineHeight: 1.9, flex: 1 }}>{displayedQuestionText}</p>
          <button onClick={() => onToggleBookmark(q.id)} title="Bookmark"
            style={{
              flexShrink: 0, background: 'transparent',
              border: '1px solid var(--g2)', color: progress.bookmarks?.[q.id] ? 'var(--gold)' : 'var(--g3)',
              padding: '4px 6px', cursor: 'pointer', fontSize: 10, lineHeight: 1,
            }}>★</button>
        </div>
      </div>

      {/* Options */}
      <div style={{ marginBottom: 12 }}>
        {opts.map((opt) => {
          const isSel = selected.includes(opt.id);
          const isCorr = correctSet.has(opt.id);
          let cls = 'opt-btn';
          if (submitted) {
            if (isCorr) cls += ' correct';
            else if (isSel && !isCorr) cls += ' wrong';
          } else if (isSel) {
            cls += ' selected';
          }
          const optText = opt.text || opt.t || '';
          return (
            <button key={opt.id} className={cls} onClick={() => toggleSelect(opt.id)} disabled={submitted}>
              <span style={{
                color: submitted && isCorr ? '#000' : submitted && isSel && !isCorr ? 'var(--red)' : 'var(--g3)',
                marginRight: 8,
              }}>[{opt.id.toUpperCase()}]</span>
              {optText}
            </button>
          );
        })}
      </div>

      {/* Confirm or feedback */}
      {!submitted && (
        <div style={{ display: 'flex', gap: 8 }}>
          {isMock && (
            <button className="arc-btn arc-btn-ghost" style={{ padding: 12, fontSize: 8 }} onClick={() => {
              if (window.confirm('Submit mock exam now?')) finalize();
            }}>SUBMIT EXAM</button>
          )}
          <button className="arc-btn" style={{ flex: 1, padding: 12, fontSize: 9 }} onClick={submit} disabled={selected.length === 0}>
            ▶ CONFIRM
          </button>
        </div>
      )}

      {submitted && !isMock && (
        <div>
          <div className="pbox" style={{ marginBottom: 10, borderColor: flash === 'correct' ? 'var(--g4)' : 'var(--red)' }}>
            <div style={{ fontSize: 8, color: flash === 'correct' ? 'var(--g4)' : 'var(--red)', marginBottom: 6, letterSpacing: 1 }}>
              {flash === 'correct' ? '✓ CORRECT!' : '✕ WRONG'}
            </div>
            <div style={{ fontSize: 8, color: 'var(--g3)', lineHeight: 1.9 }}>{q.explanation}</div>
          </div>
          <button className="arc-btn" style={{ width: '100%', padding: 12, fontSize: 9 }} onClick={next}>
            {(isPhased ? (idx + 1 >= phases[phaseIdx].questions.length && phaseIdx + 1 >= phases.length) : (idx + 1 >= total))
              ? '▶ SEE RESULTS' : '▶ NEXT'}
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   RESULTS SCREEN — verdict labels: Fail / Almost There / Pass / Perfect Score
   ────────────────────────────────────────────────────────────────────────── */

function ResultsScreen({ result, conceptId, progress, onPlayAgain, onBack, onHome }) {
  const { score, results, total, correctCount, wrongCount, mode, timeUsed } = result;
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  // Verdict thresholds match classic theme
  let verdict, verdictColor, verdictGlow;
  if (pct >= 95) {
    verdict = 'PERFECT SCORE'; verdictColor = 'var(--g4)'; verdictGlow = '#00ff41';
  } else if (pct >= 85) {
    verdict = 'PASS'; verdictColor = 'var(--g4)'; verdictGlow = '#00ff41';
  } else if (pct >= 70) {
    verdict = 'ALMOST THERE'; verdictColor = 'var(--gold)'; verdictGlow = '#ffb000';
  } else {
    verdict = 'FAIL'; verdictColor = 'var(--red)'; verdictGlow = '#ff3333';
  }
  const stars = pct >= 95 ? 3 : pct >= 85 ? 2 : pct >= 70 ? 1 : 0;
  const cleared = pct >= 85;
  const concept = conceptId ? CONCEPTS.find((c) => c.id === conceptId) : null;
  const perfectRun = correctCount === total && total > 0;

  const allCleared = CONCEPTS.every((c) => masteryForConcept(progress, c.id).level === 'mastered');
  const flawless = (() => {
    try { return JSON.parse(localStorage.getItem('pspo_flawless') || 'false'); } catch { return false; }
  })();

  const headerLabel = mode === 'mock' ? '◉ MOCK EXAM · RESULTS'
    : mode === 'mixed' ? '⚡ QUICK QUIZ · RESULTS'
    : mode === 'review' ? '↻ REVIEW · RESULTS'
    : 'RESULTS';

  const timeStr = timeUsed != null ? `${Math.floor(timeUsed / 60)}m ${timeUsed % 60}s` : null;

  return (
    <div className="arc-scan-in" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 10, letterSpacing: 3, marginBottom: 4, color: 'var(--g3)' }}>{headerLabel}</div>
      {concept && <div style={{ fontSize: 14, marginBottom: 16, color: 'var(--g5)' }}>{concept.label.toUpperCase()}</div>}
      <div style={{ marginBottom: 12, display: 'inline-block' }}>
        <Mascot size={72} happy={cleared} sad={!cleared} />
      </div>

      <div className="pbox" style={{ marginBottom: 12, textAlign: 'left' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 28, color: verdictColor, textShadow: `0 0 12px ${verdictGlow}` }}>
            {pct}%
          </div>
          <div style={{ fontSize: 8, color: 'var(--g3)', marginTop: 2 }}>{correctCount} / {total} CORRECT</div>
          <div style={{ margin: '10px 0', fontSize: 18 }}>
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} style={{ color: i < stars ? 'var(--gold)' : 'var(--g2)', marginRight: 4 }}>★</span>
            ))}
          </div>
          <div style={{ fontSize: 11, color: verdictColor, letterSpacing: 2, textShadow: `0 0 8px ${verdictGlow}` }}>
            {verdict}
          </div>
        </div>

        <hr className="arc-divider" />
        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: 8 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--g3)', marginBottom: 4 }}>SCORE</div>
            <div style={{ color: 'var(--gold)' }}>{score}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--g3)', marginBottom: 4 }}>CORRECT</div>
            <div>{correctCount}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: 'var(--g3)', marginBottom: 4 }}>WRONG</div>
            <div style={{ color: wrongCount === 0 ? 'var(--g4)' : 'var(--red)' }}>{wrongCount}</div>
          </div>
        </div>
        {timeStr && (
          <>
            <hr className="arc-divider" />
            <div style={{ textAlign: 'center', fontSize: 8 }}>
              <span style={{ color: 'var(--g3)' }}>TIME: </span>
              <span style={{ color: 'var(--gold)' }}>{timeStr}</span>
            </div>
          </>
        )}
      </div>

      {/* Achievements */}
      <div style={{ marginBottom: 12, textAlign: 'left' }}>
        <div style={{ fontSize: 7, color: 'var(--g3)', letterSpacing: 1, marginBottom: 6 }}>ACHIEVEMENTS</div>
        <AchievementBadge
          icon="🎓" title="MOCK COMPLETE"
          desc="All 10 concepts mastered. You are ready for the exam."
          hint="Master all 10 concepts."
          unlocked={allCleared}
        />
        <AchievementBadge
          icon="⚡" title="FLAWLESS VICTORY"
          desc="Finished a quiz with zero wrong answers."
          hint="Complete any quiz without missing a single question."
          unlocked={flawless}
          isNew={perfectRun}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
        <button className="arc-btn" style={{ width: '100%', padding: 12, fontSize: 9 }} onClick={onPlayAgain}>↺ PLAY AGAIN</button>
        <button className="arc-btn arc-btn-ghost" style={{ width: '100%', padding: 10, fontSize: 8 }} onClick={onBack}>◀ STAGE SELECT</button>
        <button className="arc-btn arc-btn-ghost" style={{ width: '100%', padding: 10, fontSize: 8 }} onClick={onHome}>⌂ TITLE</button>
      </div>
    </div>
  );
}

function AchievementBadge({ icon, title, desc, hint, unlocked = false, isNew = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        border: `2px solid ${isNew ? 'var(--g4)' : unlocked ? 'var(--g3)' : 'var(--g2)'}`,
        padding: '8px 10px', marginBottom: 6, position: 'relative',
        background: isNew ? 'rgba(0,255,65,0.07)' : unlocked ? 'rgba(0,255,65,0.04)' : 'rgba(0,0,0,0.4)',
        boxShadow: isNew ? '0 0 10px rgba(255,215,0,0.3)' : 'none',
        cursor: unlocked ? 'default' : 'help',
        filter: unlocked ? 'none' : 'brightness(0.45)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ fontSize: 20, flexShrink: 0, filter: unlocked ? 'none' : 'blur(3px) grayscale(1)', userSelect: 'none' }}>
        {unlocked ? icon : '▓'}
      </div>
      <div style={{ textAlign: 'left', flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: 7, color: isNew ? 'var(--g4)' : unlocked ? 'var(--g3)' : 'var(--g2)', letterSpacing: 1, marginBottom: 2 }}>
          {isNew ? '★ ACHIEVEMENT UNLOCKED' : unlocked ? 'ACHIEVEMENT' : '??? LOCKED'}
        </div>
        <div style={{ fontSize: 8, color: unlocked ? '#fff' : 'var(--g2)', marginBottom: 2, filter: unlocked ? 'none' : 'blur(2px)' }}>
          {unlocked ? title : '██████████'}
        </div>
        <div style={{ fontSize: 6, color: 'var(--g2)', lineHeight: 1.6, filter: unlocked ? 'none' : 'blur(2px)' }}>
          {unlocked ? desc : '████████████████'}
        </div>
      </div>
      {!unlocked && <div style={{ fontSize: 10, color: 'var(--g2)', flexShrink: 0 }}>🔒</div>}
      {!unlocked && hovered && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0,
          background: '#000', border: '2px solid var(--g3)',
          padding: '8px 10px', zIndex: 50,
          boxShadow: '0 0 10px rgba(0,255,65,0.3)', pointerEvents: 'none',
        }}>
          <div style={{ fontSize: 7, color: 'var(--gold)', marginBottom: 3, letterSpacing: 1 }}>HOW TO UNLOCK</div>
          <div style={{ fontSize: 7, color: 'var(--g4)', lineHeight: 1.8 }}>{hint}</div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   ARCADE SHELL — internal screen routing
   ────────────────────────────────────────────────────────────────────────── */

export default function ArcadeShell({
  view,
  activeConcept,
  quizPhases,
  quizQuestions,
  quizMode,
  progress,
  onAnswer,
  onToggleBookmark,
  onSwitchTheme,
  onPickConcept,
  onStartConceptQuiz,
  onStartQuickQuiz,
  onStartMockExam,
  onStartReview,
  onSetView,
  onExitQuiz,
}) {
  // Results are local — finished a quiz, but if user toggles theme, results are lost (acceptable)
  const [quizResult, setQuizResult] = useState(null);

  const reviewQueue = useMemo(() => {
    return Object.entries(progress.questions || {})
      .filter(([, p]) => {
        const wrong = p.wrongCount || 0;
        const right = p.correctCount || 0;
        return wrong > right || (wrong > 0 && right < 2);
      })
      .map(([qid]) => QUESTIONS.find((q) => q.id === qid))
      .filter(Boolean);
  }, [progress]);

  function finishQuiz(result) {
    setQuizResult(result);
    onSetView('results');
  }

  function playAgain() {
    setQuizResult(null);
    if (quizMode === 'concept' && activeConcept) onStartConceptQuiz(activeConcept);
    else if (quizMode === 'mixed') onStartQuickQuiz();
    else if (quizMode === 'mock') onStartMockExam();
    else if (quizMode === 'review') onStartReview();
    else onSetView('home');
  }

  // Map shared `view` to which arcade screen renders
  // 'title' → TitleScreen | 'home' → ConceptSelect | 'lesson' → LessonScreen
  // 'quiz' → QuizScreen | 'results' → ResultsScreen | 'review' / 'stats' → ConceptSelect
  return (
    <div className="arcade-root">
      <div className="arcade-scanline" />
      <button className="arcade-theme-toggle" onClick={onSwitchTheme} title="Switch to classic theme">
        <span className="theme-toggle-icon">◐</span>
        <span>CLASSIC</span>
      </button>
      <div className="arcade-stage">
        {view === 'title' && (
          <TitleScreen progress={progress} onStart={() => onSetView('home')} />
        )}
        {(view === 'home' || view === 'review' || view === 'stats') && (
          <ConceptSelect
            progress={progress}
            onSelect={(cid) => onPickConcept(cid)}
            onBack={() => onSetView('title')}
            onStartQuick={onStartQuickQuiz}
            onStartMock={onStartMockExam}
            onStartReview={onStartReview}
            reviewQueueSize={reviewQueue.length}
          />
        )}
        {view === 'lesson' && activeConcept && (
          <LessonScreen
            conceptId={activeConcept}
            onStartQuiz={() => onStartConceptQuiz(activeConcept)}
            onBack={() => onSetView('home')}
          />
        )}
        {view === 'quiz' && (quizPhases || quizQuestions) && (
          <QuizScreen
            mode={quizMode}
            conceptId={activeConcept}
            phases={quizPhases}
            questions={quizQuestions}
            progress={progress}
            onComplete={onAnswer}
            onToggleBookmark={onToggleBookmark}
            onFinish={finishQuiz}
            onExit={onExitQuiz}
          />
        )}
        {view === 'results' && quizResult && (
          <ResultsScreen
            result={quizResult}
            conceptId={activeConcept}
            progress={progress}
            onPlayAgain={playAgain}
            onBack={() => { setQuizResult(null); onSetView('home'); }}
            onHome={() => { setQuizResult(null); onSetView('title'); }}
          />
        )}
      </div>
    </div>
  );
}
