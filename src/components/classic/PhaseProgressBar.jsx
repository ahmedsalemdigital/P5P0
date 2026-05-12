import React from 'react';

export function PhaseProgressBar({ phases, phaseIdx, questionIdx, onJump, answered, bookmarks, uniform }) {
  const phaseColor = (phase) => {
    if (uniform) return 'var(--correct)';
    const d = phase.questions[0]?.difficulty;
    if (d === 'brutal') return 'var(--wrong)';
    if (d === 'scenario') return 'var(--accent)';
    return 'var(--correct)';
  };

  const shapeStyle = (phase, qIdx, pIdx) => {
    const d = phase.questions[0]?.difficulty;
    const isCurrent = pIdx === phaseIdx;
    const isNow = isCurrent && qIdx === questionIdx;
    const qid = phase.questions[qIdx]?.id;
    const isAnswered = !!(answered && qid && answered[qid]);
    const isBookmarked = !!(bookmarks && qid && bookmarks[qid]);
    const color = isBookmarked ? '#ff8c1a' : phaseColor(phase);
    const size = isNow ? 11 : 8;
    const base = {
      width: size, height: size,
      background: color,
      opacity: isNow ? 1 : isAnswered ? 0.85 : isBookmarked ? 0.85 : 0.32,
      transition: 'width 0.15s, height 0.15s, opacity 0.15s',
      boxShadow: isNow ? `0 0 0 3px ${color}50` : 'none',
    };
    if (isBookmarked) return { ...base, clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 50% 70%, 0% 100%)' };
    if (uniform) return { ...base, borderRadius: '50%' };
    if (d === 'scenario') return { ...base, clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)' };
    if (d === 'brutal') return { ...base, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' };
    return { ...base, borderRadius: '50%' };
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
      {phases.map((phase, pIdx) => {
        const offset = phases.slice(0, pIdx).reduce((s, p) => s + p.questions.length, 0);
        return (
          <React.Fragment key={pIdx}>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
              {phase.questions.map((_, qIdx) => (
                <button
                  key={qIdx}
                  type="button"
                  className="pspo-dot"
                  data-tip={`Q${offset + qIdx + 1}`}
                  onClick={onJump ? () => onJump(pIdx, qIdx) : undefined}
                  aria-label={`Go to question ${offset + qIdx + 1}`}
                >
                  <div style={shapeStyle(phase, qIdx, pIdx)} />
                </button>
              ))}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
