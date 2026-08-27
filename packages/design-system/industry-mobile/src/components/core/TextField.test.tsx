import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { color, semanticColor } from '@industry/tokens';
import { TextField } from './TextField';

describe('TextField', () => {
  it('renders the label when given', () => {
    const { getByText } = render(<TextField label="Nome" placeholder="Digite seu nome" />);
    expect(getByText('Nome')).toBeTruthy();
  });

  it('renders no label when omitted', () => {
    const { queryByText } = render(<TextField placeholder="Digite seu nome" />);
    expect(queryByText('Nome')).toBeNull();
  });

  it('renders the hint when given and there is no error', () => {
    const { getByText } = render(<TextField hint="Campo opcional" placeholder="x" />);
    expect(getByText('Campo opcional')).toBeTruthy();
  });

  it('renders the error instead of the hint when both are given', () => {
    const { getByText, queryByText } = render(
      <TextField hint="Campo opcional" error="Campo obrigatório" placeholder="x" />,
    );
    expect(getByText('Campo obrigatório')).toBeTruthy();
    expect(queryByText('Campo opcional')).toBeNull();
  });

  it('calls onFocus and onBlur and updates the border color accordingly', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    const { getByPlaceholderText } = render(
      <TextField placeholder="Digite algo" onFocus={onFocus} onBlur={onBlur} />,
    );
    const input = getByPlaceholderText('Digite algo');

    expect(input.props.style).toMatchObject({ borderColor: color.divider });

    fireEvent(input, 'focus', { nativeEvent: {} });
    expect(onFocus).toHaveBeenCalled();
    expect(input.props.style).toMatchObject({ borderColor: color.accent });

    fireEvent(input, 'blur', { nativeEvent: {} });
    expect(onBlur).toHaveBeenCalled();
    expect(input.props.style).toMatchObject({ borderColor: color.divider });
  });

  it('uses the danger color for the border when there is an error, regardless of focus', () => {
    const { getByPlaceholderText } = render(<TextField error="Inválido" placeholder="x" />);
    expect(getByPlaceholderText('x').props.style).toMatchObject({
      borderColor: semanticColor.danger,
    });
  });

  it('uses the string label as the accessibility label', () => {
    const { getByLabelText } = render(<TextField label="Nome" placeholder="x" />);
    expect(getByLabelText('Nome')).toBeTruthy();
  });

  it('does not set an accessibility label from a non-string label', () => {
    const { getByPlaceholderText } = render(
      <TextField label={<Text>Nome</Text>} placeholder="x" />,
    );
    expect(getByPlaceholderText('x').props.accessibilityLabel).toBeUndefined();
  });
});
