'use strict';

// Mock jiti antes de qualquer require do config
jest.mock('jiti', () =>
  () => () => ({
    colors: {
      primary: { 50: '#EEF2FF', 500: '#6366F1', 900: '#312E81' },
      neutral: { 0: '#FFFFFF', 500: '#6B7280', 1000: '#000000' },
    },
    spacing: { 0: 0, 1: 4, 2: 8, 4: 16, 8: 32 },
    fontSizes: { xs: 12, sm: 14, base: 16, lg: 18 },
    radii: { none: 0, sm: 2, base: 4, lg: 8, full: 9999 },
  })
);

// Mock do preset do NativeWind (módulo virtual — não instalado no ambiente de testes)
jest.mock(
  'nativewind/preset',
  () => ({ plugins: [], theme: {} }),
  { virtual: true }
);

const config = require('../tailwind.config');

describe('tailwind.config — estrutura geral', () => {
  it('exporta um objeto de configuração válido', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  it('inclui o preset do NativeWind', () => {
    expect(Array.isArray(config.presets)).toBe(true);
    expect(config.presets).toHaveLength(1);
  });

  it('define o campo content como array não-vazio', () => {
    expect(Array.isArray(config.content)).toBe(true);
    expect(config.content.length).toBeGreaterThan(0);
  });

  it('contém a seção theme.extend', () => {
    expect(config.theme).toBeDefined();
    expect(config.theme.extend).toBeDefined();
  });
});

describe('tailwind.config — cores de @ds/tokens', () => {
  it('mapeia colors.primary do token diretamente (sem conversão)', () => {
    expect(config.theme.extend.colors.primary[500]).toBe('#6366F1');
    expect(config.theme.extend.colors.primary[50]).toBe('#EEF2FF');
  });

  it('mapeia colors.neutral do token diretamente', () => {
    expect(config.theme.extend.colors.neutral[0]).toBe('#FFFFFF');
    expect(config.theme.extend.colors.neutral[1000]).toBe('#000000');
  });
});

describe('tailwind.config — spacing de @ds/tokens', () => {
  it('converte valores numéricos de spacing para strings px', () => {
    expect(config.theme.extend.spacing['0']).toBe('0px');
    expect(config.theme.extend.spacing['1']).toBe('4px');
    expect(config.theme.extend.spacing['4']).toBe('16px');
    expect(config.theme.extend.spacing['8']).toBe('32px');
  });
});

describe('tailwind.config — fontSize de @ds/tokens', () => {
  it('converte valores numéricos de fontSizes para strings px', () => {
    expect(config.theme.extend.fontSize.xs).toBe('12px');
    expect(config.theme.extend.fontSize.base).toBe('16px');
    expect(config.theme.extend.fontSize.lg).toBe('18px');
  });
});

describe('tailwind.config — borderRadius de @ds/tokens', () => {
  it('converte valores numéricos de radii para strings px', () => {
    expect(config.theme.extend.borderRadius.none).toBe('0px');
    expect(config.theme.extend.borderRadius.sm).toBe('2px');
    expect(config.theme.extend.borderRadius.lg).toBe('8px');
    expect(config.theme.extend.borderRadius.full).toBe('9999px');
  });
});
