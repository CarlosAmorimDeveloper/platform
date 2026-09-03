import { render, screen } from '../../test-utils';
import { AuthProvider } from '../../context/AuthContext';
import { AppStack } from './AppStack';

jest.mock('../../services/authService', () => ({
  subscribeToAuthChanges: (callback: (user: null) => void) => {
    callback(null);
    return () => {};
  },
}));

jest.mock('../../services/firebase', () => ({ db: {}, auth: {} }));

jest.mock('expo-print', () => ({ printToFileAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));

describe('AppStack', () => {
  it('renders Home as the initial route', () => {
    render(
      <AuthProvider>
        <AppStack />
      </AuthProvider>,
    );

    expect(screen.getByTestId('home-loading')).toBeTruthy();
  });
});
