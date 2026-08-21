import { useEffect, useState } from 'react';

/** SSR-safe: starts `false` and syncs to the real match after mount, same hydration-safety shape as `useTheme`'s `prefers-color-scheme` read. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
