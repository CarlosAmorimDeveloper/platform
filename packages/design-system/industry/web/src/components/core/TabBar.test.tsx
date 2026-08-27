import { fireEvent, render, screen } from '@testing-library/react';
import { TabBar } from './TabBar';

const ITEMS = [
  { id: 'home', label: 'Início' },
  { id: 'profile', label: 'Perfil' },
];

describe('TabBar', () => {
  it('renders every item', () => {
    render(<TabBar items={ITEMS} />);

    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
  });

  it('marks the current item as the active page', () => {
    render(<TabBar items={ITEMS} current="profile" />);

    expect(screen.getByText('Perfil').closest('button')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Início').closest('button')).not.toHaveAttribute('aria-current');
  });

  it('calls onSelect with the pressed item id', () => {
    const onSelect = jest.fn();
    render(<TabBar items={ITEMS} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Perfil'));

    expect(onSelect).toHaveBeenCalledWith('profile');
  });
});
