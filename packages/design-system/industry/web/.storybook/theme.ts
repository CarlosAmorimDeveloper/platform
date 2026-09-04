import { create } from '@storybook/theming/create';
import { color, neutral, accentRamp } from '@industry/tokens';

export const industryTheme = create({
  base: 'dark',
  brandTitle: 'Industry',

  appBg: color.bg,
  appContentBg: color.bg,
  appPreviewBg: color.bg,
  appBorderColor: color.divider,
  appBorderRadius: 2,

  barBg: color.surface,
  barTextColor: neutral['400'],
  barSelectedColor: color.accent,
  barHoverColor: color.accent,

  colorPrimary: color.accent,
  colorSecondary: color.accent,
  textColor: color.text,
  textInverseColor: color.bg,
  textMutedColor: neutral['400'],

  inputBg: color.surface2,
  inputBorder: color.divider,
  inputTextColor: color.text,
  inputBorderRadius: 2,

  booleanBg: color.surface2,
  booleanSelectedBg: accentRamp['700'],

  fontBase: 'system-ui, sans-serif',
  fontCode: 'ui-monospace, SFMono-Regular, Menlo, monospace',
});
