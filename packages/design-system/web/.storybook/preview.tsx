import type { Preview, Decorator } from '@storybook/react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { theme } from '../theme';
import '../styles/globals.css';

const withTheme: Decorator = (Story) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
