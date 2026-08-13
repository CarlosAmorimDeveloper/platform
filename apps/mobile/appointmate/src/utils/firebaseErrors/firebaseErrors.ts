import { FirebaseError } from 'firebase/app';

export function mapFirebaseAuthError(err: unknown): string {
  if (err instanceof FirebaseError) {
    switch (err.code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'E-mail ou senha incorretos.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Sem conexão. Verifique sua internet.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
    }
  }
  return 'Ocorreu um erro inesperado.';
}
