const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function emailFormatError(email: string): string | undefined {
  return email.length > 0 && !EMAIL_REGEX.test(email) ? 'E-mail inválido' : undefined;
}

export function passwordMinLengthError(password: string): string | undefined {
  return password.length > 0 && password.length < 6 ? 'Mínimo de 6 caracteres' : undefined;
}
