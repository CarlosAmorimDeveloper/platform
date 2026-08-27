import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Sheet } from './Sheet';

describe('Sheet', () => {
  it('renders the title, children and actions when open', () => {
    const { getByText } = render(
      <Sheet title="Título" actions={<Text>Ação</Text>}>
        <Text>Conteúdo</Text>
      </Sheet>,
    );

    expect(getByText('Título')).toBeTruthy();
    expect(getByText('Conteúdo')).toBeTruthy();
    expect(getByText('Ação')).toBeTruthy();
  });

  it('renders nothing queryable when closed', () => {
    const { queryByText } = render(
      <Sheet open={false} title="Título">
        <Text>Conteúdo</Text>
      </Sheet>,
    );

    expect(queryByText('Título')).toBeNull();
    expect(queryByText('Conteúdo')).toBeNull();
  });

  it('calls onDismiss when the backdrop is pressed', () => {
    const onDismiss = jest.fn();
    const { getByTestId } = render(
      <Sheet testID="status-sheet" onDismiss={onDismiss}>
        <Text>Conteúdo</Text>
      </Sheet>,
    );

    fireEvent.press(getByTestId('status-sheet-backdrop'));

    expect(onDismiss).toHaveBeenCalled();
  });

  it('claims the touch responder so taps on the sheet do not fall through to the backdrop', () => {
    const { getByTestId } = render(
      <Sheet testID="status-sheet">
        <Text>Conteúdo</Text>
      </Sheet>,
    );

    expect(getByTestId('status-sheet').props.onStartShouldSetResponder()).toBe(true);
  });

  it('omits the title when none is given', () => {
    const { queryByTestId } = render(
      <Sheet testID="status-sheet">
        <Text>Conteúdo</Text>
      </Sheet>,
    );

    expect(queryByTestId('status-sheet')).toBeTruthy();
  });
});
