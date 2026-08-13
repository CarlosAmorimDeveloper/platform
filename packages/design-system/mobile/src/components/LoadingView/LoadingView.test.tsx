import React from 'react';
import { render, screen } from '../../test-utils';
import { LoadingView } from './LoadingView';

describe('LoadingView', () => {
  it('renderiza o indicador de loading quando visible=true', () => {
    render(<LoadingView visible={true} testID="loading-view" />);
    expect(screen.getByTestId('loading-view')).toBeTruthy();
  });

  it('não renderiza nada quando visible=false', () => {
    render(<LoadingView visible={false} testID="loading-view" />);
    expect(screen.queryByTestId('loading-view')).toBeNull();
  });

  it('é visível por padrão quando visible não é passado', () => {
    render(<LoadingView testID="loading-view" />);
    expect(screen.getByTestId('loading-view')).toBeTruthy();
  });

  it('renderiza a mensagem quando fornecida', () => {
    render(<LoadingView message="Carregando tickets..." />);
    expect(screen.getByText('Carregando tickets...')).toBeTruthy();
  });

  it('não renderiza mensagem quando não é fornecida', () => {
    render(<LoadingView testID="loading-view" />);
    expect(screen.queryByText('Carregando tickets...')).toBeNull();
  });
});
