import { useState } from 'react';

export function AchievementBadge({ icon, title, desc, hint, unlocked = false, isNew = false }) {
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
