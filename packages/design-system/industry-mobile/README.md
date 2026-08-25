# @industry/mobile

Componentes React Native do **Industry** — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/mobile`](../vuotto-mobile/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook via `react-native-web`. Diferente de `@vuotto/mobile`, tem um setup de Jest (porta do de [`@ds/mobile`](../mobile/README.md), sem a entrada de `react-native-paper` — este pacote não depende dele).

## Instalação

```ts
import { Frame } from '@industry/mobile';
```

## Componentes

**`Frame`** — o objeto blueprint genérico: `View` com borda hairline reta (`color.divider`) mais quatro `View`s de canto posicionadas absolutamente, cada uma desenhando um `+` de 11px com duas barras finas (não há pseudo-elemento no RN). `props`: `marks` (padrão `true` — mesma regra do `@industry/web`, nunca remova as marcas), `children`, `style`. Sem prop `as` — RN não tem polimorfismo de tag como o DOM.

## Build e testes

```sh
yarn workspace @industry/mobile build                 # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/mobile test                   # Jest (node env)
yarn workspace @industry/mobile storybook               # dev, porta 6011
yarn workspace @industry/mobile build-storybook          # build estático (usado pelo Chromatic)
```

## Limitação conhecida do Storybook

Herdada de `@vuotto/mobile`: `react-native-web@0.19.x` ainda não suporta React 19 para SVG — qualquer componente futuro baseado em `react-native-svg` (ex.: `Icon`) vai montar sem erro mas renderizar invisível neste preview de navegador. Não afeta o app real (Metro/Fabric renderiza SVG normalmente) — só o preview do Storybook. `Frame` não usa `react-native-svg`, então não é afetado.

## Escopo

Este pacote nasce com um único componente, `Frame` (REB-62). `Icon` (REB-64, que introduz a dependência `lucide-react-native` e vai exigir estender a config do Storybook com os plugins de stub de Fabric/SVG documentados em `@vuotto/mobile`), o wrapper `.duotone` (REB-63) e os controles/layout/navegação/feedback/dados (REB-73 a REB-77) chegam em PRs seguintes.
