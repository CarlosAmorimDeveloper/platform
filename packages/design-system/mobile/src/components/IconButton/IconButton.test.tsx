import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('renderiza com testID', () => {
    render(<IconButton icon="filter-variant" testID="icon-button" />);
    expect(screen.getByTestId('icon-button')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<IconButton icon="filter-variant" onPress={onPress} testID="icon-button" />);
    fireEvent.press(screen.getByTestId('icon-button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled=true', () => {
    const onPress = jest.fn();
    render(<IconButton icon="filter-variant" onPress={onPress} disabled testID="icon-button" />);
    fireEvent.press(screen.getByTestId('icon-button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reflete accessibilityLabel', () => {
    render(<IconButton icon="filter-variant" accessibilityLabel="Filtrar" testID="icon-button" />);
    expect(screen.getByLabelText('Filtrar')).toBeTruthy();
  });
});
