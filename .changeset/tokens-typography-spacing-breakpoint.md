---
'@ds/tokens': minor
'@ds/web': patch
'@ds/mobile': patch
---

`@ds/tokens` ganha os grupos de token que faltavam: `fontWeights`, `lineHeights`, `letterSpacings` (POR-79), `borderWidths` e `elevationLevels` semântico com adaptadores `boxShadow()` (web) / `shadowStyle()` (native) (POR-80), `breakpoints` e `zIndices` (POR-81). `spacing` estendido até a chave `128`. `semanticColors` ganha `surfaceRaised`, `textDisabled`, `borderStrong`, `borderFocus`, `accentHover`, `accentPressed`, `success` e `warning` (POR-78).

Novos adaptadores: `@ds/tokens/platform/web` ganha `em()`, `fluidFontSize()` e `boxShadow()`; `@ds/tokens/platform/native` (novo) exporta `resolveLineHeight()`, `resolveLetterSpacing()` e `shadowStyle()`.

`@ds/web` e `@ds/mobile` migram para os tokens novos onde já havia correspondência exata ou valor mágico identificado na auditoria POR-74/75: `fontWeight` hardcoded em `web/theme.ts` e nos componentes mobile `Alert`/`ErrorView`/`EmptyState`; `breakpoints`/`zIndex` do tema MUI passam a vir de `@ds/tokens` em vez de defaults implícitos; o `zIndex: 999`/`elevation: 999` arbitrário do `Snackbar` mobile vira `zIndices.toast`/`shadowStyle(3).elevation`. `EmptyState` também corrige a inconsistência de texto secundário (`neutral[500]` → `neutral[600]`) apontada no POR-75.
