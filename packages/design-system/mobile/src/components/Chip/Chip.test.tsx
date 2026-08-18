import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renderiza o texto do children', () => {
    render(<Chip>Urgente</Chip>);
    expect(screen.getByText('Urgente')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<Chip onPress={onPress}>Filtro</Chip>);
    fireEvent.press(screen.getByText('Filtro'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled=true', () => {
    const onPress = jest.fn();
    render(
      <Chip onPress={onPress} disabled testID="chip">
        Desabilitado
      </Chip>,
    );
    fireEvent.press(screen.getByTestId('chip'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('reflete o estado selected na accessibilityState', () => {
    render(
      <Chip selected testID="chip">
        Selecionado
      </Chip>,
    );
    const chip = screen.getByTestId('chip');
    expect(chip.props.accessibilityState?.selected).toBe(true);
  });

  it('reflete selected=false por padrão', () => {
    render(<Chip testID="chip">Não selecionado</Chip>);
    const chip = screen.getByTestId('chip');
    expect(chip.props.accessibilityState?.selected).toBe(false);
  });

  it('renderiza com testID', () => {
    render(<Chip testID="meu-chip">OK</Chip>);
    expect(screen.getByTestId('meu-chip')).toBeTruthy();
  });

  it('expõe hitSlop para ampliar a área de toque', () => {
    render(<Chip testID="chip">Toque</Chip>);
    expect(screen.getByTestId('chip').props.hitSlop).toEqual({
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
    });
  });
});
