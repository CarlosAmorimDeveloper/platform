'use client';

import { useCallback, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'vuotto-theme';

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
}

function applyTheme(theme: ResolvedTheme) {
  // Dark is the unscoped default in tokens/colors.css — only `light` needs
  // the attribute. Nesting `data-theme="light"` inside a dark subtree (or
  // vice versa, by setting it on a descendant) works from CSS alone; this
  // hook only ever touches the document root.
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/**
 * Manages the app-root theme: reads the saved preference (falling back to
 * `prefers-color-scheme`), persists changes, and keeps the document root's
 * `data-theme` attribute in sync.
 */
export function useTheme() {
  const [preference, setPreference] = useState<ThemePreference>(() => readStoredPreference());
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');

  useEffect(() => {
    const resolved = preference === 'system' ? getSystemTheme() : preference;
    setResolvedTheme(resolved);
    applyTheme(resolved);
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return;
    const media = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      const resolved = getSystemTheme();
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next);
    if (next === 'system') {
      window.localStorage.removeItem(STORAGE_KEY);
    } else {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  return { theme: resolvedTheme, preference, setTheme };
}
