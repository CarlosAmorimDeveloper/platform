import { describe, it, expect } from '@jest/globals';
import { formatDate } from './ticket';

describe('formatDate', () => {
  it('formats a Date to pt-BR locale string', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    const result = formatDate(date);
    expect(result).toContain('15');
    expect(result).toContain('01');
    expect(result).toContain('2024');
  });

  it('returns empty string for a null date', () => {
    expect(formatDate(null)).toBe('');
  });
});
