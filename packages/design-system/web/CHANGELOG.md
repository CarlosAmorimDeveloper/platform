# Changelog — @ds/web

## 0.1.1

### Patch Changes

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

## [0.1.0] — 2026-05-19

### Added

- **Select** — dropdown controlado com suporte a `label`, `options`, `error`, `helperText`, `fullWidth` e `disabled`
- **Checkbox** — controle de seleção com suporte a estado `indeterminate`
- **Radio** — grupo de opções com layout `row` opcional e ID acessível via `useId()`
- **Dialog** — modal de confirmação com variante `destructive` (botão de confirmação em vermelho)
- **Snackbar** — notificação temporária com quatro severidades: `success`, `error`, `warning`, `info`
- **Card** — cartão de conteúdo com suporte a `title`, `subtitle`, `media` (imagem) e `actions`
- **AppBar** — barra de navegação com botão de menu opcional e área de `actions`
- **Menu** — menu de contexto com ícones, itens desabilitados e divisores via `dividerAfter`

### Changed

- **theme.ts** — paleta e forma agora derivadas de `@ds/tokens` em vez de valores hardcoded
- **Storybook** — todas as stories envolvidas com `ThemeProvider` via decorator global, garantindo que as cores do design system sejam aplicadas corretamente

### Fixed

- **Select** — `labelId` substituído por `useId()` para evitar colisão de IDs quando múltiplos `Select` aparecem na mesma página
- **Select** — tipo da função helper em stories alterado de `any` para `Partial<React.ComponentProps<typeof Select>>`

---

## [0.0.0] — inicial

- **Button** — botão com variantes `primary`, `secondary`, `ghost`, `danger` e tamanhos `md`, `sm`
- **Input** — campo de texto com variantes `default` e `inline`; suporte a `type="checkbox"` embutido
