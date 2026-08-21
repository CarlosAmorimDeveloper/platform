---
'@vuotto/tokens': minor
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes core do Vuotto Tech: `Button`, `IconButton`, `Card`, `Badge`, `Tag` e `Lockup`, em `@vuotto/web` (DOM/CSS) e `@vuotto/mobile` (React Native puro, sem Paper).

`@vuotto/tokens` ganha `alpha(hex, percent)`, um helper de runtime pra tons translúcidos (`color-mix(in oklab, COLOR X%, transparent)`) que os componentes precisam calcular em percentuais que não fazem parte do conjunto pré-computado em `semanticColors`.

`@vuotto/web` ganha um `styles.css` próprio (`./styles.css`) com as regras que `style` inline não expressa: `@keyframes` do spinner de loading do `Button`, e `@supports` de fallback sólido do `backdrop-filter` do `Card` em browsers sem suporte.

`@vuotto/mobile`'s `Card` não tem prop `glow` — gradientes não têm equivalente em `StyleSheet`, e uma prop que não faz nada seria pior que não ter a prop.
