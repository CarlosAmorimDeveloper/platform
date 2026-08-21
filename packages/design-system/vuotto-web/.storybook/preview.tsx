import type { Preview, Decorator } from '@storybook/react';
import React, { useEffect } from 'react';
import '@vuotto/tokens/styles.css';

const WithTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme as 'dark' | 'light';
  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);
  return (
    <div
      style={{
        background: 'var(--bg-canvas)',
        color: 'var(--text-primary)',
        minHeight: '100vh',
        padding: 24,
      }}
    >
      <Story />
    </div>
  );
};

const preview: Preview = {
  decorators: [WithTheme],
  globalTypes: {
    theme: {
      description: 'Tema Vuotto Tech',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark (padrão)' },
          { value: 'light', title: 'Light' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'dark',
  },
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
