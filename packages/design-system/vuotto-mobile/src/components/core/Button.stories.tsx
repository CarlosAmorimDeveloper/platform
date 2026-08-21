import { View } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant="primary" iconAfter="ArrowRight">
        Publicar
      </Button>
      <Button variant="secondary" icon="Plus">
        Adicionar
      </Button>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="danger">Excluir</Button>
    </View>
  ),
};

export const States: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button>Padrão</Button>
      <Button loading>Carregando</Button>
      <Button disabled>Desabilitado</Button>
    </View>
  ),
};
