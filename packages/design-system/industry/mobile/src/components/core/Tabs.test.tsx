import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Tabs } from './Tabs';

const ITEMS = [
  { id: 'overview', label: 'Visão geral' },
  { id: 'settings', label: 'Configurações' },
];

describe('Tabs', () => {
  it('renders every tab', () => {
    const { getByText } = render(<Tabs items={ITEMS} />);

    expect(getByText('Visão geral')).toBeTruthy();
    expect(getByText('Configurações')).toBeTruthy();
  });

  it('marks the current tab as selected', () => {
    const { getByTestId } = render(<Tabs items={ITEMS} current="settings" />);

    expect(getByTestId('tab-settings').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(getByTestId('tab-overview').props.accessibilityState).toMatchObject({
      selected: false,
    });
  });

  it('calls onSelect with the pressed tab id', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(<Tabs items={ITEMS} onSelect={onSelect} />);

    fireEvent.press(getByTestId('tab-settings'));

    expect(onSelect).toHaveBeenCalledWith('settings');
  });

  it('renders a count badge when given', () => {
    const { getByText } = render(
      <Tabs items={[{ id: 'activity', label: 'Atividade', count: 3 }]} />,
    );

    expect(getByText('3')).toBeTruthy();
  });

  it('accepts plain string items', () => {
    const { getByText } = render(<Tabs items={['Início']} />);

    expect(getByText('Início')).toBeTruthy();
  });

  it('renders an icon when provided', () => {
    const { getByText } = render(
      <Tabs items={[{ id: 'home', label: 'Início', icon: <Text>icon</Text> }]} />,
    );

    expect(getByText('icon')).toBeTruthy();
  });

  it('renders nothing when no items are given', () => {
    const { queryByRole } = render(<Tabs />);

    expect(queryByRole('tab')).toBeNull();
  });

  it('falls back to the string label as an id when none is given', () => {
    const { getByTestId } = render(<Tabs items={[{ label: 'Início' }]} current="Início" />);

    expect(getByTestId('tab-Início').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('renders a tab without a label', () => {
    const { getByTestId } = render(<Tabs items={[{ id: 'home', icon: <Text>icon</Text> }]} />);

    expect(getByTestId('tab-home')).toBeTruthy();
  });
});
