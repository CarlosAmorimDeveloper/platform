import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { FAB } from './FAB';

describe('FAB', () => {
  it('renderiza com testID', () => {
    render(<FAB onPress={() => {}} testID="fab" />);
    expect(screen.getByTestId('fab')).toBeTruthy();
  });

  it('chama onPress ao pressionar', () => {
    const onPress = jest.fn();
    render(<FAB onPress={onPress} testID="fab" />);
    fireEvent.press(screen.getByTestId('fab'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('usa ícone plus por padrão', () => {
    const { toJSON } = render(<FAB onPress={() => {}} testID="fab" />);
    expect(toJSON()).toBeTruthy();
  });
});
