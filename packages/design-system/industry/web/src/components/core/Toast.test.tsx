import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  it('renders the title and body', () => {
    render(<Toast title="Salvo">Detalhes da ação.</Toast>);

    expect(screen.getByText('Salvo')).toBeInTheDocument();
    expect(screen.getByText('Detalhes da ação.')).toBeInTheDocument();
  });

  it('is an accessible status region', () => {
    render(<Toast title="Salvo" />);

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('omits the dismiss button when onDismiss is not given', () => {
    render(<Toast title="Salvo" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('calls onDismiss when the dismiss button is clicked', async () => {
    const onDismiss = jest.fn();
    render(<Toast title="Salvo" onDismiss={onDismiss} />);

    fireEvent.click(await screen.findByRole('button', { name: 'Dispensar' }));

    expect(onDismiss).toHaveBeenCalled();
  });
});
