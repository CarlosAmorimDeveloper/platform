import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renderiza a mensagem', () => {
    render(<ErrorView message="Não foi possível carregar os dados" />);
    expect(screen.getByText('Não foi possível carregar os dados')).toBeTruthy();
  });

  it('renderiza o título quando fornecido', () => {
    render(<ErrorView title="Algo deu errado" message="Tente novamente mais tarde" />);
    expect(screen.getByText('Algo deu errado')).toBeTruthy();
  });

  it('não renderiza título quando não é fornecido', () => {
    render(<ErrorView message="Erro genérico" />);
    expect(screen.queryByText('Algo deu errado')).toBeNull();
  });

  it('renderiza o botão de retry com o label padrão quando onRetry é fornecido', () => {
    const onRetry = jest.fn();
    render(<ErrorView message="Erro ao carregar" onRetry={onRetry} />);
    expect(screen.getByText('Tentar novamente')).toBeTruthy();
  });

  it('chama onRetry ao pressionar o botão de retry', () => {
    const onRetry = jest.fn();
    render(<ErrorView message="Erro ao carregar" onRetry={onRetry} />);
    fireEvent.press(screen.getByText('Tentar novamente'));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('aceita retryLabel customizado', () => {
    const onRetry = jest.fn();
    render(<ErrorView message="Erro ao carregar" onRetry={onRetry} retryLabel="Recarregar" />);
    expect(screen.getByText('Recarregar')).toBeTruthy();
  });

  it('não renderiza botão de retry quando onRetry não é fornecido', () => {
    render(<ErrorView message="Erro ao carregar" />);
    expect(screen.queryByText('Tentar novamente')).toBeNull();
  });

  it('renderiza com testID', () => {
    render(<ErrorView message="Erro" testID="error-view" />);
    expect(screen.getByTestId('error-view')).toBeTruthy();
  });
});
