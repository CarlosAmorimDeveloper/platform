# @industry/web

Componentes React do **Industry** — o design system de blueprint sobre fundo escuro — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/web`](../vuotto-web/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook em `@storybook/react-vite`.

## Instalação

```ts
import { Frame } from '@industry/web';
import '@industry/tokens/styles.css'; // tokens são globais, via CSS custom properties
```

## Componentes

**`Frame`** — o objeto blueprint genérico: borda hairline reta (`--color-divider`) mais quatro marcas de registro `+` de 11px nos cantos, deslocadas 6px para fora. `props`: `as` (tag, padrão `div`), `marks` (padrão `true` — nunca remova as marcas de um elemento emoldurado, é regra do sistema), `children`, `style`, `className`, mais os demais atributos do elemento. Estilizado inteiramente via `style` inline + variáveis CSS de `@industry/tokens` (`--color-divider`, `--color-text`), sem folha de estilo própria — as marcas de canto são elementos filhos reais, não pseudo-elementos.

## Build

```sh
yarn workspace @industry/web build                 # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/web storybook              # dev, porta 6010
yarn workspace @industry/web build-storybook        # build estático (usado pelo Chromatic)
```

## Escopo

Este pacote nasce com um único componente, `Frame` (REB-62). `Icon` (REB-64), o wrapper `.duotone` (REB-63) e os controles/layout/navegação/feedback/dados (REB-67 a REB-71) chegam em PRs seguintes — a taxonomia de pastas (`src/components/{core,data,feedback,forms,navigation}`) vai espelhar `@vuotto/web` para receber esses componentes sem reestruturação.
