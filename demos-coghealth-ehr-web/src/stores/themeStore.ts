import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'coghealth_theme';
const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

function readPreference(): ThemePreference {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'dark' || stored === 'system' ? stored : 'light';
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === 'system') return darkQuery.matches ? 'dark' : 'light';
  return preference;
}

function applyTheme(theme: ResolvedTheme) {
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

const initialPreference = readPreference();

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: initialPreference,
  resolved: resolve(initialPreference),
  setPreference: (preference) => {
    localStorage.setItem(STORAGE_KEY, preference);
    const resolved = resolve(preference);
    applyTheme(resolved);
    set({ preference, resolved });
  },
  toggle: () => get().setPreference(get().resolved === 'dark' ? 'light' : 'dark'),
}));

applyTheme(useThemeStore.getState().resolved);

darkQuery.addEventListener('change', () => {
  const { preference } = useThemeStore.getState();
  if (preference !== 'system') return;
  const resolved = resolve(preference);
  applyTheme(resolved);
  useThemeStore.setState({ resolved });
});
