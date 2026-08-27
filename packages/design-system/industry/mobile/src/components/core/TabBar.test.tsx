import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { color } from '@industry/tokens';
import { TabBar } from './TabBar';

const ITEMS = [
  { id: 'home', label: 'Início' },
  { id: 'profile', label: 'Perfil' },
];

describe('TabBar', () => {
  it('renders every item', () => {
    const { getByText } = render(<TabBar items={ITEMS} />);

    expect(getByText('Início')).toBeTruthy();
    expect(getByText('Perfil')).toBeTruthy();
  });

  it('marks the current item as selected and tints it', () => {
    const { getByTestId, getByText } = render(<TabBar items={ITEMS} current="profile" />);

    expect(getByTestId('tabbar-item-profile').props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(getByTestId('tabbar-item-home').props.accessibilityState).toMatchObject({
      selected: false,
    });
    expect(getByText('Perfil').props.style).toMatchObject({ color: color.accent });
  });

  it('calls onSelect with the pressed item id', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(<TabBar items={ITEMS} onSelect={onSelect} />);

    fireEvent.press(getByTestId('tabbar-item-profile'));

    expect(onSelect).toHaveBeenCalledWith('profile');
  });

  it('renders an icon and tints it when the item is active', () => {
    const { getByText } = render(
      <TabBar current="home" items={[{ id: 'home', label: 'Início', icon: <Text>icon</Text> }]} />,
    );

    expect(getByText('icon')).toBeTruthy();
  });

  it('falls back to the string label as an id when none is given', () => {
    const { getByTestId } = render(<TabBar items={[{ label: 'Início' }]} current="Início" />);

    expect(getByTestId('tabbar-item-Início').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('renders nothing when no items are given', () => {
    const { queryByRole } = render(<TabBar />);

    expect(queryByRole('button')).toBeNull();
  });

  it('renders an item without a label', () => {
    const { getByTestId } = render(<TabBar items={[{ id: 'home', icon: <Text>icon</Text> }]} />);

    expect(getByTestId('tabbar-item-home')).toBeTruthy();
  });
});
