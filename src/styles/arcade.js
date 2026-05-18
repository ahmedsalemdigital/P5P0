export const ARCADE_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Fraunces:opsz,wght@9..144,400;9..144,500&family=JetBrains+Mono:wght@400;500&display=swap');

/* index.html sets html/body to white as a flash-prevention baseline.
   Override here so overscroll / rubber-banding past page edges shows
   black instead of a bright flash against the arcade CRT theme. */
html, body, #root { background: #000; }

.arcade-root {
  --g0:#000000; --g1:#003c1e; --g2:#0a7a3c;
  --g3:#3ddc70; --g4:#00ff66; --g5:#e5ffe5;
  --text:#e5ffe5; --text-dim:#9ce6b3; --text-muted:#3ddc70;
  --red:#ff5a5a; --gold:#ffc44d; --amber:#ffa94d;
  --cyan:#7be4ff; --magenta:#ff7ac4; --purple:#c98aff;
  background: radial-gradient(ellipse 90% 95% at center, #020e07 0%, #010604 70%, #000 100%) #000;
  color: var(--text);
  font-family: 'Press Start 2P', monospace;
  min-height: 100vh;
  min-height: 100dvh;
  position: relative;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.arcade-root *, .arcade-root *::before, .arcade-root *::after {
  box-sizing: border-box;
}
.arcade-root button { font-family: inherit; }

/* Two-tier typography: pixel font for arcade-marquee moments (headers,
   badges, score readouts, button labels), readable monospace for body
   content (questions, options, explanations, paragraphs). Components
   opt into the pixel face with .arc-marquee; body content uses the
   default font set on .arcade-root. */
.arcade-root .arc-marquee {
  font-family: 'Press Start 2P', ui-monospace, monospace;
  letter-spacing: 1px;
  line-height: 1.4;
}
.arcade-root .arc-body,
.arcade-root p {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 15px;
  line-height: 1.65;
  color: var(--text);
  letter-spacing: 0.2px;
}

/* Global focus ring — pixel-style green outline for keyboard users.
   Uses outline so it never disturbs layout. Applied via :focus-visible
   so it never shows for pointer/touch interactions. */
.arcade-root *:focus { outline: none; }
.arcade-root *:focus-visible {
  outline: 2px solid var(--g4);
  outline-offset: 3px;
  box-shadow: 0 0 8px rgba(0,255,65,0.6);
}

/* Respect prefers-reduced-motion. The CRT theme is heavy on motion
   (scanlines roll, screen flickers, text blinks/glitches, mascot
   bounces). For users who request reduced motion we hold the visual
   identity but freeze every animation. */
@media (prefers-reduced-motion: reduce) {
  .arcade-root *, .arcade-root *::before, .arcade-root *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .arcade-root .arcade-scanline { display: none; }
  .arcade-root::after { animation: none; }
}

/* Screen-reader-only utility — exposes labels to AT without altering
   the pixel-perfect visual layout. */
.arcade-root .sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip-to-main-content link — styled as a pixel chip in the arcade
   palette. Hidden off-screen by default, slides in on keyboard focus. */
.arcade-skip-link {
  position: absolute;
  left: 12px;
  top: 12px;
  padding: 8px 14px;
  background: var(--g4);
  color: #000;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  text-decoration: none;
  border: 2px solid #000;
  box-shadow: 0 0 12px rgba(0,255,65,0.6);
  transform: translateY(-200%);
  transition: transform 0.15s ease;
  z-index: 10000;
}
.arcade-skip-link:focus,
.arcade-skip-link:focus-visible {
  transform: translateY(0);
}

/* CRT scanlines — softer than vintage CRT so they texture the screen
   without chewing through small text. Period is 3px so the dark bar
   only occupies ~33% of each row instead of 50%. */
.arcade-root::before {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 999;
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,0.14) 0px, rgba(0,0,0,0.14) 1px,
    transparent 1px, transparent 3px);
}
/* CRT vignette + flicker — gentle darkening at the corners so the
   center stays comfortable to read. */
.arcade-root::after {
  content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1001;
  background: radial-gradient(ellipse at center,
    transparent 55%, rgba(0,0,0,0.18) 85%, rgba(0,0,0,0.45) 100%);
  box-shadow: inset 0 0 140px rgba(0,255,102,0.05);
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
  border: 2px solid var(--g4); padding: 18px 20px; position: relative;
  background: rgba(0, 30, 12, 0.35);
  box-shadow: 0 0 12px rgba(0,255,102,0.18), inset 0 0 24px rgba(0,0,0,0.45);
}
.arcade-root .pbox::before {
  content: ''; position: absolute; inset: 3px;
  border: 1px solid rgba(0,255,102,0.18); pointer-events: none;
}
/* Body text inside a frame box defaults to the readable monospace.
   Components that want pixel-style content should override explicitly. */
.arcade-root .pbox p,
.arcade-root .pbox .arc-body {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 15px; line-height: 1.7; color: var(--text);
  letter-spacing: 0.2px;
}

/* Buttons — pixel marquee face with comfortable hit-targets */
.arcade-root .arc-btn {
  font-family: 'Press Start 2P', monospace; font-size: 11px;
  color: #000; background: var(--g4); border: none;
  padding: 14px 20px; cursor: pointer;
  outline: 2px solid var(--g2); outline-offset: 3px;
  transition: transform 0.08s, background 0.08s, box-shadow 0.15s;
  text-transform: uppercase; letter-spacing: 1.5px;
  line-height: 1.4;
}
.arcade-root .arc-btn:hover:not(:disabled) {
  background: var(--g5); transform: translateY(-2px);
  box-shadow: 0 0 16px rgba(0,255,102,0.55);
}
.arcade-root .arc-btn:active:not(:disabled) { transform: translateY(1px); }
.arcade-root .arc-btn:disabled { opacity: 0.4; cursor: default; }
.arcade-root .arc-btn-ghost {
  background: transparent; color: var(--g4); border: 2px solid var(--g4); outline: none;
  text-shadow: 0 0 6px rgba(0,255,102,0.4);
}
.arcade-root .arc-btn-ghost:hover:not(:disabled) {
  background: rgba(0,255,102,0.12); color: var(--g5); box-shadow: 0 0 12px rgba(0,255,102,0.35);
}
.arcade-root .arc-btn-sm { font-size: 9px; padding: 10px 14px; letter-spacing: 1.2px; }

/* Progress bars */
.arcade-root .pbar-wrap { height: 10px; background: var(--g1); border: 2px solid var(--g3); }
.arcade-root .pbar-fill { height: 100%; background: var(--g4); transition: width 0.4s; box-shadow: 0 0 6px var(--g4); }

/* Option buttons — body font, bigger hit target, brighter foreground */
.arcade-root .opt-btn {
  display: flex; align-items: flex-start; width: 100%;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 15px; line-height: 1.55;
  text-align: left; background: rgba(0,30,12,0.25); color: var(--text);
  border: 2px solid var(--g2); padding: 14px 16px;
  cursor: pointer; margin-bottom: 10px;
  transition: border-color 0.12s, background 0.12s, transform 0.08s, box-shadow 0.15s;
  letter-spacing: 0.2px;
}
.arcade-root .opt-btn:hover:not(:disabled) {
  border-color: var(--g4); background: rgba(0,255,102,0.08);
  box-shadow: 0 0 10px rgba(0,255,102,0.2);
}
.arcade-root .opt-btn.selected { border-color: var(--g4); background: rgba(0,255,102,0.14); }
.arcade-root .opt-btn.correct  { border-color: var(--g4); background: var(--g4); color: #061a0d; font-weight: 500; }
.arcade-root .opt-btn.wrong    { border-color: var(--red); background: rgba(255,90,90,0.16); color: #ffd4d4; }
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
  /* Extra top padding clears the fixed CLASSIC toggle button (≈50px tall at top:14px) */
  .arcade-stage { padding: 56px 10px calc(48px + env(safe-area-inset-bottom)); }
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

/* Title-screen CLASSIC CTA hover — inverts to gold-fill,
   amps the halo, lifts, and spins the ◐ icon to telegraph the switch. */
.arcade-root .arc-classic-cta {
  transition: background 0.15s ease, color 0.15s ease,
              transform 0.12s ease, box-shadow 0.18s ease, filter 0.18s ease;
}
.arcade-root .arc-classic-cta-icon {
  display: inline-block;
  transition: transform 0.4s ease;
}
.arcade-root .arc-classic-cta:hover {
  background: var(--gold) !important;
  color: #000 !important;
  transform: translateY(-2px);
  box-shadow:
    0 0 32px rgba(255,176,0,0.85),
    0 0 64px rgba(255,176,0,0.35),
    inset 0 0 14px rgba(255,255,255,0.25) !important;
  filter: brightness(1.05);
}
.arcade-root .arc-classic-cta:hover .arc-classic-cta-icon {
  transform: rotate(180deg);
}
.arcade-root .arc-classic-cta:active {
  transform: translateY(0);
}

/* Arcade top nav — mirrors the classic Header layout in pixel style */
.arcade-root .arc-header {
  position: relative;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 12px;
  padding: 12px 18px;
  background: linear-gradient(180deg, #001a00 0%, #000800 100%);
  border-bottom: 2px solid var(--g3);
  box-shadow: inset 0 0 16px rgba(0,255,65,0.12);
}
.arcade-root .arc-header-logo {
  display: inline-flex;
  align-items: baseline;
  gap: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px 6px;
  font-family: 'Press Start 2P', monospace;
  color: var(--g4);
  text-shadow: 0 0 6px rgba(0,255,65,0.5);
  flex-shrink: 0;
}
.arcade-root .arc-header-logo-main {
  font-size: 16px;
  letter-spacing: 3px;
}
.arcade-root .arc-header-logo-sub {
  font-size: 9px;
  letter-spacing: 3px;
  color: var(--gold);
  text-shadow: 0 0 4px rgba(255,176,0,0.5);
}
.arcade-root .arc-header-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}
/* Mobile: stack logo on top, nav below — mirrors the classic header's
   wrap behavior so the ARCADE toggle stays on-screen at narrow widths. */
@media (max-width: 560px) {
  .arcade-root .arc-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px 12px;
  }
  .arcade-root .arc-header-nav {
    width: 100%;
    justify-content: space-between;
    gap: 4px;
    flex-wrap: nowrap;
  }
  .arcade-root .arc-nav-btn {
    flex: 1 1 auto;
    min-width: 0;
    padding: 8px 4px;
    letter-spacing: 1.2px;
    text-align: center;
  }
  /* Theme switch becomes icon-only on phones so the nav row stays
     within the viewport. The pill toggle keeps state visible; the
     "ARCADE" word is dropped since the same word is already in the
     "▶ ARCADE" CLASSIC CTA context. */
  .arcade-root .arcade-theme-switch {
    flex: 0 0 auto;
    gap: 0;
    padding: 6px 6px;
  }
  .arcade-root .arcade-theme-switch-label {
    display: none;
  }
}
.arcade-root .arc-nav-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  padding: 8px 12px;
  background: transparent;
  color: var(--g3);
  border: 1px solid transparent;
  cursor: pointer;
  transition: color 0.12s ease, background 0.12s ease,
              border-color 0.12s ease, text-shadow 0.12s ease,
              transform 0.08s ease;
}
.arcade-root .arc-nav-btn:hover {
  color: var(--g4);
  border-color: var(--g2);
  background: rgba(0,255,65,0.06);
  text-shadow: 0 0 6px rgba(0,255,65,0.5);
}
.arcade-root .arc-nav-btn:active {
  transform: translateY(1px);
}
.arcade-root .arc-nav-btn.is-active {
  color: #000;
  background: var(--g4);
  border-color: var(--g4);
  box-shadow: 0 0 10px rgba(0,255,65,0.6), inset 0 0 0 1px #00ff41;
  text-shadow: none;
}

/* Theme toggle switch — pill-shaped track with a sliding thumb.
   On state = arcade (current); hover hints off (slide left → classic). */
.arcade-theme-switch {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--g4);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}
.arcade-theme-switch-label {
  line-height: 1;
}
.arcade-theme-switch-track {
  position: relative;
  display: inline-block;
  width: 32px;
  height: 18px;
  border-radius: 999px;
  background: var(--g4);
  border: 1px solid var(--g4);
  box-shadow: 0 0 10px rgba(0,255,65,0.55);
  transition: background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  flex-shrink: 0;
}
.arcade-theme-switch-thumb {
  position: absolute;
  top: 50%;
  left: 16px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #000;
  transform: translateY(-50%);
  box-shadow: 0 0 4px rgba(0,0,0,0.6);
  transition: left 0.2s ease, background 0.18s ease, box-shadow 0.18s ease;
}
.arcade-theme-switch:hover {
  color: var(--g3);
  border-color: rgba(0,170,0,0.4);
  background: rgba(0,255,65,0.04);
}
.arcade-theme-switch:hover .arcade-theme-switch-track {
  background: var(--g1);
  border-color: var(--g2);
  box-shadow: none;
}
.arcade-theme-switch:hover .arcade-theme-switch-thumb {
  left: 2px;
  background: var(--g3);
  box-shadow: none;
}
.arcade-theme-switch:focus-visible {
  outline: 2px solid var(--g4);
  outline-offset: 2px;
}

/* Arcade splash / loading state — used by App while progress is hydrating.
   Pixel-art "BOOTING" plate with a blinking caret to match the theme. */
.arcade-splash {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: var(--g4);
  font-family: 'Press Start 2P', monospace;
  z-index: 9999;
}
.arcade-splash::before {
  content: '';
  position: fixed; inset: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg,
    rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 1px,
    transparent 1px, transparent 2px);
}
.arcade-splash-inner {
  position: relative;
  z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  text-align: center;
}
.arcade-splash-mark {
  font-size: 28px;
  letter-spacing: 6px;
  color: var(--g4);
  text-shadow: 0 0 4px #00ff41, 0 0 12px #00ff41, 0 0 24px rgba(0,255,65,0.6), 0 4px 0 #003300;
}
.arcade-splash-sub {
  font-size: 8px;
  letter-spacing: 4px;
  color: var(--gold);
  text-shadow: 0 0 6px rgba(255,176,0,0.5);
}
.arcade-splash-status {
  font-size: 7px;
  letter-spacing: 3px;
  color: var(--g3);
  margin-top: 8px;
}
.arcade-splash-caret {
  display: inline-block;
  width: 7px;
  height: 10px;
  background: var(--g4);
  margin-left: 4px;
  vertical-align: middle;
  animation: arcBlink 1s step-end infinite;
}
@media (prefers-reduced-motion: reduce) {
  .arcade-splash-caret { animation: none; }
}
`;
