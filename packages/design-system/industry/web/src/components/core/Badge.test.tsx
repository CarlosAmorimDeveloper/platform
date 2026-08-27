import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>Publicado</Badge>);

    expect(screen.getByText('Publicado')).toBeInTheDocument();
  });

  it('defaults to a transparent, outlined neutral tone', () => {
    render(<Badge>Neutro</Badge>);

    expect(screen.getByText('Neutro')).toHaveStyle({ background: undefined });
  });

  it('fills the background when solid is set', () => {
    render(
      <Badge tone="success" solid>
        Publicado
      </Badge>,
    );

    expect(screen.getByText('Publicado')).toHaveStyle({ background: 'var(--color-success)' });
  });
});
