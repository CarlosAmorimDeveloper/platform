import { render, screen } from '../../test-utils';
import { AuthStack } from './AuthStack';

// Login (via authService) imports the real firebase.ts, which calls
// getReactNativePersistence eagerly at module load — mock it so importing
// AuthStack doesn't try to initialize a real Firebase app in tests.
jest.mock('../../services/firebase', () => ({ auth: {} }));

describe('AuthStack', () => {
  it('renders Login as the initial route', () => {
    render(<AuthStack />);

    expect(screen.getByTestId('login-email-input')).toBeTruthy();
  });
});
