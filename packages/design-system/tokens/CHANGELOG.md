# @ds/tokens

## 0.1.0

### Minor Changes

- 09e45c9: `@ds/tokens` ganha uma camada semântica (`semanticColors`, `semanticRadii`) entre os primitivos e o consumo por plataforma, além de um adaptador `@ds/tokens/platform/web` (`px()`/`rem()`). Primitivos foram movidos para `src/primitives/` mas continuam exportados no nível raiz do pacote (retrocompatível).

  `@ds/web` e `@ds/mobile` migraram `theme.ts` para consumir a camada semântica nos papéis já confirmados iguais entre as plataformas (POR-74/75). Duas mudanças de valor visuais:
  - `@ds/web`: `text.secondary` passa de `neutral[500]` para `neutral[600]` (alinha com o mobile).
  - `@ds/web`: `shape.borderRadius` padrão passa de `radii.lg` (8) para `radii.md` (6) (alinha com o `roundness` do mobile).

- c66e09a: `@ds/tokens` ganha os grupos de token que faltavam: `fontWeights`, `lineHeights`, `letterSpacings` (POR-79), `borderWidths` e `elevationLevels` semântico com adaptadores `boxShadow()` (web) / `shadowStyle()` (native) (POR-80), `breakpoints` e `zIndices` (POR-81). `spacing` estendido até a chave `128`. `semanticColors` ganha `surfaceRaised`, `textDisabled`, `borderStrong`, `borderFocus`, `accentHover`, `accentPressed`, `success` e `warning` (POR-78).

  Novos adaptadores: `@ds/tokens/platform/web` ganha `em()`, `fluidFontSize()` e `boxShadow()`; `@ds/tokens/platform/native` (novo) exporta `resolveLineHeight()`, `resolveLetterSpacing()` e `shadowStyle()`.

  `@ds/web` e `@ds/mobile` migram para os tokens novos onde já havia correspondência exata ou valor mágico identificado na auditoria POR-74/75: `fontWeight` hardcoded em `web/theme.ts` e nos componentes mobile `Alert`/`ErrorView`/`EmptyState`; `breakpoints`/`zIndex` do tema MUI passam a vir de `@ds/tokens` em vez de defaults implícitos; o `zIndex: 999`/`elevation: 999` arbitrário do `Snackbar` mobile vira `zIndices.toast`/`shadowStyle(3).elevation`. `EmptyState` também corrige a inconsistência de texto secundário (`neutral[500]` → `neutral[600]`) apontada no POR-75.
