import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Stepper } from './Stepper';

const STEPS = ['Conta', 'Endereço', 'Confirmação'];

describe('Stepper', () => {
  it('renders every step label', () => {
    const { getByText } = render(<Stepper steps={STEPS} />);

    expect(getByText('Conta')).toBeTruthy();
    expect(getByText('Endereço')).toBeTruthy();
    expect(getByText('Confirmação')).toBeTruthy();
  });

  it('numbers pending steps and checkmarks done steps', () => {
    const { getByText } = render(<Stepper steps={STEPS} current={1} />);

    expect(getByText('✓')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();
  });

  it('accepts object steps', () => {
    const { getByText } = render(<Stepper steps={[{ label: 'Único' }]} />);

    expect(getByText('Único')).toBeTruthy();
  });

  it('renders every step as done when current is past the last index', () => {
    const { getAllByText } = render(<Stepper steps={STEPS} current={STEPS.length} />);

    expect(getAllByText('✓')).toHaveLength(STEPS.length);
  });

  it('defaults to the first step when current is not given', () => {
    const { getByTestId } = render(<Stepper steps={STEPS} />);

    expect(getByTestId('stepper-dot-0')).toBeTruthy();
  });

  it('accepts a non-string label', () => {
    const { getByText } = render(<Stepper steps={[{ label: <Text>Nó</Text> }]} />);

    expect(getByText('Nó')).toBeTruthy();
  });

  it('renders a connector between steps but not after the last one', () => {
    const { getByTestId, queryByTestId } = render(<Stepper steps={STEPS} />);

    expect(getByTestId('stepper-dot-0')).toBeTruthy();
    expect(getByTestId('stepper-dot-2')).toBeTruthy();
    expect(queryByTestId('stepper-dot-3')).toBeNull();
  });
});
