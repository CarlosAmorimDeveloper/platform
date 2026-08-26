import { sanitizeTaskTitle, isValidTaskTitle } from './task';

describe('sanitizeTaskTitle', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitizeTaskTitle('  Buy milk  ')).toBe('Buy milk');
  });

  it('returns an empty string for whitespace-only input', () => {
    expect(sanitizeTaskTitle('   ')).toBe('');
  });
});

describe('isValidTaskTitle', () => {
  it('is true for a non-empty title', () => {
    expect(isValidTaskTitle('Buy milk')).toBe(true);
  });

  it('is true for a title with surrounding whitespace', () => {
    expect(isValidTaskTitle('  Buy milk  ')).toBe(true);
  });

  it('is false for an empty string', () => {
    expect(isValidTaskTitle('')).toBe(false);
  });

  it('is false for a whitespace-only string', () => {
    expect(isValidTaskTitle('   ')).toBe(false);
  });
});
