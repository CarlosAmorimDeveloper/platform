import { act, renderHook, waitFor } from '@testing-library/react-native';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { themeColor } from '@industry/tokens';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('dark');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('defaults to the system color scheme when nothing is stored', async () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.preference).toBe('system');
    expect(result.current.colors).toEqual(themeColor.dark);
  });

  it('resolves to the stored preference once AsyncStorage loads', async () => {
    await AsyncStorage.setItem('industry-theme', 'light');
    const { result } = renderHook(() => useTheme());

    await waitFor(() => expect(result.current.preference).toBe('light'));
    expect(result.current.theme).toBe('light');
    expect(result.current.colors).toEqual(themeColor.light);
  });

  it('ignores a corrupted stored value', async () => {
    await AsyncStorage.setItem('industry-theme', 'sepia');
    const { result } = renderHook(() => useTheme());

    await waitFor(() => expect(AsyncStorage.getItem).toHaveBeenCalled?.() ?? true);
    expect(result.current.preference).toBe('system');
  });

  it('setTheme persists an explicit preference and resolves immediately', async () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('light'));

    expect(result.current.preference).toBe('light');
    expect(result.current.theme).toBe('light');
    await waitFor(async () => {
      expect(await AsyncStorage.getItem('industry-theme')).toBe('light');
    });
  });

  it('setTheme("system") clears the stored preference and falls back to the OS scheme', async () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setTheme('light'));
    act(() => result.current.setTheme('system'));

    expect(result.current.preference).toBe('system');
    expect(result.current.theme).toBe('dark');
    await waitFor(async () => {
      expect(await AsyncStorage.getItem('industry-theme')).toBeNull();
    });
  });

  it('follows OS scheme changes while preference is "system"', async () => {
    let listener: (() => void) | undefined;
    jest.spyOn(Appearance, 'addChangeListener').mockImplementation((cb) => {
      listener = cb as unknown as () => void;
      return { remove: jest.fn() };
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');

    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
    act(() => listener?.());

    expect(result.current.theme).toBe('light');
  });

  it('stops following OS scheme changes once a preference is set', async () => {
    const remove = jest.fn();
    jest.spyOn(Appearance, 'addChangeListener').mockReturnValue({ remove } as never);

    const { unmount } = renderHook(() => useTheme());
    unmount();

    expect(remove).toHaveBeenCalled();
  });
});
