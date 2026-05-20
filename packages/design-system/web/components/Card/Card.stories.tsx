import type { Meta, StoryObj } from '@storybook/react';
import { Button, Typography } from '@mui/material';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Título do card',
    subtitle: 'Subtítulo opcional',
    children: (
      <Typography variant="body2" color="text.secondary">
        Conteúdo do card. Pode conter texto, listas ou qualquer elemento React.
      </Typography>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: 'Card com ações',
    subtitle: 'Última atualização: hoje',
    children: (
      <Typography variant="body2" color="text.secondary">
        Este card possui botões de ação na parte inferior.
      </Typography>
    ),
    actions: (
      <>
        <Button size="small">Ver mais</Button>
        <Button size="small" color="error">
          Remover
        </Button>
      </>
    ),
  },
};

export const WithMedia: Story = {
  args: {
    title: 'Card com imagem',
    subtitle: 'Foto de capa',
    media: {
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      alt: 'Montanha ao amanhecer',
      height: 160,
    },
    children: (
      <Typography variant="body2" color="text.secondary">
        Card com imagem de capa exibida acima do conteúdo.
      </Typography>
    ),
  },
};
