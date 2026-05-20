import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { AppBar } from '../src/components/AppBar';

describe('AppBar', () => {
  it('renderiza o título', () => {
    render(<AppBar title="Meu App" />);
    expect(screen.getByText('Meu App')).toBeTruthy();
  });

  it('não renderiza botão de voltar quando onBackPress não é fornecido', () => {
    render(<AppBar title="Título" testID="appbar" />);
    expect(screen.queryByTestId('appbar-back')).toBeNull();
  });

  it('renderiza botão de voltar quando onBackPress é fornecido', () => {
    render(<AppBar title="Título" onBackPress={() => {}} testID="appbar" />);
    expect(screen.getByTestId('appbar-back')).toBeTruthy();
  });

  it('chama onBackPress ao pressionar botão de voltar', () => {
    const onBackPress = jest.fn();
    render(<AppBar title="Título" onBackPress={onBackPress} testID="appbar" />);
    fireEvent.press(screen.getByTestId('appbar-back'));
    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza botões de ação', () => {
    const onPress = jest.fn();
    render(
      <AppBar
        title="Título"
        actions={[{ icon: 'magnify', onPress, accessibilityLabel: 'Buscar' }]}
      />,
    );
    fireEvent.press(screen.getByLabelText('Buscar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
