# Changelog — @ds/mobile

## 0.0.1

### Patch Changes

- 83719af: Accessibility fixes (APP-96):
  - `Input`'s show/hide password icon now has an `accessibilityLabel` ("Mostrar senha"/"Ocultar senha") — previously unlabeled for screen readers.
  - `Chip` now has a `hitSlop` of 4px on each side to improve its touch target.
  - `Card` now accepts an `accessibilityLabel` prop, forwarded to the underlying Paper `Card`, so consumers with text-only content (e.g. a form summary card) can expose a single combined label instead of relying on fragmented child text.

- 38eb1b8: Fixes from full-repo code review:
  - `@ds/mobile`: `FAB` and `Card` no longer use `any` to cast the `style` prop — typed via `React.ComponentProps<typeof PaperX>['style']` instead.
  - `@ds/mobile`: `AppBar`'s back/action buttons no longer carry React Native Paper's default 6px margin (same fix `IconButton` already had).
  - `@ds/mobile`: `Snackbar`'s default `duration` raised from 1500ms to 6000ms, matching `@ds/web`'s `Snackbar` default.
  - `@ds/mobile`: `Radio` renamed to `RadioButton` (single toggle, wraps Paper's `RadioButton`) — it modeled a different abstraction than `@ds/web`'s `Radio` (a full radio group), so the shared name implied a parity that didn't exist.
  - `@ds/web`: every component now exports its `Props` type from its `index.ts` (previously only `@ds/mobile` did).

- 09e45c9: `@ds/tokens` ganha uma camada semântica (`semanticColors`, `semanticRadii`) entre os primitivos e o consumo por plataforma, além de um adaptador `@ds/tokens/platform/web` (`px()`/`rem()`). Primitivos foram movidos para `src/primitives/` mas continuam exportados no nível raiz do pacote (retrocompatível).

  `@ds/web` e `@ds/mobile` migraram `theme.ts` para consumir a camada semântica nos papéis já confirmados iguais entre as plataformas (POR-74/75). Duas mudanças de valor visuais:
  - `@ds/web`: `text.secondary` passa de `neutral[500]` para `neutral[600]` (alinha com o mobile).
  - `@ds/web`: `shape.borderRadius` padrão passa de `radii.lg` (8) para `radii.md` (6) (alinha com o `roundness` do mobile).

- c66e09a: `@ds/tokens` ganha os grupos de token que faltavam: `fontWeights`, `lineHeights`, `letterSpacings` (POR-79), `borderWidths` e `elevationLevels` semântico com adaptadores `boxShadow()` (web) / `shadowStyle()` (native) (POR-80), `breakpoints` e `zIndices` (POR-81). `spacing` estendido até a chave `128`. `semanticColors` ganha `surfaceRaised`, `textDisabled`, `borderStrong`, `borderFocus`, `accentHover`, `accentPressed`, `success` e `warning` (POR-78).

  Novos adaptadores: `@ds/tokens/platform/web` ganha `em()`, `fluidFontSize()` e `boxShadow()`; `@ds/tokens/platform/native` (novo) exporta `resolveLineHeight()`, `resolveLetterSpacing()` e `shadowStyle()`.

  `@ds/web` e `@ds/mobile` migram para os tokens novos onde já havia correspondência exata ou valor mágico identificado na auditoria POR-74/75: `fontWeight` hardcoded em `web/theme.ts` e nos componentes mobile `Alert`/`ErrorView`/`EmptyState`; `breakpoints`/`zIndex` do tema MUI passam a vir de `@ds/tokens` em vez de defaults implícitos; o `zIndex: 999`/`elevation: 999` arbitrário do `Snackbar` mobile vira `zIndices.toast`/`shadowStyle(3).elevation`. `EmptyState` também corrige a inconsistência de texto secundário (`neutral[500]` → `neutral[600]`) apontada no POR-75.

- Updated dependencies [09e45c9]
- Updated dependencies [c66e09a]
  - @ds/tokens@0.1.0

All notable changes to this package follow [Semantic Versioning](https://semver.org).

---

## [0.0.0] — inicial

- Configuração do **NativeWind v4** com tema completo derivado de `@ds/tokens` (cores, espaçamentos, tamanhos de fonte e raios de borda)
- **AppBar** — barra de navegação com título, subtítulo e ações configuráveis
- **Avatar** — exibição de imagem de perfil com fallback para iniciais ou ícone
- **Badge** — indicador numérico para ícones e botões
- **Button** — botão com variantes `contained`, `outlined`, `text` e ícone opcional
- **Card** — cartão com título, subtítulo, imagem de capa e área de ações
- **Checkbox** — controle de seleção com suporte a estado `indeterminate`
- **Dialog** — modal de confirmação com variante `destructive`
- **Divider** — separador horizontal configurável
- **FAB** — botão de ação flutuante com ícone e label opcionais
- **Icon** — wrapper para `MaterialCommunityIcons` com tamanho e cor configuráveis
- **Input** — campo de texto com variantes `outlined` e `flat`
- **Menu** — menu de contexto com ícones e divisores
- **Radio** — grupo de opções de seleção única
- **Select** — dropdown controlado com `label`, `options` e `helperText`
- **Snackbar** — notificação temporária com quatro severidades: `success`, `error`, `warning`, `info`
- **Switch** — alternador de estado booleano
- **Typography** — componente de texto com variantes semânticas do Material Design
- Tema base com suporte a dark/light mode via `useColorScheme`
- Exports de `styled`, `useColorScheme`, `vars` e `StyledProps` de `nativewind`
