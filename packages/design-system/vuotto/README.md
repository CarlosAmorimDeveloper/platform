# @vuotto/ds

Design system da marca **Vuotto Tech** — portado de `~/Documents/rebranding` (protótipo de referência: `.jsx` = visual, `.d.ts` = contrato de props, `.prompt.md` = regra de uso). Ver o `readme.md` e o `SKILL.md` daquela pasta para o briefing completo de marca.

Pacote independente de `@ds/tokens`/`@ds/web`/`@ds/mobile` — estética e propósito diferentes (Vuotto Tech vs. os produtos existentes no monorepo).

## Instalação

Workspace do monorepo — sem passo adicional:

```ts
import { Icon, useTheme } from '@vuotto/ds';
import '@vuotto/ds/styles.css';
```

## Build

```sh
yarn workspace @vuotto/ds build   # ESM + CJS + .d.ts (tsup) e CSS distribuído (scripts/build-css.mjs)
yarn workspace @vuotto/ds dev     # tsup --watch
```

`scripts/build-css.mjs` resolve a cadeia de `@import` de `src/styles.css` num único `dist/styles.css` e também copia cada `src/tokens/*.css` individualmente para `dist/tokens/` (export `./tokens/*`), reescrevendo as referências de fonte conforme a profundidade de cada arquivo final.

## Tokens

`src/tokens/{base,colors,typography,spacing,effects}.css` são cópias byte-a-byte do protótipo — nenhum valor foi alterado. `fonts.css` é a exceção: o `@import` do Google Fonts virou `@font-face` self-hosted (`src/assets/fonts/*.woff2`, subsets latin + latin-ext, Manrope 400/500/600/700, Instrument Serif 400, JetBrains Mono 400/500) — sem requisição a terceiros em runtime.

## Tema

`useTheme()` gerencia `data-theme` na raiz do documento (`dark` é o padrão implícito de `tokens/colors.css`; só `light` precisa do atributo), persiste a escolha em `localStorage` e usa `prefers-color-scheme` quando não há preferência salva. Aninhar `data-theme="light"` em qualquer subárvore funciona via CSS puro (seletor de atributo) — não precisa do hook para isso, só para a raiz do app.

## Ícones

`<Icon name="arrow-right" size="sm" />` — mesma API do protótipo, mas trocando o Lucide via CDN (script + mutação de DOM) por `lucide-react/dynamic`: cada glifo é um `import()` separado, carregado sob demanda. Nenhum script de terceiros, nenhum glifo não usado entra no bundle (validado via `esbuild --splitting`: o entry point fica pequeno e cada ícone vira um chunk próprio de menos de 1KB).

Por padrão o ícone é decorativo (`aria-hidden`); passe `aria-label` quando ele sozinho carregar significado (ex.: dentro de um botão só-ícone).

## Escopo desta primeira fase (POR REB-12 a REB-16 / VT-1 a VT-5)

Só a fundação: pacote + build, tokens, fontes, tema, ícone. Os 30 componentes do protótipo (Button, Card, Table, Dialog, etc.) e os 4 UI kits (portfolio, console, mobile, docs) são as próximas fases do backlog (REB-2 em diante).
