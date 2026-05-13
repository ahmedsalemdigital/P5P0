export const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Manrope:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Press+Start+2P&display=swap');

.pspo-root {
  --bg: #0e0c0a;
  --surface: #17140f;
  --surface-hi: #1f1b15;
  --surface-on: #2a2620;
  --border: #2a2620;
  --border-hi: #3d362c;
  --text: #e8e1d3;
  --text-dim: #8a8275;
  --text-faint: #5c564c;
  --accent: #e8a838;
  --accent-dim: #b88428;
  --accent-soft: rgba(232, 168, 56, 0.12);
  --correct: #8bb38b;
  --correct-soft: rgba(139, 179, 139, 0.12);
  --wrong: #d18585;
  --wrong-soft: rgba(209, 133, 133, 0.12);
  --font-display: 'Fraunces', 'Georgia', serif;
  --font-body: 'Manrope', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Menlo', monospace;

  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  line-height: 1.5;
  font-size: 15px;
}

.pspo-root * { box-sizing: border-box; }

.pspo-root .display { font-family: var(--font-display); font-optical-sizing: auto; }
.pspo-root .mono { font-family: var(--font-mono); letter-spacing: 0.02em; }

.pspo-root button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  color: inherit;
  padding: 0;
}

.pspo-root .grainy {
  background-image:
    radial-gradient(1200px 600px at 90% -10%, rgba(232, 168, 56, 0.06), transparent 60%),
    radial-gradient(800px 400px at 5% 110%, rgba(232, 168, 56, 0.04), transparent 60%);
}

.pspo-root .rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-hi), transparent);
}

.pspo-root .chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 9px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 2px;
  background: var(--surface);
}

.pspo-root .chip.accent { color: var(--accent); border-color: var(--accent-dim); background: var(--accent-soft); }
.pspo-root .chip.correct { color: var(--correct); border-color: var(--correct); background: var(--correct-soft); }
.pspo-root .chip.wrong { color: var(--wrong); border-color: var(--wrong); background: var(--wrong-soft); }

.pspo-root .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  font-family: var(--font-mono);
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: var(--text);
  border: 1px solid var(--border-hi);
  background: var(--surface);
  transition: all 0.12s ease;
}
.pspo-root .btn:hover:not(:disabled) { background: var(--surface-hi); border-color: var(--accent-dim); }
.pspo-root .btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pspo-root .btn.primary { background: var(--accent); color: #1a1409; border-color: var(--accent); font-weight: 600; }
.pspo-root .btn.primary:hover:not(:disabled) { background: #f2b44a; border-color: #f2b44a; }
.pspo-root .btn.ghost { border-color: var(--border); color: var(--text-dim); }
.pspo-root .btn.ghost:hover:not(:disabled) { color: var(--text); border-color: var(--border-hi); }

.pspo-root .option-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 15px;
  line-height: 1.5;
  transition: all 0.12s ease;
  position: relative;
}
.pspo-root .option-btn:hover:not(:disabled) { border-color: var(--border-hi); background: var(--surface-hi); }
.pspo-root .option-btn.selected { border-color: var(--accent); background: var(--accent-soft); }
.pspo-root .option-btn.correct { border-color: var(--correct); background: var(--correct-soft); }
.pspo-root .option-btn.wrong { border-color: var(--wrong); background: var(--wrong-soft); }
.pspo-root .option-btn:disabled { cursor: default; }

.pspo-root .option-letter {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--text-faint);
  display: inline-block;
  width: 20px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.pspo-root .option-btn.selected .option-letter { color: var(--accent); }
.pspo-root .option-btn.correct .option-letter { color: var(--correct); }
.pspo-root .option-btn.wrong .option-letter { color: var(--wrong); }

.pspo-root .concept-card {
  padding: 22px 24px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  transition: all 0.15s ease;
  text-align: left;
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
}
.pspo-root .concept-card:hover { border-color: var(--accent-dim); background: var(--surface-hi); transform: translateY(-1px); }
.pspo-root .concept-card::after {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--mastery-color, var(--border));
}

.pspo-root .tick {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--border-hi);
  display: inline-block;
}
.pspo-root .tick.filled { background: var(--accent); }

.pspo-root .numeric {
  font-family: var(--font-display);
  font-weight: 500;
  font-variant-numeric: tabular-nums;
}

.pspo-root .fade-in { animation: pspoFade 0.3s ease; }
@keyframes pspoFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.pspo-root .dim { color: var(--text-dim); }
.pspo-root .faint { color: var(--text-faint); }
.pspo-root .accent { color: var(--accent); }

.pspo-root .card {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 28px;
}

.pspo-root .container-max { max-width: 820px; margin: 0 auto; padding: 32px 24px 80px; }

/* Theme toggle — styled to match the arcade theme it switches to */
.pspo-root .theme-toggle-classic {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 10px;
  padding: 9px 14px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #00ff41;
  background: #000;
  border: 2px solid #00ff41;
  border-radius: 0;
  cursor: pointer;
  transition: transform 0.1s, background 0.12s, color 0.12s;
  animation: themePulseArcade 2s ease-in-out infinite;
  box-shadow:
    0 0 0 0 rgba(0,255,65,0.6),
    inset 0 0 8px rgba(0,255,65,0.2);
}
.pspo-root .theme-toggle-classic:hover {
  background: #00ff41;
  color: #000;
  transform: translateY(-1px);
}
.pspo-root .theme-toggle-classic:active { transform: translateY(1px); }
.pspo-root .theme-toggle-classic .theme-toggle-icon {
  display: inline-block;
  animation: themeSpin 4s linear infinite, themeGlitchIcon 11s infinite;
}
@keyframes themePulseArcade {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0,255,65,0.6), inset 0 0 8px rgba(0,255,65,0.2); }
  50%      { box-shadow: 0 0 0 10px rgba(0,255,65,0), inset 0 0 8px rgba(0,255,65,0.2); }
}
@keyframes themeSpin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
/* Brief, rare glitch — about 250ms every 11s */
@keyframes themeGlitchIcon {
  0%, 97%, 100% { text-shadow: none; filter: none; }
  97.5%         { text-shadow: 1px 0 rgba(255,68,170,0.55), -1px 0 rgba(68,221,255,0.55); filter: brightness(1.1); }
  98%           { text-shadow: -1px 0 rgba(255,68,170,0.55), 1px 0 rgba(68,221,255,0.55); }
  98.8%         { text-shadow: 1px 0 rgba(255,68,170,0.4), -1px 0 rgba(68,221,255,0.4); }
}

/* Arcade-style pixel button used inside the classic theme (e.g. "Try P5P0" CTA).
   Pixel-stepped capsule with stepped quarter-circle caps on left and right.
   The steps are NON-uniform — wide flat tip, narrowing toward the side — so
   the staircase actually traces a circle instead of a 45° diagonal. */
.pspo-root .pixel-cta {
  font-family: 'Press Start 2P', monospace;
  font-size: 18px;
  letter-spacing: 0.18em;
  color: #00ff41;
  background: #000;
  padding: 22px 40px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  min-height: 80px;
  min-width: 240px;
  /* Stepped quarter-circle, R=36, 4 steps per corner, sized to follow a true arc:
       top tip:  4px tall × 15px wide   (curve almost tangent to top edge)
       step 2:   8px tall × 12px wide
       step 3:  12px tall × 6px wide
       step 4:  12px tall × 3px wide    (curve almost tangent to right edge) */
  clip-path: polygon(
    /* top edge */
    36px 0, calc(100% - 36px) 0,
    /* top-right curve */
    calc(100% - 36px) 4px,  calc(100% - 21px) 4px,
    calc(100% - 21px) 12px, calc(100% - 9px)  12px,
    calc(100% - 9px)  24px, calc(100% - 3px)  24px,
    calc(100% - 3px)  36px, 100% 36px,
    /* right straight edge */
    100% calc(100% - 36px),
    /* bottom-right curve (mirror) */
    calc(100% - 3px)  calc(100% - 36px), calc(100% - 3px)  calc(100% - 24px),
    calc(100% - 9px)  calc(100% - 24px), calc(100% - 9px)  calc(100% - 12px),
    calc(100% - 21px) calc(100% - 12px), calc(100% - 21px) calc(100% - 4px),
    calc(100% - 36px) calc(100% - 4px), calc(100% - 36px) 100%,
    /* bottom edge */
    36px 100%,
    /* bottom-left curve (mirror) */
    36px calc(100% - 4px), 21px calc(100% - 4px),
    21px calc(100% - 12px), 9px calc(100% - 12px),
    9px  calc(100% - 24px), 3px calc(100% - 24px),
    3px  calc(100% - 36px), 0 calc(100% - 36px),
    /* left straight edge */
    0 36px,
    /* top-left curve (mirror) */
    3px 36px,  3px 24px,
    9px 24px,  9px 12px,
    21px 12px, 21px 4px,
    36px 4px
  );
  /* Outer phosphor glow follows the clipped silhouette */
  filter: drop-shadow(0 0 10px rgba(0,255,65,0.55));
  text-shadow: 0 0 6px rgba(0,255,65,0.6);
  transition: transform 0.08s, filter 0.12s, color 0.12s;
  position: relative;
  border: none;
}
/* Border = a slightly larger sibling shape rendered behind, in green.
   We use box-shadow with negative spread + clip-path is identical, but offset is 0,
   which would just be the same shape. Instead we draw the green outline via a 2nd
   clip-path on ::before with a SHRUNK polygon — the contrast between the parent
   (green background) and ::before (black face) is the visible border. */
.pspo-root .pixel-cta {
  background: #00ff41;           /* the border color */
}
.pspo-root .pixel-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #000;
  /* Inner polygon — same shape inset by ~3px on every edge. The vertical step
     coordinates are shifted by +3 (top) / -3 (bottom); the horizontal step
     coordinates are shifted by +3 (left) / -3 (right). */
  clip-path: polygon(
    36px 3px, calc(100% - 36px) 3px,
    calc(100% - 36px) 6px,  calc(100% - 23px) 6px,
    calc(100% - 23px) 14px, calc(100% - 11px) 14px,
    calc(100% - 11px) 25px, calc(100% - 5px)  25px,
    calc(100% - 5px)  36px, calc(100% - 3px)  36px,
    calc(100% - 3px)  calc(100% - 36px),
    calc(100% - 5px)  calc(100% - 36px), calc(100% - 5px)  calc(100% - 25px),
    calc(100% - 11px) calc(100% - 25px), calc(100% - 11px) calc(100% - 14px),
    calc(100% - 23px) calc(100% - 14px), calc(100% - 23px) calc(100% - 6px),
    calc(100% - 36px) calc(100% - 6px), calc(100% - 36px) calc(100% - 3px),
    36px calc(100% - 3px),
    36px calc(100% - 6px), 23px calc(100% - 6px),
    23px calc(100% - 14px), 11px calc(100% - 14px),
    11px calc(100% - 25px), 5px calc(100% - 25px),
    5px  calc(100% - 36px), 3px calc(100% - 36px),
    3px 36px,
    5px 36px,  5px 25px,
    11px 25px, 11px 14px,
    23px 14px, 23px 6px,
    36px 6px
  );
  box-shadow: inset 0 0 16px rgba(0,255,65,0.25);
  z-index: 0;
}
.pspo-root .pixel-cta > * { position: relative; z-index: 1; }
.pspo-root .pixel-cta:active { transform: translateY(1px); }
.pspo-root .pixel-cta:hover {
  filter: drop-shadow(0 0 18px rgba(0,255,65,0.9));
  color: #ccffdd;
  animation: pixelCtaGlitch 0.9s steps(1) infinite;
}
@keyframes pixelCtaGlitch {
  0%   { transform: translate(0, 0);     text-shadow: 0 0 6px rgba(0,255,65,0.6); }
  18%  { transform: translate(-1px, 0);  text-shadow: 2px 0 rgba(255,68,170,0.6), -2px 0 rgba(68,221,255,0.6); }
  22%  { transform: translate(1px, 0);   text-shadow: -2px 0 rgba(255,68,170,0.6), 2px 0 rgba(68,221,255,0.6); }
  26%  { transform: translate(0, 0);     text-shadow: 0 0 6px rgba(0,255,65,0.6); }
  60%  { transform: translate(0, 0);     text-shadow: 0 0 6px rgba(0,255,65,0.6); }
  64%  { transform: translate(2px, -1px); text-shadow: -2px 0 rgba(68,221,255,0.5); filter: hue-rotate(-10deg); }
  68%  { transform: translate(-1px, 0);  text-shadow: 2px 0 rgba(255,68,170,0.5); }
  72%  { transform: translate(0, 0);     text-shadow: 0 0 6px rgba(0,255,65,0.6); filter: none; }
  100% { transform: translate(0, 0);     text-shadow: 0 0 6px rgba(0,255,65,0.6); }
}

@media (max-width: 640px) {
  .pspo-root { font-size: 14px; }
  .pspo-root .container-max { padding: 20px 16px 60px; }
  .pspo-root .card { padding: 20px; }
  .pspo-root .btn { padding: 10px 16px; font-size: 11px; }
}

.pspo-dot {
  position: relative;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  border-radius: 3px;
  transition: background 0.15s;
}
.pspo-dot:hover {
  background: var(--surface-hi);
}
.pspo-dot[data-tip]:hover::after {
  content: attr(data-tip);
  position: absolute;
  bottom: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--surface-on);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 600;
  padding: 5px 9px;
  border-radius: 4px;
  border: 1px solid var(--border-hi);
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  letter-spacing: 0.05em;
}
`;
