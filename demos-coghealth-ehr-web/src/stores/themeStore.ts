import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useEffect } from 'react';

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

export function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

export function useThemeEffect() {
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    const apply = () => {
      document.documentElement.classList.toggle('dark', resolveTheme(theme) === 'dark');
    };
    apply();
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', apply);
    return () => mql.removeEventListener('change', apply);
  }, [theme]);
}
