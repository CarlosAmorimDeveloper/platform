import { render } from '@testing-library/react-native';
import { Progress, Spinner } from './Progress';

describe('Progress', () => {
  it('exposes the current value via accessibilityValue', () => {
    const { getByTestId } = render(<Progress value={40} max={80} testID="progress" />);

    expect(getByTestId('progress').props.accessibilityValue).toMatchObject({
      min: 0,
      max: 80,
      now: 40,
    });
  });

  it('renders the rounded percentage by default', () => {
    const { getByText } = render(<Progress value={33} max={100} />);

    expect(getByText('33%')).toBeTruthy();
  });

  it('hides the percentage when showValue is false', () => {
    const { queryByText } = render(<Progress value={33} showValue={false} />);

    expect(queryByText('33%')).toBeNull();
  });

  it('hides the percentage but still shows the label row when both label and showValue=false are given', () => {
    const { getByText, queryByText } = render(
      <Progress value={33} label="Enviando" showValue={false} />,
    );

    expect(getByText('Enviando')).toBeTruthy();
    expect(queryByText('33%')).toBeNull();
  });

  it('defaults to value 0', () => {
    const { getByTestId } = render(<Progress testID="progress" />);

    expect(getByTestId('progress').props.accessibilityValue).toMatchObject({ now: 0 });
  });

  it('renders the label', () => {
    const { getByText } = render(<Progress value={10} label="Enviando" />);

    expect(getByText('Enviando')).toBeTruthy();
  });

  it('clamps the value between 0 and 100 percent', () => {
    const { getByText } = render(<Progress value={999} max={100} />);

    expect(getByText('100%')).toBeTruthy();
  });
});

describe('Spinner', () => {
  it('renders as an accessible status indicator', () => {
    const { getByLabelText } = render(<Spinner />);

    expect(getByLabelText('Carregando')).toBeTruthy();
  });
});
