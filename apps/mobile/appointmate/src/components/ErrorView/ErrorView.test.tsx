import { fireEvent, render, screen } from '../../test-utils';
import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renders the description', () => {
    render(<ErrorView description="Não foi possível carregar." testID="error" />);
    expect(screen.getByText('Não foi possível carregar.')).toBeTruthy();
  });

  it('forwards testID to the container', () => {
    render(<ErrorView description="Não foi possível carregar." testID="error" />);
    expect(screen.getByTestId('error')).toBeTruthy();
  });

  it('renders an optional title', () => {
    render(<ErrorView description="Não foi possível carregar." title="Algo deu errado" />);
    expect(screen.getByText('Algo deu errado')).toBeTruthy();
  });

  it('does not render an action button by default', () => {
    render(<ErrorView description="Não foi possível carregar." />);
    expect(screen.queryByText('Tentar novamente')).toBeNull();
  });

  it('renders a retry action and calls onAction when pressed', () => {
    const onAction = jest.fn();
    render(<ErrorView description="Não foi possível carregar." onAction={onAction} />);

    fireEvent.press(screen.getByText('Tentar novamente'));

    expect(onAction).toHaveBeenCalled();
  });

  it('renders a custom action label', () => {
    const onAction = jest.fn();
    render(
      <ErrorView
        description="Não foi possível carregar."
        onAction={onAction}
        actionLabel="Recarregar"
      />,
    );
    expect(screen.getByText('Recarregar')).toBeTruthy();
  });
});
