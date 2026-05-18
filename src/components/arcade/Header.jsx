import React from 'react';

export function Header({ onNav, currentView, onToggleTheme }) {
  const items = [
    ['title', 'Title'],
    ['home', 'Concepts'],
    ['review', 'Review'],
    ['stats', 'Stats'],
  ];

  return (
    <header className="arc-header">
      <button
        className="arc-header-logo"
        onClick={() => onNav('title')}
        aria-label="P5P0 Trainer — return to title"
      >
        <span className="arc-header-logo-main" aria-hidden="true">P5P0 I</span>
        <span className="arc-header-logo-sub" aria-hidden="true">TRAINER</span>
      </button>
      <nav className="arc-header-nav" aria-label="Primary">
        {items.map(([id, label]) => {
          const isActive = currentView === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className={`arc-nav-btn${isActive ? ' is-active' : ''}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {label.toUpperCase()}
            </button>
          );
        })}
        <button
          onClick={onToggleTheme}
          className="arcade-theme-switch"
          role="switch"
          aria-checked="true"
          title="Switch to classic theme"
          aria-label="Switch to classic theme"
        >
          <span className="arcade-theme-switch-label">ARCADE</span>
          <span className="arcade-theme-switch-track" aria-hidden="true">
            <span className="arcade-theme-switch-thumb" />
          </span>
        </button>
      </nav>
    </header>
  );
}
