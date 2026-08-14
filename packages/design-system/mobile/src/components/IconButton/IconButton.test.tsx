import React from 'react';
import { colors } from '@ds/tokens';
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

  it('usa a cor primária quando variant="primary"', () => {
    render(<IconButton icon="filter-variant" variant="primary" testID="icon-button" />);
    // Paper's IconButton forwards `iconColor` down to the inner Icon's
    // `color` prop rather than keeping it on the testID'd host node.
    expect(screen.UNSAFE_getByProps({ color: colors.primary[600] })).toBeTruthy();
  });

  it('usa a cor neutra por padrão', () => {
    render(<IconButton icon="filter-variant" testID="icon-button" />);
    expect(screen.UNSAFE_getByProps({ color: colors.neutral[700] })).toBeTruthy();
  });
});
