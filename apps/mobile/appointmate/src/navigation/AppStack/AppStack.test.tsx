import { render, screen } from '../../test-utils';
import { AppStack } from './AppStack';

describe('AppStack', () => {
  it('renders Home as the initial route', () => {
    render(<AppStack />);

    expect(screen.getByText('Home')).toBeTruthy();
  });
});
