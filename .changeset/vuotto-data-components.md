---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de dados do Vuotto Tech: `Table`, `Stat`, `ProgressBar`, `EmptyState`, `Skeleton`, em `@vuotto/web` e `@vuotto/mobile`.

`Table` vai além do protótipo estático (REB-24): ordenação por coluna com indicador e `aria-sort` (web) / rótulo de acessibilidade (mobile) — o componente só rastreia qual coluna/direção está ativa e delega a ordenação real dos dados ao consumidor via `onSortChange`, já que na prática os dados costumam já vir ordenados do servidor; seleção múltipla com checkbox de cabeçalho indeterminado; `loading` renderiza `Skeleton` em vez de spinner; lista vazia renderiza `EmptyState` no lugar do corpo. Web usa `position: sticky` no `<thead>` dentro de containers com `maxHeight`; mobile não precisa de sticky explícito — o cabeçalho é uma `View` separada da `FlatList` de linhas, então já fica fixo por construção. RN não tem `<table>`, então colunas usam `flex`/`width` numérico em vez do layout automático do `<table>`.

`Stat` formata `value` numérico com `Intl.NumberFormat('pt-BR')` quando recebe um `number` (separador de milhar `.`, decimal `,`); `delta` continua `string` livre porque já inclui sinal e unidade (`+12,4%`) que `Intl.NumberFormat` sozinho não produz. `ProgressBar` expõe `role="progressbar"` com `aria-valuenow`/`aria-valuemin`/`aria-valuemax` no web e `accessibilityRole="progressbar"` com `accessibilityValue` no mobile, animando a largura com `Animated.timing`. `Skeleton` respeita `prefers-reduced-motion` no web (`@media` desliga a animação e trava no `background` sólido) e `AccessibilityInfo.isReduceMotionEnabled()`/`reduceMotionChanged` no mobile (não existe media query equivalente em RN).
