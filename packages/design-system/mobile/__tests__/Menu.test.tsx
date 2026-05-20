import React, { useState } from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Menu } from '../src/components/Menu';
import { Button } from '../src/components/Button';

describe('Menu', () => {
  it('renderiza o anchor', () => {
    render(
      <Menu
        visible={false}
        onDismiss={() => {}}
        anchor={<Button testID="anchor">Abrir</Button>}
        items={[]}
      />,
    );
    expect(screen.getByTestId('anchor')).toBeTruthy();
  });

  it('renderiza os itens quando visible=true', () => {
    render(
      <Menu
        visible={true}
        onDismiss={() => {}}
        anchor={<Button>Anchor</Button>}
        items={[
          { label: 'Editar', onPress: () => {} },
          { label: 'Deletar', onPress: () => {} },
        ]}
      />,
    );
    expect(screen.getByText('Editar')).toBeTruthy();
    expect(screen.getByText('Deletar')).toBeTruthy();
  });

  it('chama onPress do item ao pressionar', () => {
    const onPressEditar = jest.fn();
    render(
      <Menu
        visible={true}
        onDismiss={() => {}}
        anchor={<Button>Anchor</Button>}
        items={[{ label: 'Editar', onPress: onPressEditar }]}
      />,
    );
    fireEvent.press(screen.getByText('Editar'));
    expect(onPressEditar).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress de item desabilitado', () => {
    const onPressDisabled = jest.fn();
    render(
      <Menu
        visible={true}
        onDismiss={() => {}}
        anchor={<Button>Anchor</Button>}
        items={[{ label: 'Bloqueado', onPress: onPressDisabled, disabled: true }]}
      />,
    );
    fireEvent.press(screen.getByText('Bloqueado'));
    expect(onPressDisabled).not.toHaveBeenCalled();
  });
});
