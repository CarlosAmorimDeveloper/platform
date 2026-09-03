import {
  DEFAULT_TIME_FILTER,
  TIME_FILTER_PRESETS,
  isWithinTimeFilter,
  parseDateInput,
} from './timeFilter';

describe('TIME_FILTER_PRESETS', () => {
  it('has 4 presets: todos, últimos 7/30 dias, personalizado', () => {
    expect(TIME_FILTER_PRESETS.map((preset) => preset.value)).toEqual([
      'todos',
      'ultimos_7_dias',
      'ultimos_30_dias',
      'personalizado',
    ]);
  });
});

describe('DEFAULT_TIME_FILTER', () => {
  it('defaults to "todos" with empty custom range', () => {
    expect(DEFAULT_TIME_FILTER).toEqual({ preset: 'todos', customStart: '', customEnd: '' });
  });
});

describe('parseDateInput', () => {
  it('parses a valid dd/mm/aaaa date', () => {
    const date = parseDateInput('15/03/2026');
    expect(date).toEqual(new Date(2026, 2, 15));
  });

  it('returns null for malformed input', () => {
    expect(parseDateInput('2026-03-15')).toBeNull();
    expect(parseDateInput('15/03/26')).toBeNull();
    expect(parseDateInput('')).toBeNull();
    expect(parseDateInput('not a date')).toBeNull();
  });

  it('returns null for a calendar-invalid date (e.g. 31/02)', () => {
    expect(parseDateInput('31/02/2026')).toBeNull();
  });

  it('trims surrounding whitespace', () => {
    expect(parseDateInput('  15/03/2026  ')).toEqual(new Date(2026, 2, 15));
  });
});

describe('isWithinTimeFilter', () => {
  const now = new Date(2026, 2, 20);

  it('always returns true for the "todos" preset, even with a null date', () => {
    expect(isWithinTimeFilter(null, DEFAULT_TIME_FILTER, now)).toBe(true);
    expect(isWithinTimeFilter(new Date(2020, 0, 1), DEFAULT_TIME_FILTER, now)).toBe(true);
  });

  it('returns false for a null date on any non-"todos" preset', () => {
    expect(
      isWithinTimeFilter(null, { preset: 'ultimos_7_dias', customStart: '', customEnd: '' }, now),
    ).toBe(false);
  });

  it('"ultimos_7_dias" includes dates within the last 7 days and excludes older ones', () => {
    const filter = { preset: 'ultimos_7_dias' as const, customStart: '', customEnd: '' };
    expect(isWithinTimeFilter(new Date(2026, 2, 15), filter, now)).toBe(true);
    expect(isWithinTimeFilter(new Date(2026, 2, 10), filter, now)).toBe(false);
  });

  it('"ultimos_30_dias" includes dates within the last 30 days and excludes older ones', () => {
    const filter = { preset: 'ultimos_30_dias' as const, customStart: '', customEnd: '' };
    expect(isWithinTimeFilter(new Date(2026, 1, 25), filter, now)).toBe(true);
    expect(isWithinTimeFilter(new Date(2026, 0, 1), filter, now)).toBe(false);
  });

  describe('"personalizado"', () => {
    it('includes dates within the custom start/end range (inclusive)', () => {
      const filter = {
        preset: 'personalizado' as const,
        customStart: '01/03/2026',
        customEnd: '10/03/2026',
      };
      expect(isWithinTimeFilter(new Date(2026, 2, 5), filter, now)).toBe(true);
      expect(isWithinTimeFilter(new Date(2026, 2, 1), filter, now)).toBe(true);
      expect(isWithinTimeFilter(new Date(2026, 2, 10, 23, 0), filter, now)).toBe(true);
    });

    it('excludes dates before the custom start or after the custom end', () => {
      const filter = {
        preset: 'personalizado' as const,
        customStart: '01/03/2026',
        customEnd: '10/03/2026',
      };
      expect(isWithinTimeFilter(new Date(2026, 1, 28), filter, now)).toBe(false);
      expect(isWithinTimeFilter(new Date(2026, 2, 11), filter, now)).toBe(false);
    });

    it('treats a blank/invalid boundary as unbounded on that side', () => {
      const onlyStart = {
        preset: 'personalizado' as const,
        customStart: '15/03/2026',
        customEnd: '',
      };
      expect(isWithinTimeFilter(new Date(2027, 0, 1), onlyStart, now)).toBe(true);
      expect(isWithinTimeFilter(new Date(2026, 2, 1), onlyStart, now)).toBe(false);

      const onlyEnd = {
        preset: 'personalizado' as const,
        customStart: '',
        customEnd: '15/03/2026',
      };
      expect(isWithinTimeFilter(new Date(2020, 0, 1), onlyEnd, now)).toBe(true);
      expect(isWithinTimeFilter(new Date(2026, 3, 1), onlyEnd, now)).toBe(false);
    });
  });
});
