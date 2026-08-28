import { ActivityIndicator } from 'react-native';
import { render, screen } from '../../test-utils';
import { LoadingView } from './LoadingView';

describe('LoadingView', () => {
  it('renders a spinner', () => {
    render(<LoadingView testID="loading" />);
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
  });

  it('forwards testID to the container', () => {
    render(<LoadingView testID="loading" />);
    expect(screen.getByTestId('loading')).toBeTruthy();
  });

  it('does not render a message by default', () => {
    render(<LoadingView testID="loading" />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('renders an optional message', () => {
    render(<LoadingView testID="loading" message="Carregando formulário..." />);
    expect(screen.getByText('Carregando formulário...')).toBeTruthy();
  });
});
