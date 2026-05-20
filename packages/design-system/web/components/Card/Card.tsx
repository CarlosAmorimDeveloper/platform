import { Card as MuiCard, CardActions, CardContent, CardHeader, CardMedia } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  media?: { src: string; alt: string; height?: number };
  sx?: SxProps<Theme>;
}

export function Card({ title, subtitle, children, actions, media, sx }: CardProps) {
  return (
    <MuiCard sx={sx}>
      {(title || subtitle) && <CardHeader title={title} subheader={subtitle} />}
      {media && (
        <CardMedia component="img" height={media.height ?? 194} image={media.src} alt={media.alt} />
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}
