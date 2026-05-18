#!/usr/bin/env node
/**
 * Renders scripts/og-image.html → public/og-image.png at 1200×630.
 *
 * The HTML mirrors the arcade title marquee (Press Start 2P, green CRT
 * glow, mascot sprite). LinkedIn and most social platforms prefer PNG
 * over SVG for previews, so we screenshot via headless Chrome.
 *
 * Puppeteer is a transitive dependency via md-to-pdf, so no extra
 * installs needed. Run with: `node scripts/build-og-image.mjs`.
 */

import puppeteer from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HTML_PATH = resolve(__dirname, 'og-image.html');
const OG_OUT = resolve(__dirname, '..', 'public', 'og-image.png');
const APPLE_OUT = resolve(__dirname, '..', 'public', 'apple-touch-icon.png');

// Inline 180×180 HTML for the apple-touch-icon. iOS expects a square,
// non-transparent PNG; the mascot sits on a black tile with a green
// glow halo so it stays legible at home-screen size.
const APPLE_HTML = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  html, body { margin: 0; width: 180px; height: 180px; background: #000; }
  .tile {
    width: 180px; height: 180px;
    background: radial-gradient(circle at center, #001a00 0%, #000 70%);
    display: flex; align-items: center; justify-content: center;
    box-shadow: inset 0 0 22px rgba(0,255,65,0.35);
  }
  svg { image-rendering: pixelated; display: block;
    filter: drop-shadow(0 0 6px rgba(0,255,65,0.55)); }
</style></head><body><div class="tile">
  <svg width="140" height="140" viewBox="0 0 16 16" shape-rendering="crispEdges">
    <rect x="3" y="3" width="10" height="9" fill="#00aa00"/>
    <rect x="4" y="5" width="3" height="3" fill="#003300"/>
    <rect x="9" y="5" width="3" height="3" fill="#003300"/>
    <rect x="5" y="5" width="2" height="2" fill="#00ff41"/>
    <rect x="10" y="5" width="2" height="2" fill="#00ff41"/>
    <rect x="4" y="12" width="8" height="4" fill="#004400"/>
    <rect x="7" y="12" width="2" height="4" fill="#ccffdd"/>
    <rect x="7" y="13" width="2" height="3" fill="#00ff41"/>
    <rect x="7" y="13" width="1" height="1" fill="#ccffdd"/>
    <rect x="5" y="12" width="2" height="2" fill="#ccffdd"/>
    <rect x="4" y="12" width="2" height="3" fill="#004400"/>
    <rect x="9" y="12" width="2" height="2" fill="#ccffdd"/>
    <rect x="10" y="12" width="2" height="3" fill="#004400"/>
    <rect x="2" y="12" width="2" height="3" fill="#004400"/>
    <rect x="12" y="12" width="2" height="3" fill="#004400"/>
    <rect x="2" y="14" width="2" height="1" fill="#ccffdd"/>
    <rect x="12" y="14" width="2" height="1" fill="#ccffdd"/>
    <rect x="5" y="15" width="2" height="1" fill="#002200"/>
    <rect x="9" y="15" width="2" height="1" fill="#002200"/>
  </svg>
</div></body></html>`;

async function main() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    // 1. OG image — 1200×630 marquee shot.
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
      await page.goto(`file://${HTML_PATH}`, { waitUntil: 'networkidle0' });
      // Give Press Start 2P a beat to finish loading after networkidle.
      await page.evaluateHandle('document.fonts.ready');
      await page.screenshot({
        path: OG_OUT,
        type: 'png',
        clip: { x: 0, y: 0, width: 1200, height: 630 },
      });
      console.log(`og-image: wrote ${OG_OUT}`);
    }

    // 2. apple-touch-icon — 180×180 mascot tile.
    {
      const page = await browser.newPage();
      await page.setViewport({ width: 180, height: 180, deviceScaleFactor: 2 });
      await page.setContent(APPLE_HTML, { waitUntil: 'networkidle0' });
      await page.screenshot({
        path: APPLE_OUT,
        type: 'png',
        clip: { x: 0, y: 0, width: 180, height: 180 },
      });
      console.log(`apple-touch-icon: wrote ${APPLE_OUT}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
