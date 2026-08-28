import { fireEvent, render, screen } from '@testing-library/react-native';
import { alpha, color } from '@industry/tokens';
import { Chip, resolveChipBackground } from './Chip';

describe('resolveChipBackground', () => {
  it('tints with the accent color when selected, otherwise transparent', () => {
    expect(resolveChipBackground(true)).toBe(alpha(color.accent, 22));
    expect(resolveChipBackground(false)).toBe('transparent');
  });
});

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>Ansioso</Chip>);
    expect(screen.getByText('Ansioso')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Chip onPress={onPress}>Ansioso</Chip>);

    fireEvent.press(screen.getByText('Ansioso'));

    expect(onPress).toHaveBeenCalled();
  });

  it('does not call onPress while disabled', () => {
    const onPress = jest.fn();
    render(
      <Chip onPress={onPress} disabled>
        Ansioso
      </Chip>,
    );

    fireEvent.press(screen.getByText('Ansioso'));

    expect(onPress).not.toHaveBeenCalled();
  });

  it('exposes its selected state to assistive technology', () => {
    render(<Chip selected>Ansioso</Chip>);
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('is not selected by default', () => {
    render(<Chip>Ansioso</Chip>);
    expect(screen.getByRole('button').props.accessibilityState).toMatchObject({
      selected: false,
    });
  });
});
