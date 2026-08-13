import { render, screen } from '../../test-utils';
import { AppStack } from './AppStack';

// Home (via useAuth) needs an AuthProvider in the tree — stub the hook
// directly so this test stays focused on routing, not auth state.
jest.mock('../../context/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false, logout: jest.fn() }),
}));

// FormEntry (via formsService) imports the real firebase.ts, which calls
// getReactNativePersistence eagerly at module load — mock it so importing
// AppStack doesn't try to initialize a real Firebase app in tests.
jest.mock('../../services/firebase', () => ({ db: {}, auth: {} }));

describe('AppStack', () => {
  it('renders Home as the initial route', () => {
    render(<AppStack />);

    expect(screen.getByText('Home')).toBeTruthy();
  });
});
