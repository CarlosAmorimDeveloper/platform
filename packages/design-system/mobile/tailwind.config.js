// jiti enables TypeScript imports at config-time without a build step
const jiti = require('jiti')(__filename);
const { colors, spacing, fontSizes, radii } = jiti('@ds/tokens');

const { mapToPx } = require('./tailwind-utils');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Consuming apps should extend this array with their own source paths
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      spacing: mapToPx(spacing),
      fontSize: mapToPx(fontSizes),
      borderRadius: mapToPx(radii),
    },
  },
  plugins: [],
};
