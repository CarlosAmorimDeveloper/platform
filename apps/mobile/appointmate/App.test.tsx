import { render, screen, waitFor } from '@testing-library/react-native';
import { onAuthStateChanged } from 'firebase/auth';
import App from './App';

jest.mock('./src/services/firebase', () => ({
  auth: {},
  db: {},
}));

jest.mock('firebase/auth', () => ({
  onAuthStateChanged: jest.fn(),
  signOut: jest.fn(),
}));

// Home fetches the user's forms on mount — stub it so the authenticated-user
// test renders Home's empty state instead of hitting the real Firestore SDK.
jest.mock('./src/services/formsService', () => ({
  listForms: jest.fn().mockResolvedValue([]),
}));

// FormDetail imports expo-print/expo-sharing at module load — these are
// native modules with no binding available under Jest, so importing
// AppStack (which registers FormDetail as a screen) needs them mocked too.
jest.mock('expo-print', () => ({ printToFileAsync: jest.fn() }));
jest.mock('expo-sharing', () => ({ shareAsync: jest.fn() }));

const mockedOnAuthStateChanged = onAuthStateChanged as jest.Mock;

describe('App', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders a loading indicator before the auth state resolves', () => {
    mockedOnAuthStateChanged.mockImplementation(() => jest.fn());

    render(<App />);

    expect(screen.getByTestId('app-loading')).toBeTruthy();
  });

  it('renders AuthStack when there is no authenticated user', async () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback(null);
      return jest.fn();
    });

    render(<App />);

    await waitFor(() => expect(screen.getByTestId('login-email-input')).toBeTruthy());
    expect(screen.queryByText('Home')).toBeNull();
  });

  it('renders AppStack when there is an authenticated user', async () => {
    mockedOnAuthStateChanged.mockImplementation((_auth, callback) => {
      callback({ uid: 'abc123' });
      return jest.fn();
    });

    render(<App />);

    await waitFor(() => expect(screen.getByTestId('home-new-form-button')).toBeTruthy());
    expect(screen.queryByTestId('login-email-input')).toBeNull();
  });
});
