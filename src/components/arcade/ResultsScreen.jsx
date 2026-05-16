import React from 'react';
import { CONCEPTS } from '../../data/concepts.js';
import { masteryForConcept } from '../../lib/progress.js';
import { Mascot } from './Mascot.jsx';
import { AchievementBadge } from './AchievementBadge.jsx';

export function ResultsScreen({ result, conceptId, progress, onPlayAgain, onBack, onHome }) {
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
    <div className="arc-scan-in" style={{ textAlign: 'center' }} role="region" aria-labelledby="results-heading" aria-live="polite">
      <h1 id="results-heading" style={{ fontSize: 10, letterSpacing: 3, margin: '0 0 4px', color: 'var(--g3)', fontWeight: 400 }}>{headerLabel}</h1>
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
          <div
            style={{ margin: '10px 0', fontSize: 18 }}
            role="img"
            aria-label={`${stars} of 3 stars earned`}
          >
            {Array.from({ length: 3 }, (_, i) => (
              <span key={i} aria-hidden="true" style={{ color: i < stars ? 'var(--gold)' : 'var(--g2)', marginRight: 4 }}>★</span>
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
        <button className="arc-btn" style={{ width: '100%', padding: 12, fontSize: 9 }} onClick={onPlayAgain} aria-label="Play again">
          <span aria-hidden="true">↺ </span>PLAY AGAIN
        </button>
        <button className="arc-btn arc-btn-ghost" style={{ width: '100%', padding: 10, fontSize: 8 }} onClick={onBack} aria-label="Back to stage select">
          <span aria-hidden="true">◀ </span>STAGE SELECT
        </button>
        <button className="arc-btn arc-btn-ghost" style={{ width: '100%', padding: 10, fontSize: 8 }} onClick={onHome} aria-label="Return to title screen">
          <span aria-hidden="true">⌂ </span>TITLE
        </button>
      </div>
    </div>
  );
}
