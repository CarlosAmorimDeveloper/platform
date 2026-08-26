import { describe, it, expect } from '@jest/globals';
import { passwordMinLengthError } from './validation';

describe('passwordMinLengthError', () => {
  it('returns undefined for an empty password', () => {
    expect(passwordMinLengthError('')).toBeUndefined();
  });

  it('returns undefined for a password with 6 or more characters', () => {
    expect(passwordMinLengthError('123456')).toBeUndefined();
  });

  it('returns an error message for a non-empty password shorter than 6 characters', () => {
    expect(passwordMinLengthError('123')).toBe('Mínimo de 6 caracteres');
  });
});
