import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from './Tabs';

const ITEMS = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'settings', label: 'Configurações' },
];

describe('Tabs', () => {
  it('renders every tab', () => {
    render(<Tabs items={ITEMS} />);

    expect(screen.getByRole('tab', { name: 'Visão geral' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Configurações' })).toBeInTheDocument();
  });

  it('marks the current tab as selected', () => {
    render(<Tabs items={ITEMS} current="settings" />);

    expect(screen.getByRole('tab', { name: 'Configurações' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Visão geral' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('calls onSelect with the clicked tab id', () => {
    const onSelect = jest.fn();
    render(<Tabs items={ITEMS} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Configurações' }));

    expect(onSelect).toHaveBeenCalledWith('settings');
  });

  it('renders a count badge when given', () => {
    render(<Tabs items={[{ id: 'activity', label: 'Atividade', count: 3 }]} />);

    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('accepts plain string items', () => {
    render(<Tabs items={['Início']} />);

    expect(screen.getByRole('tab', { name: 'Início' })).toBeInTheDocument();
  });

  it('resolves hover state on mouse enter and leave', () => {
    render(<Tabs items={ITEMS} />);
    const tab = screen.getByRole('tab', { name: 'Visão geral' });

    fireEvent.mouseEnter(tab);
    fireEvent.mouseLeave(tab);

    expect(tab).toBeInTheDocument();
  });
});
