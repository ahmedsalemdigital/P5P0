import React from 'react';

export function Header({ stats, onNav, currentView, onToggleTheme }) {
  return (
    <header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
      <button onClick={() => onNav('home')} style={{ display: 'flex', alignItems: 'baseline', gap: 12, textAlign: 'left' }}>
        <span className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>PSPO<span className="accent" style={{ fontStyle: 'italic' }}>·I</span></span>
        <span className="mono faint" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Trainer</span>
      </button>
      <nav style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {[
          ['home', 'Concepts'],
          ['review', 'Review'],
          ['stats', 'Stats'],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="mono"
            style={{
              padding: '6px 12px',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: currentView === id ? 'var(--accent)' : 'var(--text-dim)',
              border: `1px solid ${currentView === id ? 'var(--accent-dim)' : 'transparent'}`,
              background: currentView === id ? 'var(--accent-soft)' : 'transparent',
            }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={onToggleTheme}
          className="theme-toggle-classic"
          title="Switch to arcade theme"
          aria-label="Switch to arcade theme"
        >
          <span className="theme-toggle-icon">◉</span>
          <span>ARCADE</span>
        </button>
      </nav>
    </header>
  );
}
