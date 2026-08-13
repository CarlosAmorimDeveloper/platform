import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it('renderiza a descrição', () => {
    render(<ErrorView description="Não foi possível carregar os dados" />);
    expect(screen.getByText('Não foi possível carregar os dados')).toBeTruthy();
  });

  it('renderiza o título quando fornecido', () => {
    render(<ErrorView title="Algo deu errado" description="Tente novamente mais tarde" />);
    expect(screen.getByText('Algo deu errado')).toBeTruthy();
  });

  it('não renderiza título quando não é fornecido', () => {
    render(<ErrorView description="Erro genérico" />);
    expect(screen.queryByText('Algo deu errado')).toBeNull();
  });

  it('renderiza com o ícone padrão quando icon não é fornecido', () => {
    render(<ErrorView description="Erro genérico" testID="error-view" />);
    expect(screen.getByTestId('error-view')).toBeTruthy();
  });

  it('não quebra ao renderizar com icon explicitamente vazio (opt-out)', () => {
    render(<ErrorView description="Erro genérico" icon="" testID="error-view" />);
    expect(screen.getByTestId('error-view')).toBeTruthy();
  });

  it('renderiza o botão de ação com o label padrão quando onAction é fornecido', () => {
    const onAction = jest.fn();
    render(<ErrorView description="Erro ao carregar" onAction={onAction} />);
    expect(screen.getByText('Tentar novamente')).toBeTruthy();
  });

  it('chama onAction ao pressionar o botão de ação', () => {
    const onAction = jest.fn();
    render(<ErrorView description="Erro ao carregar" onAction={onAction} />);
    fireEvent.press(screen.getByText('Tentar novamente'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('aceita actionLabel customizado', () => {
    const onAction = jest.fn();
    render(
      <ErrorView description="Erro ao carregar" onAction={onAction} actionLabel="Recarregar" />,
    );
    expect(screen.getByText('Recarregar')).toBeTruthy();
  });

  it('não renderiza botão de ação quando onAction não é fornecido', () => {
    render(<ErrorView description="Erro ao carregar" />);
    expect(screen.queryByText('Tentar novamente')).toBeNull();
  });

  it('renderiza com testID', () => {
    render(<ErrorView description="Erro" testID="error-view" />);
    expect(screen.getByTestId('error-view')).toBeTruthy();
  });
});
