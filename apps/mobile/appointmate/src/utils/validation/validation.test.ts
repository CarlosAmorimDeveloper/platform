import { emailFormatError, passwordMinLengthError } from './validation';

describe('emailFormatError', () => {
  it('returns undefined for an empty email (no error until the user types something)', () => {
    expect(emailFormatError('')).toBeUndefined();
  });

  it('returns undefined for a valid email', () => {
    expect(emailFormatError('user@example.com')).toBeUndefined();
  });

  it('returns an error for an email missing the @', () => {
    expect(emailFormatError('userexample.com')).toBe('E-mail inválido');
  });

  it('returns an error for an email missing the domain', () => {
    expect(emailFormatError('user@')).toBe('E-mail inválido');
  });

  it('returns an error for an email missing the top-level domain', () => {
    expect(emailFormatError('user@example')).toBe('E-mail inválido');
  });

  it('returns an error for an email with spaces', () => {
    expect(emailFormatError('user name@example.com')).toBe('E-mail inválido');
  });
});

describe('passwordMinLengthError', () => {
  it('returns undefined for an empty password (no error until the user types something)', () => {
    expect(passwordMinLengthError('')).toBeUndefined();
  });

  it('returns undefined for a password with 6 or more characters', () => {
    expect(passwordMinLengthError('secret123')).toBeUndefined();
  });

  it('returns an error for a password shorter than 6 characters', () => {
    expect(passwordMinLengthError('abc12')).toBe('Mínimo de 6 caracteres');
  });
});
