const path = require('path');

// jiti enables TypeScript imports at config-time without a build step
const jiti = require('jiti')(__filename);
const { colors, spacing, fontSizes, radii } = jiti('@ds/tokens');

// Token values are unitless px numbers — Tailwind expects CSS strings
const toPx = (val) => `${val}px`;
const mapToPx = (obj) =>
  Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, toPx(v)]));

/** @type {import('tailwindcss').Config} */
module.exports = {
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
