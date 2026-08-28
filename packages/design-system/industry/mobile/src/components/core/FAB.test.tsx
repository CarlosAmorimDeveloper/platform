import { fireEvent, render, screen } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { FAB, resolveFabBackground } from './FAB';

describe('resolveFabBackground', () => {
  it('tints darker while pressed, otherwise the accent color', () => {
    expect(resolveFabBackground(true)).toBe(color.accent2);
    expect(resolveFabBackground(false)).toBe(color.accent);
  });
});

describe('FAB', () => {
  it('renders with its accessible label', () => {
    render(<FAB label="Novo chamado" />);
    expect(screen.getByLabelText('Novo chamado')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<FAB label="Novo chamado" onPress={onPress} />);

    fireEvent.press(screen.getByLabelText('Novo chamado'));

    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress while disabled', () => {
    const onPress = jest.fn();
    render(<FAB label="Novo chamado" onPress={onPress} disabled />);

    fireEvent.press(screen.getByLabelText('Novo chamado'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('tints darker while pressed', () => {
    render(<FAB label="Novo chamado" />);
    fireEvent(screen.getByLabelText('Novo chamado'), 'pressIn');

    const [flattened] = screen.getByLabelText('Novo chamado').props.style;
    expect(flattened).toMatchObject({ backgroundColor: expect.any(String) });
  });

  it('sizes the icon down and shrinks the box for the "md" size', () => {
    render(<FAB label="Novo chamado" size="md" />);
    const [flattened] = screen.getByLabelText('Novo chamado').props.style;
    expect(flattened).toMatchObject({ width: 48, height: 48 });
  });

  it('defaults to the "lg" box size', () => {
    render(<FAB label="Novo chamado" />);
    const [flattened] = screen.getByLabelText('Novo chamado').props.style;
    expect(flattened).toMatchObject({ width: 56, height: 56 });
  });
});
