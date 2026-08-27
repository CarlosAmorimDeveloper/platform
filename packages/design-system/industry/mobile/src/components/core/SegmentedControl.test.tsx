import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('marks the option matching value as checked', () => {
    const { getByTestId } = render(
      <SegmentedControl options={['a', 'b']} value="b" onValueChange={jest.fn()} />,
    );

    expect(getByTestId('segment-option-a').props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(getByTestId('segment-option-b').props.accessibilityState).toMatchObject({
      checked: true,
    });
    expect(getByTestId('segment-option-b').props.style).toMatchObject({
      backgroundColor: color.accent,
    });
  });

  it('calls onValueChange with the pressed option value', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <SegmentedControl options={['a', 'b']} value="a" onValueChange={onValueChange} />,
    );

    fireEvent(getByTestId('segment-option-b'), 'press');

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders object options by their label', () => {
    const { getByText } = render(
      <SegmentedControl
        options={[{ value: 'grid', label: 'Grade' }]}
        value="grid"
        onValueChange={jest.fn()}
      />,
    );

    expect(getByText('Grade')).toBeTruthy();
  });
});
