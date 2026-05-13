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
/* CRT-style contrast bump on the content (no jitter — caused screen shake) */
.arcade-stage {
  filter: contrast(1.06) brightness(1.02);
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
