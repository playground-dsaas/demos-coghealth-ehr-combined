import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'coghealth_theme';

const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'light';
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return darkQuery.matches ? 'dark' : 'light';
  return preference;
}

function apply(theme: ResolvedTheme) {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.style.colorScheme = theme;
}

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
  const preference = readPreference();
  const resolved = resolve(preference);
  apply(resolved);

  darkQuery.addEventListener('change', () => {
    if (get().preference !== 'system') return;
    const next = resolve('system');
    apply(next);
    set({ resolved: next });
  });

  return {
    preference,
    resolved,
    setPreference: (next) => {
      localStorage.setItem(THEME_STORAGE_KEY, next);
      const nextResolved = resolve(next);
      apply(nextResolved);
      set({ preference: next, resolved: nextResolved });
    },
    toggle: () => get().setPreference(get().resolved === 'dark' ? 'light' : 'dark'),
  };
});
