import { render, screen } from './src/test-utils';
import App from './App';

describe('App', () => {
  it('renders the app placeholder', () => {
    render(<App />);

    expect(screen.getByText('AppointMate')).toBeTruthy();
  });
});
