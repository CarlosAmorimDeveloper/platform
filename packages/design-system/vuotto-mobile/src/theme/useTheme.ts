import { useCallback, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { semanticColors, type SemanticColors, type ThemeMode } from '@vuotto/tokens';

export type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'vuotto-theme';

function getSystemTheme(): ThemeMode {
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

/**
 * RN has no CSS cascade for `useTheme` to hook into the way the web version
 * does (toggling a `data-theme` attribute and letting `[data-theme="light"]`
 * take over) — there's no attribute selector equivalent, so this hook is the
 * source of the resolved color object itself. Consumers read `colors.*`
 * directly in their `StyleSheet`, not a token name RN doesn't understand.
 */
export function useTheme(): {
  theme: ThemeMode;
  preference: ThemePreference;
  colors: SemanticColors;
  setTheme: (next: ThemePreference) => void;
} {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [theme, setThemeState] = useState<ThemeMode>(() => getSystemTheme());

  // AsyncStorage is async-only (unlike localStorage) — the stored
  // preference can't be read synchronously on first render, so this starts
  // from `system` and swaps in the saved preference once it loads. That's a
  // one-frame flash of the wrong theme on cold start if the user chose a
  // preference that differs from their OS setting; there's no AsyncStorage
  // API that avoids it.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark') setPreference(stored);
    });
  }, []);

  useEffect(() => {
    setThemeState(preference === 'system' ? getSystemTheme() : preference);
  }, [preference]);

  useEffect(() => {
    if (preference !== 'system') return;
    const subscription = Appearance.addChangeListener(() => {
      setThemeState(getSystemTheme());
    });
    return () => subscription.remove();
  }, [preference]);

  const setTheme = useCallback((next: ThemePreference) => {
    setPreference(next);
    if (next === 'system') {
      void AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      void AsyncStorage.setItem(STORAGE_KEY, next);
    }
  }, []);

  return { theme, preference, colors: semanticColors[theme], setTheme };
}
