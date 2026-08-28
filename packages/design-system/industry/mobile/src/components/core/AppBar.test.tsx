import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppBar } from './AppBar';

describe('AppBar', () => {
  it('renders the title', () => {
    render(<AppBar title="Painel" />);
    expect(screen.getByText('Painel')).toBeTruthy();
  });

  it('does not render a back button by default', () => {
    render(<AppBar title="Painel" testID="bar" />);
    expect(screen.queryByTestId('bar-back')).toBeNull();
  });

  it('renders and calls onBackPress when a back button is provided', () => {
    const onBackPress = jest.fn();
    render(<AppBar title="Painel" onBackPress={onBackPress} testID="bar" />);

    fireEvent.press(screen.getByTestId('bar-back'));

    expect(onBackPress).toHaveBeenCalled();
  });

  it('renders every trailing action and calls its onPress', () => {
    const onPress = jest.fn();
    render(
      <AppBar
        title="Painel"
        actions={[{ icon: 'Bell', label: 'Notificações', onPress, testID: 'action-bell' }]}
      />,
    );

    fireEvent.press(screen.getByTestId('action-bell'));

    expect(onPress).toHaveBeenCalled();
  });

  it('renders an action without a testID via its accessible label', () => {
    const onPress = jest.fn();
    render(<AppBar title="Painel" actions={[{ icon: 'Bell', label: 'Notificações', onPress }]} />);

    fireEvent.press(screen.getByLabelText('Notificações'));

    expect(onPress).toHaveBeenCalled();
  });

  it('works without a testID on the back button', () => {
    const onBackPress = jest.fn();
    render(<AppBar title="Painel" onBackPress={onBackPress} />);

    fireEvent.press(screen.getByLabelText('Voltar'));

    expect(onBackPress).toHaveBeenCalled();
  });
});
