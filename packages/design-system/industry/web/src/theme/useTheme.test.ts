import { act, renderHook } from '@testing-library/react';
import { useTheme } from './useTheme';

function mockMatchMedia(matches: boolean) {
  let changeListener: (() => void) | undefined;
  const mql = {
    matches,
    media: '(prefers-color-scheme: light)',
    addEventListener: jest.fn((event: string, cb: () => void) => {
      if (event === 'change') changeListener = cb;
    }),
    removeEventListener: jest.fn(),
  };
  jest.spyOn(window, 'matchMedia').mockReturnValue(mql as unknown as MediaQueryList);
  return { fireChange: () => changeListener?.(), mql };
}

describe('useTheme', () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('defaults to the system preference and applies no attribute for dark', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('system');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
  });

  it('resolves to light and sets data-theme when the system prefers light', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('reads a previously stored preference on mount', () => {
    mockMatchMedia(false);
    window.localStorage.setItem('industry-theme', 'light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('light');
    expect(result.current.theme).toBe('light');
  });

  it('ignores a corrupted stored value and falls back to system', () => {
    mockMatchMedia(false);
    window.localStorage.setItem('industry-theme', 'sepia');

    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('system');
  });

  it('setTheme persists an explicit preference and updates the attribute', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('light'));

    expect(result.current.preference).toBe('light');
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    expect(window.localStorage.getItem('industry-theme')).toBe('light');
  });

  it('setTheme("system") clears storage and removes the attribute for a dark OS', () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('light'));
    act(() => result.current.setTheme('system'));

    expect(result.current.preference).toBe('system');
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(window.localStorage.getItem('industry-theme')).toBeNull();
  });

  it('follows OS preference changes while preference is "system"', () => {
    const { fireChange } = mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');

    mockMatchMedia(true);
    act(() => fireChange());

    expect(result.current.theme).toBe('light');
  });

  it('stops listening for OS changes once an explicit preference is set', () => {
    const { mql } = mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(mql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    act(() => result.current.setTheme('light'));

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});
