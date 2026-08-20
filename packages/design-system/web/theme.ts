import { createTheme } from '@mui/material/styles';
import {
  breakpoints,
  colors,
  fontSizes,
  fontWeights,
  semanticColors,
  semanticRadii,
  zIndices,
} from '@ds/tokens';

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: semanticColors.textOnAccent,
    },
    // MUI fills any palette color left unset with its own default (e.g.
    // `secondary` defaults to `purple[500]`) — defined explicitly here so
    // no component ever falls back to a library default instead of a token.
    secondary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: semanticColors.textOnAccent,
    },
    error: {
      main: semanticColors.error,
    },
    success: {
      main: colors.success[500],
    },
    warning: {
      main: colors.warning[500],
    },
    info: {
      main: colors.info[500],
    },
    text: {
      primary: semanticColors.textPrimary,
      secondary: semanticColors.textSecondary,
    },
    divider: semanticColors.border,
    background: {
      default: semanticColors.background,
      paper: semanticColors.surface,
    },
  },
  typography: {
    fontFamily: 'inherit',
    fontSize: fontSizes.sm,
  },
  shape: {
    borderRadius: semanticRadii.radiusBase,
  },
  // `xs` isn't part of the DS breakpoint set (POR-81 defines sm/md/lg/xl
  // only) — MUI requires it regardless, so it's set inline here, not as a
  // token.
  breakpoints: {
    values: {
      xs: 0,
      sm: breakpoints.sm,
      md: breakpoints.md,
      lg: breakpoints.lg,
      xl: breakpoints.xl,
    },
  },
  // Aligns MUI's stacking order to the DS's zIndex scale instead of
  // leaving it on MUI's own defaults (the gap flagged in POR-74/75).
  // `tooltip` has no DS role yet, so it keeps MUI's default.
  zIndex: {
    appBar: zIndices.header,
    drawer: zIndices.overlay,
    modal: zIndices.modal,
    snackbar: zIndices.toast,
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
          fontWeight: Number(fontWeights.medium),
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
