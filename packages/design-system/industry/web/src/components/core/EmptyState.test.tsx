import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders title, body, icon and action', () => {
    render(
      <EmptyState
        icon={<span>icon</span>}
        title="Nenhum projeto"
        body="Crie o primeiro projeto."
        action={<button type="button">Criar</button>}
      />,
    );

    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.getByText('Nenhum projeto')).toBeInTheDocument();
    expect(screen.getByText('Crie o primeiro projeto.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Criar' })).toBeInTheDocument();
  });

  it('omits optional slots that are not provided', () => {
    render(<EmptyState title="Só título" />);

    expect(screen.getByText('Só título')).toBeInTheDocument();
  });
});
