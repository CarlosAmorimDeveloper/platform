import { fireEvent, render, screen } from '@testing-library/react';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('renders nothing when closed', () => {
    const { container } = render(<Sheet open={false}>Conteúdo</Sheet>);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders the title, children and actions when open', () => {
    render(
      <Sheet title="Título" actions={<button type="button">Ação</button>}>
        <p>Conteúdo</p>
      </Sheet>,
    );

    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Ação' })).toBeInTheDocument();
  });

  it('is an accessible dialog', () => {
    render(<Sheet title="Título">Conteúdo</Sheet>);

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('calls onDismiss when the backdrop is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <Sheet title="Título" onDismiss={onDismiss}>
        Conteúdo
      </Sheet>,
    );

    fireEvent.click(screen.getByRole('dialog').parentElement as HTMLElement);

    expect(onDismiss).toHaveBeenCalled();
  });

  it('does not call onDismiss when the sheet body is clicked', () => {
    const onDismiss = jest.fn();
    render(
      <Sheet title="Título" onDismiss={onDismiss}>
        Conteúdo
      </Sheet>,
    );

    fireEvent.click(screen.getByRole('dialog'));

    expect(onDismiss).not.toHaveBeenCalled();
  });
});
