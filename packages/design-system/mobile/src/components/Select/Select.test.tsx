import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { Select } from './Select';

const options = [
  { label: 'React Native', value: 'rn' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Expo', value: 'expo' },
];

describe('Select', () => {
  it('renderiza o placeholder quando nenhum valor selecionado', () => {
    render(
      <Select
        value=""
        onChange={() => {}}
        options={options}
        placeholder="Escolha uma opção"
        testID="select"
      />,
    );
    expect(screen.getByText('Escolha uma opção')).toBeTruthy();
  });

  it('renderiza o label do valor selecionado', () => {
    render(<Select value="rn" onChange={() => {}} options={options} testID="select" />);
    expect(screen.getByText('React Native')).toBeTruthy();
  });

  it('mostra as opções ao pressionar o trigger', () => {
    render(<Select value="" onChange={() => {}} options={options} testID="select" />);
    fireEvent.press(screen.getByTestId('select-trigger'));
    expect(screen.getByText('React Native')).toBeTruthy();
    expect(screen.getByText('Flutter')).toBeTruthy();
  });

  it('chama onChange com o valor da opção pressionada', () => {
    const onChange = jest.fn();
    render(<Select value="" onChange={onChange} options={options} testID="select" />);
    fireEvent.press(screen.getByTestId('select-trigger'));
    fireEvent.press(screen.getByText('Flutter'));
    expect(onChange).toHaveBeenCalledWith('flutter');
  });
});
