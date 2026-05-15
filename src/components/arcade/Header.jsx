import React from 'react';

export function Header({ onNav, currentView, onToggleTheme }) {
  const items = [
    ['title', 'Title'],
    ['home', 'Concepts'],
    ['review', 'Review'],
  ];

  return (
    <header className="arc-header">
      <button className="arc-header-logo" onClick={() => onNav('title')} title="Back to title screen">
        <span className="arc-header-logo-main">P5P0</span>
        <span className="arc-header-logo-sub">TRAINER</span>
      </button>
      <nav className="arc-header-nav">
        {items.map(([id, label]) => (
          <button
            key={id}
            onClick={() => onNav(id)}
            className={`arc-nav-btn${currentView === id ? ' is-active' : ''}`}
          >
            {label.toUpperCase()}
          </button>
        ))}
        <button
          onClick={onToggleTheme}
          className="arcade-theme-switch"
          role="switch"
          aria-checked="true"
          title="Switch to classic theme"
          aria-label="Switch to classic theme"
        >
          <span className="arcade-theme-switch-label">ARCADE</span>
          <span className="arcade-theme-switch-track">
            <span className="arcade-theme-switch-thumb" />
          </span>
        </button>
      </nav>
    </header>
  );
}
