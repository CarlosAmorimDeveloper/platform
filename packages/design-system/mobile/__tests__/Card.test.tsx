import React from 'react';
import { Text } from 'react-native';
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

  it('renderiza children dentro de PaperCard.Content', () => {
    render(
      <Card testID="card">
        <Text testID="child-text">Conteúdo</Text>
      </Card>,
    );
    expect(screen.getByTestId('child-text')).toBeTruthy();
  });

  it('não quebra quando coverUri é fornecido', () => {
    render(<Card testID="card" coverUri="https://picsum.photos/400/200" title="Test" />);
    expect(screen.getByTestId('card')).toBeTruthy();
  });
});
