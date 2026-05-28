import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renderiza o label', () => {
    render(<Checkbox checked={false} onValueChange={() => {}} label="Aceito os termos" />);
    expect(screen.getByText('Aceito os termos')).toBeTruthy();
  });

  it('chama onValueChange com true quando desmarcado e pressionado', () => {
    const onValueChange = jest.fn();
    render(<Checkbox checked={false} onValueChange={onValueChange} label="Item" testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('chama onValueChange com false quando marcado e pressionado', () => {
    const onValueChange = jest.fn();
    render(<Checkbox checked={true} onValueChange={onValueChange} label="Item" testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('não chama onValueChange quando disabled', () => {
    const onValueChange = jest.fn();
    render(
      <Checkbox checked={false} onValueChange={onValueChange} disabled label="Item" testID="cb" />,
    );
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
