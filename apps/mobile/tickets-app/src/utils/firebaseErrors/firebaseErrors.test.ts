import { FirebaseError } from 'firebase/app';
import { mapFirebaseAuthError } from './firebaseErrors';

describe('mapFirebaseAuthError', () => {
  beforeEach(() => jest.clearAllMocks());

  it('maps auth/invalid-credential to login error message', () => {
    const err = new FirebaseError('auth/invalid-credential', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/wrong-password to login error message', () => {
    const err = new FirebaseError('auth/wrong-password', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/user-not-found to login error message', () => {
    const err = new FirebaseError('auth/user-not-found', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail ou senha incorretos.');
  });

  it('maps auth/email-already-in-use to duplicate email message', () => {
    const err = new FirebaseError('auth/email-already-in-use', '');
    expect(mapFirebaseAuthError(err)).toBe('Este e-mail já está cadastrado.');
  });

  it('maps auth/weak-password to password strength message', () => {
    const err = new FirebaseError('auth/weak-password', '');
    expect(mapFirebaseAuthError(err)).toBe('A senha deve ter pelo menos 6 caracteres.');
  });

  it('maps auth/invalid-email to invalid email message', () => {
    const err = new FirebaseError('auth/invalid-email', '');
    expect(mapFirebaseAuthError(err)).toBe('E-mail inválido.');
  });

  it('maps auth/too-many-requests to rate limit message', () => {
    const err = new FirebaseError('auth/too-many-requests', '');
    expect(mapFirebaseAuthError(err)).toBe('Muitas tentativas. Tente novamente mais tarde.');
  });

  it('maps auth/network-request-failed to network error message', () => {
    const err = new FirebaseError('auth/network-request-failed', '');
    expect(mapFirebaseAuthError(err)).toBe('Sem conexão. Verifique sua internet.');
  });

  it('maps unknown firebase error code to generic retry message', () => {
    const err = new FirebaseError('auth/unknown-code', '');
    expect(mapFirebaseAuthError(err)).toBe('Ocorreu um erro. Tente novamente.');
  });

  it('maps non-firebase Error to unexpected error message', () => {
    expect(mapFirebaseAuthError(new Error('plain error'))).toBe('Ocorreu um erro inesperado.');
  });

  it('maps null to unexpected error message', () => {
    expect(mapFirebaseAuthError(null)).toBe('Ocorreu um erro inesperado.');
  });
});
