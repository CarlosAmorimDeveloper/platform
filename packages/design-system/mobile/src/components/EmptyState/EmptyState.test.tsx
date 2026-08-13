import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renderiza o título', () => {
    render(<EmptyState title="Nenhum item encontrado" />);
    expect(screen.getByText('Nenhum item encontrado')).toBeTruthy();
  });

  it('renderiza a descrição quando fornecida', () => {
    render(<EmptyState title="Vazio" description="Adicione o primeiro item" />);
    expect(screen.getByText('Adicione o primeiro item')).toBeTruthy();
  });

  it('não renderiza descrição quando não é fornecida', () => {
    render(<EmptyState title="Vazio" />);
    expect(screen.queryByText('Adicione o primeiro item')).toBeNull();
  });

  it('renderiza o botão de ação quando actionLabel e onAction são fornecidos', () => {
    const onAction = jest.fn();
    render(<EmptyState title="Vazio" actionLabel="Adicionar item" onAction={onAction} />);
    fireEvent.press(screen.getByText('Adicionar item'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('não renderiza o botão de ação quando apenas actionLabel é fornecido', () => {
    render(<EmptyState title="Vazio" actionLabel="Adicionar item" />);
    expect(screen.queryByText('Adicionar item')).toBeNull();
  });

  it('não renderiza o botão de ação quando nenhum actionLabel/onAction é fornecido', () => {
    render(<EmptyState title="Vazio" />);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renderiza com testID', () => {
    render(<EmptyState title="Vazio" testID="empty-state" />);
    expect(screen.getByTestId('empty-state')).toBeTruthy();
  });
});
