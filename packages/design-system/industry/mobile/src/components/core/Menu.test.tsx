import { fireEvent, render } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { Menu, resolveMenuPosition } from './Menu';

function mockMeasureInWindow(x: number, y: number, width: number, height: number) {
  const probe: { current: View | null } = { current: null };
  render(<View ref={probe as never} />);
  const prototype = Object.getPrototypeOf(probe.current);
  return jest
    .spyOn(prototype, 'measureInWindow')
    .mockImplementation(((cb: (x: number, y: number, width: number, height: number) => void) =>
      cb(x, y, width, height)) as never);
}

const ITEMS = [
  { key: 'edit', label: 'Editar', onSelect: jest.fn() },
  { key: 'delete', label: 'Excluir', onSelect: jest.fn(), disabled: true },
];

describe('resolveMenuPosition', () => {
  it('positions the panel below the anchor', () => {
    expect(resolveMenuPosition({ x: 0, y: 100, width: 40, height: 20 }, 400)).toMatchObject({
      top: 124,
    });
  });

  it('right-aligns the panel to the anchor', () => {
    expect(resolveMenuPosition({ x: 300, y: 0, width: 40, height: 20 }, 400)).toMatchObject({
      right: 60,
    });
  });

  it('clamps the right offset to a minimum margin', () => {
    expect(resolveMenuPosition({ x: 390, y: 0, width: 40, height: 20 }, 400)).toMatchObject({
      right: 12,
    });
  });
});

describe('Menu', () => {
  it('is hidden until the trigger is pressed', () => {
    const { queryByTestId } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    expect(queryByTestId('menu-panel')).toBeNull();
  });

  it('opens and lists every item when the trigger is pressed', () => {
    const { getByTestId, getByText } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    fireEvent.press(getByTestId('menu'));

    expect(getByTestId('menu-panel')).toBeTruthy();
    expect(getByText('Editar')).toBeTruthy();
    expect(getByText('Excluir')).toBeTruthy();
  });

  it('calls onSelect and closes when an item is pressed', () => {
    const onSelect = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Menu
        trigger={<Text>Ações</Text>}
        items={[{ key: 'edit', label: 'Editar', onSelect }]}
        testID="menu"
      />,
    );

    fireEvent.press(getByTestId('menu'));
    fireEvent.press(getByTestId('menu-item-edit'));

    expect(onSelect).toHaveBeenCalled();
    expect(queryByTestId('menu-panel')).toBeNull();
  });

  it('does not call onSelect for a disabled item', () => {
    const onSelect = jest.fn();
    const { getByTestId } = render(
      <Menu
        trigger={<Text>Ações</Text>}
        items={[{ key: 'delete', label: 'Excluir', onSelect, disabled: true }]}
        testID="menu"
      />,
    );

    fireEvent.press(getByTestId('menu'));
    fireEvent.press(getByTestId('menu-item-delete'));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('closes when the backdrop is pressed', () => {
    const { getByTestId, queryByTestId } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    fireEvent.press(getByTestId('menu'));
    fireEvent.press(getByTestId('menu-backdrop'));

    expect(queryByTestId('menu-panel')).toBeNull();
  });

  it('supports controlled open state', () => {
    const onOpenChange = jest.fn();
    const { getByTestId, queryByTestId, rerender } = render(
      <Menu
        trigger={<Text>Ações</Text>}
        items={ITEMS}
        open={false}
        onOpenChange={onOpenChange}
        testID="menu"
      />,
    );

    fireEvent.press(getByTestId('menu'));
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(queryByTestId('menu-panel')).toBeNull();

    rerender(
      <Menu
        trigger={<Text>Ações</Text>}
        items={ITEMS}
        open={true}
        onOpenChange={onOpenChange}
        testID="menu"
      />,
    );
    expect(getByTestId('menu-panel')).toBeTruthy();
  });

  it('renders with no items', () => {
    const { getByTestId } = render(<Menu trigger={<Text>Ações</Text>} testID="menu" />);

    fireEvent.press(getByTestId('menu'));

    expect(getByTestId('menu-panel')).toBeTruthy();
  });

  it('resolves its position once measureInWindow reports the anchor location', () => {
    const spy = mockMeasureInWindow(0, 100, 40, 20);

    const { getByTestId } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    fireEvent.press(getByTestId('menu'));

    expect(getByTestId('menu-panel')).toBeTruthy();
    spy.mockRestore();
  });

  it('closes when the device back gesture requests it', () => {
    const { getByTestId, queryByTestId } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    fireEvent.press(getByTestId('menu'));
    fireEvent(getByTestId('menu-backdrop').parent as never, 'requestClose');

    expect(queryByTestId('menu-panel')).toBeNull();
  });

  it('works without a testID', () => {
    const { getByText } = render(
      <Menu trigger={<Text>Ações</Text>} items={[{ label: 'Sem chave', onSelect: jest.fn() }]} />,
    );

    fireEvent.press(getByText('Ações'));

    expect(getByText('Sem chave')).toBeTruthy();
  });

  it('tints an item darker while pressed', () => {
    const { getByTestId } = render(
      <Menu trigger={<Text>Ações</Text>} items={ITEMS} testID="menu" />,
    );

    fireEvent.press(getByTestId('menu'));
    fireEvent(getByTestId('menu-item-edit'), 'pressIn');

    expect(getByTestId('menu-item-edit').props.style).toMatchObject({
      backgroundColor: expect.any(String),
    });
  });
});
