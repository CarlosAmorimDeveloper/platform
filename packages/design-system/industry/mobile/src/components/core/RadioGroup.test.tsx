import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('marks the option matching value as checked', () => {
    const { getByTestId } = render(
      <RadioGroup options={['a', 'b']} value="b" onValueChange={jest.fn()} />,
    );

    expect(getByTestId('radio-option-a').props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(getByTestId('radio-option-b').props.accessibilityState).toMatchObject({ checked: true });
    expect(getByTestId('radio-dot-b').props.style).toMatchObject({ backgroundColor: color.accent });
  });

  it('calls onValueChange with the pressed option value', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <RadioGroup options={['a', 'b']} value="a" onValueChange={onValueChange} />,
    );

    fireEvent(getByTestId('radio-option-b'), 'press');

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders object options by their label', () => {
    const { getByText } = render(
      <RadioGroup
        options={[{ value: 'br', label: 'Brasil' }]}
        value="br"
        onValueChange={jest.fn()}
      />,
    );

    expect(getByText('Brasil')).toBeTruthy();
  });
});
