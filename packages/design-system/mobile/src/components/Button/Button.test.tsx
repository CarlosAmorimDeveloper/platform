import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('renderiza o texto do children', () => {
    render(<Button>Adicionar</Button>);
    expect(screen.getByText('Adicionar')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Pressionar</Button>);
    fireEvent.press(screen.getByText('Pressionar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled=true', () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} disabled testID="btn">
        Desabilitado
      </Button>,
    );
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renderiza com testID', () => {
    render(<Button testID="meu-botao">OK</Button>);
    expect(screen.getByTestId('meu-botao')).toBeTruthy();
  });

  it('aceita todas as variantes sem erros', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });
});
