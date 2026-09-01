import { Text } from 'react-native';
import { render, screen } from '../../test-utils';
import { BottomBar } from './BottomBar';

describe('BottomBar', () => {
  it('renders its children', () => {
    render(
      <BottomBar testID="bottom-bar">
        <Text>Enviar</Text>
      </BottomBar>,
    );
    expect(screen.getByText('Enviar')).toBeTruthy();
  });

  it('forwards testID to the container', () => {
    render(
      <BottomBar testID="bottom-bar">
        <Text>Enviar</Text>
      </BottomBar>,
    );
    expect(screen.getByTestId('bottom-bar')).toBeTruthy();
  });
});
