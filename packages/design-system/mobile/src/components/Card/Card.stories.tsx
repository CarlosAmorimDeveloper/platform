import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    coverUri: { control: 'text' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Título do Card',
    subtitle: 'Subtítulo opcional',
    children: <Text>Conteúdo do card aqui.</Text>,
  },
};

export const Pressionavel: Story = {
  args: {
    title: 'Card Pressionável',
    subtitle: 'Toque para interagir',
    onPress: () => {},
  },
};

export const ComCover: Story = {
  args: {
    title: 'Com Imagem',
    coverUri: 'https://picsum.photos/400/200',
    children: <Text>Descrição abaixo da imagem.</Text>,
  },
};

export const SomenteTitulo: Story = {
  args: { title: 'Apenas Título' },
};
