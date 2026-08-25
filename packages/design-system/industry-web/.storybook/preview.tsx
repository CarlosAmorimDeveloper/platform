import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import '@industry/tokens/styles.css';

const WithTheme: Decorator = (Story) => {
  return (
    <div
      style={{
        background: 'var(--color-bg)',
        color: 'var(--color-text)',
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
