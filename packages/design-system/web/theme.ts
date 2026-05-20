import { createTheme } from '@mui/material/styles';
import { colors, radii } from '@ds/tokens';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: colors.neutral[0],
    },
    error: {
      main: colors.error[500],
    },
    success: {
      main: colors.success[500],
    },
    warning: {
      main: colors.warning[500],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[500],
    },
    divider: colors.neutral[200],
    background: {
      default: colors.neutral[50],
      paper: colors.neutral[0],
    },
  },
  typography: {
    fontFamily: 'inherit',
    fontSize: 14,
  },
  shape: {
    borderRadius: radii.lg,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
  },
});
