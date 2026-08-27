import { fireEvent, render } from '@testing-library/react-native';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders the title and body', () => {
    const { getByText } = render(<Toast title="Salvo">Detalhes da ação.</Toast>);

    expect(getByText('Salvo')).toBeTruthy();
    expect(getByText('Detalhes da ação.')).toBeTruthy();
  });

  it('omits the dismiss button when onDismiss is not given', () => {
    const { queryByLabelText } = render(<Toast title="Salvo" />);

    expect(queryByLabelText('Dispensar')).toBeNull();
  });

  it('calls onDismiss when the dismiss button is pressed', () => {
    const onDismiss = jest.fn();
    const { getByLabelText } = render(<Toast title="Salvo" onDismiss={onDismiss} />);

    fireEvent.press(getByLabelText('Dispensar'));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('omits the title when not provided', () => {
    const { getByText } = render(<Toast>Só corpo</Toast>);

    expect(getByText('Só corpo')).toBeTruthy();
  });
});
