import { useState } from 'react';

export function AchievementIcon({ icon, title, hint, unlocked }) {
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
