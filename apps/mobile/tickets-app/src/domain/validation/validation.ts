export function passwordMinLengthError(password: string): string | undefined {
  return password.length > 0 && password.length < 6 ? 'Mínimo de 6 caracteres' : undefined;
}
