import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders kicker, title, body and meta', () => {
    render(<Card kicker="Projeto" title="Título" body="Corpo do card" meta="há 2h" />);

    expect(screen.getByText('Projeto')).toBeInTheDocument();
    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Corpo do card')).toBeInTheDocument();
    expect(screen.getByText('há 2h')).toBeInTheDocument();
  });

  it('renders children alongside the structured slots', () => {
    render(
      <Card title="Título">
        <span>Conteúdo extra</span>
      </Card>,
    );

    expect(screen.getByText('Conteúdo extra')).toBeInTheDocument();
  });

  it('omits optional slots that are not provided', () => {
    render(<Card title="Só título" />);

    expect(screen.getByText('Só título')).toBeInTheDocument();
  });

  it('renders blueprint corner marks when framed', () => {
    const { container } = render(<Card title="Framed" framed />);

    expect(container.querySelectorAll('[data-frame-corner]')).toHaveLength(4);
  });

  it('does not render corner marks by default', () => {
    const { container } = render(<Card title="Sem marcas" />);

    expect(container.querySelectorAll('[data-frame-corner]')).toHaveLength(0);
  });
});
