import { useCallback, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeColor, type ThemeMode } from '@industry/tokens';

export type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'industry-theme';

function getSystemTheme(): ThemeMode {
  return Appearance.getColorScheme() === 'light' ? 'light' : 'dark';
}

/**
 * Reads the saved preference (falling back to the OS color scheme),
 * persists changes to AsyncStorage, and resolves the current `color`
 * token set. Static `import { color } from '@industry/tokens'` (used by
 * every core component today) stays dark-only — components must switch
 * to `useTheme().colors` to become theme-reactive.
 */
export function useTheme(): {
  theme: ThemeMode;
  preference: ThemePreference;
  colors: (typeof themeColor)[ThemeMode];
  setTheme: (next: ThemePreference) => void;
} {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [theme, setThemeState] = useState<ThemeMode>(() => getSystemTheme());

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

  return { theme, preference, colors: themeColor[theme], setTheme };
}
