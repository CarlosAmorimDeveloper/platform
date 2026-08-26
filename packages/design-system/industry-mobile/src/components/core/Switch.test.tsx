import { fireEvent, render } from '@testing-library/react-native';
import { color, neutral } from '@industry/tokens';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles from unchecked to checked on press when uncontrolled', () => {
    const { getByTestId } = render(<Switch label="Wifi" />);
    const thumb = getByTestId('switch-thumb');

    expect(thumb.props.style).toMatchObject({ backgroundColor: neutral['400'] });

    fireEvent(getByTestId('switch-root'), 'press');

    expect(getByTestId('switch-thumb').props.style).toMatchObject({
      backgroundColor: color.accent,
    });
  });

  it('calls onCheckedChange with the next value', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Switch label="Wifi" checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('switch-root'), 'press');

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Switch label="Wifi" disabled checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('switch-root'), 'press');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('sets accessibilityState from checked and disabled', () => {
    const { getByTestId } = render(<Switch label="Wifi" checked disabled />);
    expect(getByTestId('switch-root').props.accessibilityState).toMatchObject({
      checked: true,
      disabled: true,
    });
  });
});
