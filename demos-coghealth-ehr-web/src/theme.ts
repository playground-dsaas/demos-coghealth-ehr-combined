import { useSyncExternalStore } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export const SETTINGS_STORAGE_KEY = 'coghealth_settings';

interface ThemeSnapshot {
  theme: ThemePreference;
  isDark: boolean;
}

const listeners = new Set<() => void>();
const mediaQuery = typeof window === 'undefined'
  ? null
  : window.matchMedia('(prefers-color-scheme: dark)');

let snapshot: ThemeSnapshot = { theme: 'light', isDark: false };
let mediaListenerRegistered = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readSettings(): Record<string, unknown> {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed: unknown = stored ? JSON.parse(stored) : {};
    return isRecord(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function resolveIsDark(theme: ThemePreference): boolean {
  return theme === 'dark' || (theme === 'system' && (mediaQuery?.matches ?? false));
}

function applyTheme(theme: ThemePreference): void {
  const isDark = resolveIsDark(theme);
  snapshot = { theme, isDark };
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }
  listeners.forEach(listener => listener());
}

export function getStoredTheme(): ThemePreference {
  const appearance = readSettings().appearance;
  const theme = isRecord(appearance) ? appearance.theme : undefined;
  return theme === 'dark' || theme === 'system' || theme === 'light' ? theme : 'light';
}

export function setTheme(pref: ThemePreference): void {
  const settings = readSettings();
  const appearance = isRecord(settings.appearance) ? settings.appearance : {};
  settings.appearance = { ...appearance, theme: pref };
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Theme changes still apply when storage is unavailable.
  }
  applyTheme(pref);
}

export function initTheme(): void {
  if (mediaQuery && !mediaListenerRegistered) {
    mediaQuery.addEventListener('change', () => {
      if (snapshot.theme === 'system') applyTheme('system');
    });
    mediaListenerRegistered = true;
  }
  applyTheme(getStoredTheme());
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeSnapshot {
  return snapshot;
}

export function useTheme(): {
  theme: ThemePreference;
  isDark: boolean;
  setTheme: (pref: ThemePreference) => void;
} {
  return {
    ...useSyncExternalStore(subscribe, getSnapshot, getSnapshot),
    setTheme,
  };
}
