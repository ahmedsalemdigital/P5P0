const THEME_KEY = 'pspo-theme';

export const THEME = {
  CLASSIC: 'classic',
  ARCADE: 'arcade',
};

const DEFAULT_THEME = THEME.ARCADE;

export function loadTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return t === THEME.CLASSIC || t === THEME.ARCADE ? t : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

export function saveTheme(t) {
  try { localStorage.setItem(THEME_KEY, t); } catch {}
}
