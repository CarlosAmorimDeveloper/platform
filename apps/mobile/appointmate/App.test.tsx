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

    await waitFor(() => expect(screen.getByText('Home')).toBeTruthy());
    expect(screen.queryByTestId('login-email-input')).toBeNull();
  });
});
