import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Core/TextField',
  component: TextField,
  parameters: { svgKnownIssue: true },
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="Nome" placeholder="Digite seu nome" />
    </View>
  ),
};

export const WithHint: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="E-mail" hint="Usamos só para login" />
    </View>
  ),
};

export const WithError: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="E-mail" error="E-mail inválido" defaultValue="not-an-email" />
    </View>
  ),
};

export const Multiline: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="Notas" multiline numberOfLines={4} />
    </View>
  ),
};

export const WithSecureToggle: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="Senha" placeholder="Sua senha" secureToggle />
    </View>
  ),
};
