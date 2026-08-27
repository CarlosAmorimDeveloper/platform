import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';

const STEPS = ['Conta', 'Endereço', 'Confirmação'];

describe('Stepper', () => {
  it('renders every step label', () => {
    render(<Stepper steps={STEPS} />);

    expect(screen.getByText('Conta')).toBeInTheDocument();
    expect(screen.getByText('Endereço')).toBeInTheDocument();
    expect(screen.getByText('Confirmação')).toBeInTheDocument();
  });

  it('marks the current step with aria-current', () => {
    render(<Stepper steps={STEPS} current={1} />);

    expect(screen.getByText('Endereço').closest('[aria-current]')).toHaveAttribute(
      'aria-current',
      'step',
    );
  });

  it('numbers pending steps and checkmarks done steps', () => {
    render(<Stepper steps={STEPS} current={1} />);

    expect(screen.getByText('✓')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('accepts object steps', () => {
    render(<Stepper steps={[{ label: 'Único' }]} />);

    expect(screen.getByText('Único')).toBeInTheDocument();
  });

  it('renders every step as done when current is past the last index', () => {
    render(<Stepper steps={STEPS} current={STEPS.length} />);

    expect(screen.getAllByText('✓')).toHaveLength(STEPS.length);
  });
});
