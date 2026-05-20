import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Radio } from '../src/components/Radio';

describe('Radio', () => {
  it('renderiza o label', () => {
    render(<Radio selected={false} onPress={() => {}} label="Opção A" />);
    expect(screen.getByText('Opção A')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<Radio selected={false} onPress={onPress} label="Opção" testID="radio" />);
    fireEvent.press(screen.getByTestId('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled', () => {
    const onPress = jest.fn();
    render(<Radio selected={false} onPress={onPress} disabled label="Bloqueado" testID="radio" />);
    fireEvent.press(screen.getByTestId('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
