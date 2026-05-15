export const STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Press+Start+2P&display=swap');

/* ──────────────────────────────────────────────────────────────────────────
   CLASSIC THEME — Apple-inspired light mode

   Palette + typography lifted from DESIGN.md (Apple light theme):
     • Single Action Blue accent (#0066cc)
     • Near-black ink (#1d1d1f) on white / parchment surfaces
     • Hairline 1px borders, no shadows on chrome
     • SF Pro Display/Text via system stack, Inter fallback
   ────────────────────────────────────────────────────────────────────────── */

.pspo-root {
  --bg: #ffffff;                  /* canvas */
  --surface: #ffffff;              /* card body */
  --surface-hi: #f5f5f7;           /* parchment hover */
  --surface-on: #fafafc;           /* pearl input/track */
  --border: #e0e0e0;               /* hairline */
  --border-hi: #d2d2d7;            /* slightly darker hairline */
  --text: #1d1d1f;                 /* ink */
  --text-dim: #7a7a7a;             /* ink-muted-48 */
  --text-faint: #a1a1a6;           /* very muted */
  --accent: #0066cc;               /* Action Blue */
  --accent-dim: #0066cc;           /* same — single tone in Apple's system */
  --accent-soft: rgba(0, 102, 204, 0.08);
  --correct: #34c759;              /* iOS green */
  --correct-soft: rgba(52, 199, 89, 0.10);
  --wrong: #ff3b30;                /* iOS red */
  --wrong-soft: rgba(255, 59, 48, 0.08);

  --font-display: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
  --font-body:    -apple-system, BlinkMacSystemFont, 'SF Pro Text',    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  font-family: var(--font-body);
  color: var(--text);
  background: var(--bg);
  min-height: 100vh;
  line-height: 1.47;
  font-size: 17px;
  letter-spacing: -0.374px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.pspo-root * { box-sizing: border-box; }

/* Global focus ring — Apple uses a 2px blue outline with a 2px offset.
   Applied via :focus-visible so it only shows for keyboard/AT users. */
.pspo-root *:focus { outline: none; }
.pspo-root *:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Respect prefers-reduced-motion — disable non-essential animation. */
@media (prefers-reduced-motion: reduce) {
  .pspo-root *, .pspo-root *::before, .pspo-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
}

/* Skip-to-main-content link — visible only when keyboard-focused. */
.pspo-skip-link {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 10px 16px;
  background: var(--text);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.224px;
  border-radius: 8px;
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 0.15s ease;
  z-index: 10000;
}
.pspo-skip-link:focus,
.pspo-skip-link:focus-visible {
  transform: translateY(0);
}

.pspo-root .display {
  font-family: var(--font-display);
  font-weight: 600;
  letter-spacing: -0.022em;        /* "Apple tight" */
  -webkit-font-smoothing: antialiased;
}
.pspo-root .mono { font-family: var(--font-mono); letter-spacing: 0.02em; }

.pspo-root button {
  font-family: inherit;
  cursor: pointer;
  border: none;
  background: transparent;
  color: inherit;
  padding: 0;
}

/* Apple uses no decorative gradients — keep the canvas pristine. */
.pspo-root .grainy { background: var(--bg); }

.pspo-root .rule {
  height: 1px;
  background: var(--border);
}

.pspo-root .chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.12px;
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 999px;            /* Apple pill */
  background: var(--surface);
}
.pspo-root .chip.accent  { color: var(--accent);  border-color: rgba(0,102,204,0.30); background: var(--accent-soft); }
.pspo-root .chip.correct { color: #1f8a3e;        border-color: rgba(52,199,89,0.40); background: var(--correct-soft); }
.pspo-root .chip.wrong   { color: #c4382e;        border-color: rgba(255,59,48,0.40); background: var(--wrong-soft); }

/* Buttons.
   .btn       — generic compact utility button (rounded-sm, 8px)
   .btn.primary — signature Apple blue pill */
.pspo-root .btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 400;
  letter-spacing: -0.224px;
  color: var(--text);
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 8px;
  transition: background 0.15s ease, border-color 0.15s ease,
              color 0.15s ease, transform 0.1s ease;
}
.pspo-root .btn:hover:not(:disabled) {
  background: var(--surface-hi);
  border-color: var(--border-hi);
}
.pspo-root .btn:active:not(:disabled) { transform: scale(0.97); }
.pspo-root .btn:disabled { opacity: 0.4; cursor: not-allowed; }

.pspo-root .btn.primary {
  background: var(--accent);
  color: #ffffff;
  border-color: var(--accent);
  border-radius: 999px;            /* signature pill */
  padding: 11px 22px;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.374px;
}
.pspo-root .btn.primary:hover:not(:disabled) {
  background: #0071e3;
  border-color: #0071e3;
}
.pspo-root .btn.primary:active:not(:disabled) { transform: scale(0.95); }
.pspo-root .btn.primary:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
}

.pspo-root .btn.ghost {
  border-color: transparent;
  color: var(--accent);
  background: transparent;
}
.pspo-root .btn.ghost:hover:not(:disabled) {
  color: #0071e3;
  background: var(--accent-soft);
  border-color: transparent;
}

/* Secondary blue pill — Apple's "ghost pill": transparent fill,
   blue text, 1px blue border. Used as the second CTA next to a primary pill. */
.pspo-root .btn.secondary {
  background: transparent;
  color: var(--accent);
  border: 1px solid var(--accent);
  border-radius: 999px;
  padding: 11px 22px;
  font-size: 17px;
  font-weight: 400;
  letter-spacing: -0.374px;
}
.pspo-root .btn.secondary:hover:not(:disabled) {
  background: var(--accent-soft);
  color: #0071e3;
  border-color: #0071e3;
}
.pspo-root .btn.secondary:active:not(:disabled) { transform: scale(0.95); }
.pspo-root .btn.secondary:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
}

/* Nav item — used by the header navigation. Active state uses Apple's
   filled-pill treatment (soft blue surface + accent text). */
.pspo-root .nav-item {
  padding: 6px 14px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: -0.156px;
  color: var(--text-dim);
  border: 1px solid transparent;
  background: transparent;
  border-radius: 999px;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}
.pspo-root .nav-item:hover {
  color: var(--text);
  background: var(--surface-hi);
}
.pspo-root .nav-item[aria-current="page"] {
  color: var(--accent);
  background: var(--accent-soft);
}

/* Splash / loading state — full-viewport centered, brand-quiet. */
.pspo-splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  color: #1d1d1f;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', system-ui, sans-serif;
}
.pspo-splash-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.pspo-splash-mark {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.5px;
}
.pspo-splash-mark .accent { color: #0066cc; font-style: italic; }
.pspo-splash-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid rgba(0,0,0,0.1);
  border-top-color: #0066cc;
  border-radius: 50%;
  animation: pspoSpin 0.8s linear infinite;
}
@keyframes pspoSpin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .pspo-splash-spinner { animation: none; border-top-color: rgba(0,0,0,0.1); }
}

/* Quiz option button — hairline border, parchment hover, blue accent on select */
.pspo-root .option-btn {
  display: block;
  width: 100%;
  text-align: left;
  padding: 16px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text);
  font-size: 17px;
  line-height: 1.47;
  letter-spacing: -0.374px;
  border-radius: 11px;             /* Apple rounded-md */
  transition: background 0.15s ease, border-color 0.15s ease;
  position: relative;
}
.pspo-root .option-btn:hover:not(:disabled) {
  border-color: var(--border-hi);
  background: var(--surface-hi);
}
.pspo-root .option-btn.selected { border-color: var(--accent);  background: var(--accent-soft); }
.pspo-root .option-btn.correct  { border-color: var(--correct); background: var(--correct-soft); }
.pspo-root .option-btn.wrong    { border-color: var(--wrong);   background: var(--wrong-soft); }
.pspo-root .option-btn:disabled { cursor: default; }

.pspo-root .option-letter {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 600;
  color: var(--text-dim);
  display: inline-block;
  width: 22px;
  letter-spacing: -0.224px;
}
.pspo-root .option-btn.selected .option-letter { color: var(--accent); }
.pspo-root .option-btn.correct  .option-letter { color: #1f8a3e; }
.pspo-root .option-btn.wrong    .option-letter { color: #c4382e; }

/* Concept card — Apple store utility card grammar (rounded-lg, hairline) */
.pspo-root .concept-card {
  padding: 22px 24px 20px;
  border: 1px solid var(--border);
  background: var(--surface);
  border-radius: 18px;             /* Apple rounded-lg */
  transition: background 0.15s ease, border-color 0.15s ease;
  text-align: left;
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
}
.pspo-root .concept-card:hover {
  border-color: var(--border-hi);
  background: var(--surface-hi);
}
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
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.022em;
}

.pspo-root .fade-in { animation: pspoFade 0.3s ease; }
@keyframes pspoFade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

.pspo-root .dim   { color: var(--text-dim); }
.pspo-root .faint { color: var(--text-faint); }
.pspo-root .accent { color: var(--accent); }

.pspo-root .card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;             /* Apple rounded-lg */
  padding: 24px;
}

.pspo-root .container-max { max-width: 980px; margin: 0 auto; padding: 32px 24px 80px; }

/* Theme toggle switch — pill-shaped track with a sliding thumb.
   Off state = classic (current); hover hints arcade switch in Apple blue. */
.pspo-root .theme-toggle-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-left: 10px;
  padding: 6px 10px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.12px;
  color: var(--text-dim);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.pspo-root .theme-toggle-switch-label {
  line-height: 1;
}
.pspo-root .theme-toggle-switch-track {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background: var(--surface-on);
  border: 1px solid var(--border);
  transition: background 0.18s ease, border-color 0.18s ease;
  flex-shrink: 0;
}
.pspo-root .theme-toggle-switch-thumb {
  position: absolute;
  top: 50%;
  left: 2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-dim);
  transform: translateY(-50%);
  transition: left 0.2s ease, background 0.18s ease;
}
.pspo-root .theme-toggle-switch:hover {
  color: var(--accent);
  border-color: rgba(0,102,204,0.20);
  background: var(--accent-soft);
}
.pspo-root .theme-toggle-switch:hover .theme-toggle-switch-track {
  background: var(--accent);
  border-color: var(--accent);
}
.pspo-root .theme-toggle-switch:hover .theme-toggle-switch-thumb {
  left: 16px;
  background: #ffffff;
}
.pspo-root .theme-toggle-switch:focus-visible {
  outline: 2px solid #0071e3;
  outline-offset: 2px;
}

/* Chunky pixel-art "TRY P5P0" CTA — intentionally retro to signal the
   theme switch destination (arcade). Kept as a deliberate stylistic
   contrast to the Apple-minimal chrome around it. */
.pspo-root .pixel-cta {
  font-family: 'Press Start 2P', monospace;
  font-size: 16px;
  letter-spacing: 0.16em;
  color: #cadc9f;
  text-shadow: 1px 1px 0 #0f380f;
  background: #0f380f;
  padding: 5px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  min-height: 68px;
  min-width: 220px;
  position: relative;
  border: none;
  clip-path: polygon(
    3px 0, calc(100% - 3px) 0,
    100% 3px, 100% calc(100% - 3px),
    calc(100% - 3px) 100%, 3px 100%,
    0 calc(100% - 3px), 0 3px
  );
  transition: transform 0.08s, filter 0.12s, color 0.12s;
}
.pspo-root .pixel-cta::before {
  content: '';
  position: absolute;
  inset: 5px;
  background: #306230;
  z-index: 0;
  clip-path: polygon(
    2px 0, calc(100% - 2px) 0,
    100% 2px, 100% calc(100% - 2px),
    calc(100% - 2px) 100%, 2px 100%,
    0 calc(100% - 2px), 0 2px
  );
  box-shadow:
    inset 0  3px 0 #8bac0f,
    inset 0 -3px 0 #0f380f;
}
.pspo-root .pixel-cta::after {
  content: '';
  position: absolute;
  top: 5px;
  left: 9px;
  right: 9px;
  height: 1px;
  background: #cadc9f;
  z-index: 0;
  opacity: 0.85;
}
.pspo-root .pixel-cta > * { position: relative; z-index: 1; }
.pspo-root .pixel-cta:active {
  transform: translateY(2px);
}
.pspo-root .pixel-cta:active::before {
  box-shadow:
    inset 0  1px 0 #8bac0f,
    inset 0 -4px 0 #0f380f;
}
.pspo-root .pixel-cta:active::after { opacity: 0; }
.pspo-root .pixel-cta:hover {
  color: #9bbc0f;
}

@media (max-width: 640px) {
  .pspo-root { font-size: 15px; }
  .pspo-root .container-max { padding: 24px 20px 60px; }
  .pspo-root .card { padding: 20px; }
  .pspo-root .btn { padding: 8px 14px; font-size: 13px; }
  .pspo-root .btn.primary { padding: 10px 20px; font-size: 16px; }
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
  border-radius: 4px;
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
  background: var(--text);
  color: #ffffff;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  padding: 6px 10px;
  border-radius: 8px;
  white-space: nowrap;
  pointer-events: none;
  z-index: 100;
  letter-spacing: -0.12px;
}
`;
