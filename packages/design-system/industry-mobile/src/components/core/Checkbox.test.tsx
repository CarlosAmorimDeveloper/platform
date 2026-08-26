import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders no check mark when unchecked', () => {
    const { queryByTestId } = render(<Checkbox label="Termos" />);
    expect(queryByTestId('checkbox-mark')).toBeNull();
  });

  it('toggles to checked on press when uncontrolled', () => {
    const { getByTestId, queryByTestId } = render(<Checkbox label="Termos" />);

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(queryByTestId('checkbox-mark')).toBeTruthy();
    expect(getByTestId('checkbox-box').props.style).toMatchObject({
      backgroundColor: color.accent,
    });
  });

  it('calls onCheckedChange with the next value', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox label="Termos" checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox label="Termos" disabled checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
