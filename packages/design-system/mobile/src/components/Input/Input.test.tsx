import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Input } from './Input';

describe('Input', () => {
  it('renderiza o label', () => {
    render(<Input value="" onChangeText={() => {}} label="E-mail" />);
    // PaperTextInput renders the label in multiple animated text nodes; use
    // getAllByText and assert at least one is present.
    expect(screen.getAllByText('E-mail').length).toBeGreaterThan(0);
  });

  it('chama onChangeText com o novo texto', () => {
    const onChangeText = jest.fn();
    render(<Input value="" onChangeText={onChangeText} label="Nome" testID="input" />);
    fireEvent.changeText(screen.getByTestId('input'), 'Carlos');
    expect(onChangeText).toHaveBeenCalledWith('Carlos');
  });

  it('renderiza mensagem de erro quando error é fornecido', () => {
    render(<Input value="" onChangeText={() => {}} label="Senha" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeTruthy();
  });

  it('não renderiza mensagem de erro quando error não é fornecido', () => {
    render(<Input value="" onChangeText={() => {}} label="Nome" />);
    expect(screen.queryByText('Campo obrigatório')).toBeNull();
  });

  it('renderiza em modo multiline', () => {
    render(
      <Input
        value=""
        onChangeText={() => {}}
        label="Descrição"
        multiline
        numberOfLines={4}
        testID="input"
      />,
    );
    const input = screen.getByTestId('input');
    expect(input.props.multiline).toBe(true);
  });

  it('renderiza como desabilitado', () => {
    render(<Input value="" onChangeText={() => {}} label="Campo" disabled testID="input" />);
    // PaperTextInput forwards `disabled` as `editable={false}` on the inner
    // native TextInput; the testID is on an outer View that has no `disabled`
    // prop, so we check `editable === false` instead.
    const input = screen.getByTestId('input');
    expect(input.props.editable === false || input.props.disabled === true).toBe(true);
  });
});
