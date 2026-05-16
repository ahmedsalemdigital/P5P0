import React from 'react';

export function Header({ onNav, currentView, onToggleTheme }) {
  const navItems = [
    ['title', 'Title'],
    ['home', 'Concepts'],
    ['review', 'Review'],
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid var(--border)',
        padding: '14px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
        background: 'var(--bg)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
      }}
    >
      <button
        onClick={() => onNav('title')}
        aria-label="PSPO·I Trainer — return to title"
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          textAlign: 'left',
          padding: '4px 6px',
          borderRadius: 8,
        }}
      >
        <span
          className="display"
          style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.022em' }}
        >
          PSPO<span className="accent" style={{ fontStyle: 'italic' }}>·I</span>
        </span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 400,
            letterSpacing: '-0.156px',
            color: 'var(--text-dim)',
          }}
        >
          Trainer
        </span>
      </button>

      <nav aria-label="Primary" className="pspo-primary-nav" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {navItems.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className="nav-item"
            aria-current={currentView === id ? 'page' : undefined}
          >
            {label}
          </button>
        ))}

        <button
          onClick={onToggleTheme}
          className="theme-toggle-switch"
          role="switch"
          aria-checked="false"
          title="Switch to arcade theme"
          aria-label="Switch to arcade theme"
        >
          <span className="theme-toggle-switch-label">Arcade</span>
          <span className="theme-toggle-switch-track" aria-hidden="true">
            <span className="theme-toggle-switch-thumb" />
          </span>
        </button>
      </nav>
    </header>
  );
}
