---
'@vuotto/tokens': major
'@vuotto/web': major
'@vuotto/mobile': minor
---

`@vuotto/ds` foi dividido em três pacotes, espelhando o padrão de `@ds/tokens`+`@ds/web`+`@ds/mobile`: `@vuotto/tokens` (novo — fonte única dos valores, CSS pro web e valores resolvidos hex/rgba via `culori` pro React Native, que não interpreta `oklch()`/`color-mix()` em runtime), `@vuotto/web` (renomeado de `@vuotto/ds`, mesmos `Icon`/`useTheme`, agora consumindo `@vuotto/tokens` em vez de ter cópia própria) e `@vuotto/mobile` (novo — `Icon`/`useTheme` em React Native puro, sem React Native Paper).
