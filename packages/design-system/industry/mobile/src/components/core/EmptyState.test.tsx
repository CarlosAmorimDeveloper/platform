import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('forwards testID to the container', () => {
    const { getByTestId } = render(<EmptyState title="Nenhum projeto" testID="empty-state" />);
    expect(getByTestId('empty-state')).toBeTruthy();
  });

  it('renders title, body, icon and action', () => {
    const { getByText } = render(
      <EmptyState
        icon={<Text>icon</Text>}
        title="Nenhum projeto"
        body="Crie o primeiro projeto."
        action={<Text>Criar</Text>}
      />,
    );

    expect(getByText('icon')).toBeTruthy();
    expect(getByText('Nenhum projeto')).toBeTruthy();
    expect(getByText('Crie o primeiro projeto.')).toBeTruthy();
    expect(getByText('Criar')).toBeTruthy();
  });

  it('omits optional slots that are not provided', () => {
    const { getByText, queryByText } = render(<EmptyState title="Só título" />);

    expect(getByText('Só título')).toBeTruthy();
    expect(queryByText('Criar')).toBeNull();
  });

  it('omits the title when not provided', () => {
    const { getByText } = render(<EmptyState body="Só corpo" />);

    expect(getByText('Só corpo')).toBeTruthy();
  });
});
