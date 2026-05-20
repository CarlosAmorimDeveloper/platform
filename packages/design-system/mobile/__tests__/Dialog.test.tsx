import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Dialog } from '../src/components/Dialog';
import { Button } from '../src/components/Button';

describe('Dialog', () => {
  it('renderiza o conteúdo quando visible=true', () => {
    render(
      <Dialog visible={true} onDismiss={() => {}} title="Confirmação">
        <></>
      </Dialog>,
    );
    expect(screen.getByText('Confirmação')).toBeTruthy();
  });

  it('não renderiza o conteúdo quando visible=false', () => {
    render(
      <Dialog visible={false} onDismiss={() => {}} title="Confirmação">
        <></>
      </Dialog>,
    );
    expect(screen.queryByText('Confirmação')).toBeNull();
  });

  it('chama onDismiss ao fechar', () => {
    const onDismiss = jest.fn();
    render(
      <Dialog visible={true} onDismiss={onDismiss} title="Aviso" testID="dialog">
        <></>
      </Dialog>,
    );
    // Paper Dialog expõe onDismiss no wrapper
    const dialog = screen.getByTestId('dialog');
    fireEvent(dialog, 'onDismiss');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renderiza actions passados como prop', () => {
    render(
      <Dialog
        visible={true}
        onDismiss={() => {}}
        title="Confirmar"
        actions={<Button testID="action-btn">Confirmar</Button>}
      >
        <></>
      </Dialog>,
    );
    expect(screen.getByTestId('action-btn')).toBeTruthy();
  });
});
