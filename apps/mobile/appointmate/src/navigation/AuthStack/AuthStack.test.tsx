import { render, screen } from '../../test-utils';
import { AuthStack } from './AuthStack';

describe('AuthStack', () => {
  it('renders Login as the initial route', () => {
    render(<AuthStack />);

    expect(screen.getByText('Login')).toBeTruthy();
  });
});
