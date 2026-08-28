import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';

const ITEMS = [
  { label: 'Início', href: '/' },
  { label: 'Projetos', href: '/projetos' },
  { label: 'Detalhes' },
];

describe('Breadcrumbs', () => {
  it('renders nothing when there are no items', () => {
    render(<Breadcrumbs />);
    expect(screen.getByRole('navigation')).toBeEmptyDOMElement();
  });

  it('renders every item label', () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByText('Detalhes')).toBeInTheDocument();
  });

  it('renders every non-last item as a link with its href', () => {
    render(<Breadcrumbs items={ITEMS} />);
    expect(screen.getByRole('link', { name: 'Início' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Projetos' })).toHaveAttribute('href', '/projetos');
  });

  it('falls back to "#" when a non-last item has no href', () => {
    render(<Breadcrumbs items={[{ label: 'A' }, { label: 'B' }]} />);
    expect(screen.getByRole('link', { name: 'A' })).toHaveAttribute('href', '#');
  });

  it('marks the last item as the current page and not a link', () => {
    render(<Breadcrumbs items={ITEMS} />);
    const last = screen.getByText('Detalhes');
    expect(last).toHaveAttribute('aria-current', 'page');
    expect(last.tagName).toBe('SPAN');
  });

  it('renders a separator between items but not after the last one', () => {
    const { container } = render(<Breadcrumbs items={ITEMS} />);
    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(ITEMS.length - 1);
  });
});
