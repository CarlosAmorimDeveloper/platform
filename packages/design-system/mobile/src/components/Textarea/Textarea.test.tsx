import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen, fireEvent } from '../../test-utils';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('renderiza o label', () => {
    render(<Textarea value="" onChangeText={() => {}} label="Descrição" />);
    // PaperTextInput renders the label in multiple animated text nodes; use
    // getAllByText and assert at least one is present.
    expect(screen.getAllByText('Descrição').length).toBeGreaterThan(0);
  });

  it('chama onChangeText com o novo texto', () => {
    const onChangeText = jest.fn();
    render(<Textarea value="" onChangeText={onChangeText} label="Notas" testID="textarea" />);
    fireEvent.changeText(screen.getByTestId('textarea'), 'Texto longo de exemplo');
    expect(onChangeText).toHaveBeenCalledWith('Texto longo de exemplo');
  });

  it('é multiline por padrão, com numberOfLines=4', () => {
    render(<Textarea value="" onChangeText={() => {}} label="Descrição" testID="textarea" />);
    const input = screen.getByTestId('textarea');
    expect(input.props.multiline).toBe(true);
    expect(input.props.numberOfLines).toBe(4);
  });

  it('aceita numberOfLines customizado', () => {
    render(
      <Textarea
        value=""
        onChangeText={() => {}}
        label="Descrição"
        numberOfLines={8}
        testID="textarea"
      />,
    );
    const input = screen.getByTestId('textarea');
    expect(input.props.numberOfLines).toBe(8);
  });

  it('aplica minHeight baseado em numberOfLines (necessário no iOS, onde numberOfLines é no-op)', () => {
    render(
      <Textarea
        value=""
        onChangeText={() => {}}
        label="Descrição"
        numberOfLines={8}
        testID="textarea"
      />,
    );
    const input = screen.getByTestId('textarea');
    const flattenedStyle = StyleSheet.flatten(input.props.style);
    expect(flattenedStyle.minHeight).toBe(8 * 24);
  });

  it('permite sobrescrever o contentStyle padrão via prop contentStyle', () => {
    render(
      <Textarea
        value=""
        onChangeText={() => {}}
        label="Descrição"
        contentStyle={{ backgroundColor: 'red' }}
        testID="textarea"
      />,
    );
    const input = screen.getByTestId('textarea');
    const flattenedStyle = StyleSheet.flatten(input.props.style);
    expect(flattenedStyle.backgroundColor).toBe('red');
    expect(flattenedStyle.minHeight).toBe(4 * 24);
  });

  it('renderiza mensagem de erro quando error é fornecido', () => {
    render(
      <Textarea value="" onChangeText={() => {}} label="Descrição" error="Campo obrigatório" />,
    );
    expect(screen.getByText('Campo obrigatório')).toBeTruthy();
  });

  it('renderiza como desabilitado', () => {
    render(<Textarea value="" onChangeText={() => {}} label="Campo" disabled testID="textarea" />);
    const input = screen.getByTestId('textarea');
    expect(input.props.editable === false || input.props.disabled === true).toBe(true);
  });
});
