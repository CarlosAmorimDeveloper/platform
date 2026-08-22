'use client';

import { useTheme } from '@vuotto/web';

export function ThemeRegistry({ children }: { children: React.ReactNode }) {
  // Activates system/stored theme detection — applies `data-theme` on
  // `<html>` as a side effect. @vuotto/web has no ThemeProvider; colors come
  // from CSS custom properties loaded globally in globals.css.
  useTheme();

  return <>{children}</>;
}
