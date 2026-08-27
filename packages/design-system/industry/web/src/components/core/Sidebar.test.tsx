import { fireEvent, render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

const ITEMS = [
  { section: 'Workspace' },
  { id: 'home', label: 'Início' },
  { id: 'projects', label: 'Projetos' },
];

describe('Sidebar', () => {
  it('renders the brand, section labels and items', () => {
    render(<Sidebar brand="Industry" items={ITEMS} />);

    expect(screen.getByText('Industry')).toBeInTheDocument();
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Projetos')).toBeInTheDocument();
  });

  it('marks the current item as the active page', () => {
    render(<Sidebar items={ITEMS} current="projects" />);

    expect(screen.getByText('Projetos').closest('a')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Início').closest('a')).not.toHaveAttribute('aria-current');
  });

  it('calls onSelect with the item id and prevents navigation', () => {
    const onSelect = jest.fn();
    render(<Sidebar items={ITEMS} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Projetos'));

    expect(onSelect).toHaveBeenCalledWith('projects');
  });

  it('renders the footer', () => {
    render(<Sidebar items={ITEMS} footer={<span>v1.0.0</span>} />);

    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });
});
