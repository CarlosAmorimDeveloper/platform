import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Card } from '../src/components/Card';

describe('Card', () => {
  it('renderiza sem erros com testID', () => {
    render(
      <Card testID="card">
        <></>
      </Card>,
    );
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('renderiza título e subtítulo', () => {
    render(<Card testID="card" title="Título" subtitle="Subtítulo" />);
    expect(screen.getByText('Título')).toBeTruthy();
    expect(screen.getByText('Subtítulo')).toBeTruthy();
  });

  it('chama onPress ao pressionar', () => {
    const onPress = jest.fn();
    render(<Card testID="card" onPress={onPress} title="Pressionar" />);
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não é pressionável quando onPress não é fornecido', () => {
    render(<Card testID="card" title="Sem press" />);
    const card = screen.getByTestId('card');
    expect(card.props.onPress).toBeUndefined();
  });
});
