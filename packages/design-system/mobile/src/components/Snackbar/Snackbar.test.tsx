import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  it('renderiza a mensagem quando visible=true', () => {
    render(<Snackbar visible={true} onDismiss={() => {}} message="Salvo com sucesso" />);
    expect(screen.getByText('Salvo com sucesso')).toBeTruthy();
  });

  it('não renderiza a mensagem quando visible=false', () => {
    render(<Snackbar visible={false} onDismiss={() => {}} message="Salvo com sucesso" />);
    expect(screen.queryByText('Salvo com sucesso')).toBeNull();
  });

  it('renderiza botão de ação quando action é fornecido', () => {
    render(
      <Snackbar
        visible={true}
        onDismiss={() => {}}
        message="Item deletado"
        action={{ label: 'Desfazer', onPress: () => {} }}
      />,
    );
    expect(screen.getByText('Desfazer')).toBeTruthy();
  });

  it('chama action.onPress ao pressionar o botão de ação', () => {
    const onPressMock = jest.fn();
    render(
      <Snackbar
        visible={true}
        onDismiss={() => {}}
        message="Item deletado"
        action={{ label: 'Desfazer', onPress: onPressMock }}
      />,
    );
    fireEvent.press(screen.getByText('Desfazer'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
