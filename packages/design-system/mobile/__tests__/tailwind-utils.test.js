'use strict';

const { toPx, mapToPx } = require('../tailwind-utils');

describe('toPx', () => {
  it('converte inteiro positivo para string px', () => {
    expect(toPx(16)).toBe('16px');
  });

  it('converte zero para "0px"', () => {
    expect(toPx(0)).toBe('0px');
  });

  it('converte valores decimais', () => {
    expect(toPx(1.5)).toBe('1.5px');
  });

  it('converte valores grandes', () => {
    expect(toPx(9999)).toBe('9999px');
  });
});

describe('mapToPx', () => {
  it('converte todos os valores de um objeto para strings px', () => {
    const input = { sm: 2, md: 4, lg: 8 };
    expect(mapToPx(input)).toEqual({ sm: '2px', md: '4px', lg: '8px' });
  });

  it('mantém as chaves originais intactas', () => {
    const input = { 0: 0, 1: 4, 2: 8 };
    const result = mapToPx(input);
    expect(Object.keys(result)).toEqual(['0', '1', '2']);
  });

  it('converte zero para "0px"', () => {
    expect(mapToPx({ none: 0 })).toEqual({ none: '0px' });
  });

  it('retorna objeto vazio quando recebe objeto vazio', () => {
    expect(mapToPx({})).toEqual({});
  });

  it('converte corretamente os tokens reais de spacing de @ds/tokens', () => {
    const spacing = { 0: 0, 1: 4, 2: 8, 4: 16, 8: 32 };
    const result = mapToPx(spacing);
    expect(result['0']).toBe('0px');
    expect(result['1']).toBe('4px');
    expect(result['4']).toBe('16px');
    expect(result['8']).toBe('32px');
  });

  it('converte corretamente os tokens reais de radii de @ds/tokens', () => {
    const radii = { none: 0, sm: 2, base: 4, md: 6, lg: 8, full: 9999 };
    const result = mapToPx(radii);
    expect(result.none).toBe('0px');
    expect(result.sm).toBe('2px');
    expect(result.lg).toBe('8px');
    expect(result.full).toBe('9999px');
  });

  it('converte corretamente os tokens reais de fontSizes de @ds/tokens', () => {
    const fontSizes = { xs: 12, sm: 14, base: 16, lg: 18, xl: 20 };
    const result = mapToPx(fontSizes);
    expect(result.xs).toBe('12px');
    expect(result.base).toBe('16px');
    expect(result.xl).toBe('20px');
  });
});
