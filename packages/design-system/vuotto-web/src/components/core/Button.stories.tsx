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
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="primary" iconAfter="arrow-right">
        Publicar formulário
      </Button>
      <Button variant="secondary" icon="plus">
        Adicionar campo
      </Button>
      <Button variant="ghost">Cancelar</Button>
      <Button variant="danger">Excluir</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Pequeno</Button>
      <Button size="md">Médio</Button>
      <Button size="lg">Grande</Button>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button>Padrão</Button>
      <Button loading>Carregando</Button>
      <Button disabled>Desabilitado</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { children: 'Ocupa a largura toda', fullWidth: true },
};
