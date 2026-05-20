import { AppBar as MuiAppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import type { SxProps, Theme } from '@mui/material/styles';
import type { ReactNode } from 'react';

interface AppBarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: ReactNode;
  position?: 'static' | 'sticky' | 'fixed';
  sx?: SxProps<Theme>;
}

export function AppBar({ title, onMenuClick, actions, position = 'static', sx }: AppBarProps) {
  return (
    <MuiAppBar position={position} sx={sx}>
      <Toolbar>
        {onMenuClick && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Toolbar>
    </MuiAppBar>
  );
}
