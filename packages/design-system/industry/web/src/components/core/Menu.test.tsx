import { fireEvent, render, screen } from '@testing-library/react';
import { Menu } from './Menu';

const ITEMS = [
  { key: 'edit', label: 'Editar', onSelect: jest.fn() },
  { key: 'delete', label: 'Excluir', onSelect: jest.fn(), disabled: true },
];

describe('Menu', () => {
  it('is closed by default', () => {
    render(<Menu trigger="Ações" items={ITEMS} />);

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('opens and lists every item when the trigger is clicked', () => {
    render(<Menu trigger="Ações" items={ITEMS} />);

    fireEvent.click(screen.getByText('Ações'));

    expect(screen.getByRole('menuitem', { name: 'Editar' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Excluir' })).toBeInTheDocument();
  });

  it('calls onSelect and closes when an item is clicked', () => {
    const onSelect = jest.fn();
    render(<Menu trigger="Ações" items={[{ label: 'Editar', onSelect }]} />);

    fireEvent.click(screen.getByText('Ações'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Editar' }));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('does not call onSelect for a disabled item', () => {
    const onSelect = jest.fn();
    render(<Menu trigger="Ações" items={[{ label: 'Excluir', onSelect, disabled: true }]} />);

    fireEvent.click(screen.getByText('Ações'));
    fireEvent.click(screen.getByRole('menuitem', { name: 'Excluir' }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes when clicking outside without selecting anything', () => {
    render(
      <div>
        <Menu trigger="Ações" items={ITEMS} />
        <button type="button">Fora</button>
      </div>,
    );

    fireEvent.click(screen.getByText('Ações'));
    fireEvent.mouseDown(screen.getByText('Fora'));

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('supports controlled open state', () => {
    const onOpenChange = jest.fn();
    const { rerender } = render(
      <Menu trigger="Ações" items={ITEMS} open={false} onOpenChange={onOpenChange} />,
    );

    fireEvent.click(screen.getByText('Ações'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    rerender(<Menu trigger="Ações" items={ITEMS} open={true} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('renders with no items', () => {
    render(<Menu trigger="Ações" />);

    fireEvent.click(screen.getByText('Ações'));

    expect(screen.getByRole('menu')).toBeEmptyDOMElement();
  });
});
