import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect, useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'coghealth_theme' }
  )
);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeSystemDark(cb: () => void) {
  const mql = window.matchMedia(DARK_QUERY);
  mql.addEventListener('change', cb);
  return () => mql.removeEventListener('change', cb);
}

function getSystemDark() {
  return window.matchMedia(DARK_QUERY).matches;
}

export function useResolvedTheme(): 'light' | 'dark' {
  const theme = useThemeStore((s) => s.theme);
  const systemDark = useSyncExternalStore(subscribeSystemDark, getSystemDark);
  return theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
}

export function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') {
    return getSystemDark() ? 'dark' : 'light';
  }
  return pref;
}

export function useThemeEffect() {
  const resolved = useResolvedTheme();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [resolved]);
}
