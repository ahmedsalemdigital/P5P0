import React from 'react';

export function MasteryDots({ coverage, questionCount }) {
  const filled = Math.round(coverage * 5);
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className={`tick ${i < filled ? 'filled' : ''}`} />
      ))}
    </div>
  );
}
