import { render, screen } from '../../test-utils';
import { AuthStack } from './AuthStack';

jest.mock('../../services/firebase', () => ({ auth: {} }));

describe('AuthStack', () => {
  it('renders Login as the initial route', () => {
    render(<AuthStack />);

    expect(screen.getByTestId('login-email-input')).toBeTruthy();
  });
});
