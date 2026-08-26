# @industry/web

Componentes React do **Industry** — o design system de blueprint sobre fundo escuro — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/web`](../vuotto-web/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook em `@storybook/react-vite`.

## Instalação

```ts
import { Frame } from '@industry/web';
import '@industry/tokens/styles.css'; // tokens são globais, via CSS custom properties
```

## Componentes

**`Frame`** — o objeto blueprint genérico: borda hairline reta (`--color-divider`) mais quatro marcas de registro `+` de 11px nos cantos, deslocadas 6px para fora. `props`: `as` (tag, padrão `div`), `marks` (padrão `true` — nunca remova as marcas de um elemento emoldurado, é regra do sistema), `children`, `style`, `className`, mais os demais atributos do elemento. Estilizado inteiramente via `style` inline + variáveis CSS de `@industry/tokens` (`--color-divider`, `--color-text`), sem folha de estilo própria — as marcas de canto são elementos filhos reais, não pseudo-elementos.

**`Icon`** — wrapper fino sobre `lucide-react/dynamic` (`DynamicIcon`): um `import()` por glifo, cada ícone vira seu próprio chunk (sem bundle único de todos os ícones). `props`: `name` (kebab-case, ex. `"arrow-right"`), `size` (`xs`|`sm`|`md`|`lg`|número — 14/16/20/24px, padrão `sm`), `color` (padrão `currentColor`), `strokeWidth` (padrão **1.5, sempre** — o sistema não tem variação por tamanho como no `@vuotto/web`), `className`, `style`, `aria-label` (decorativo por padrão, `aria-hidden` a menos que um label seja passado).

**`Duotone`** — wrapper de imagem: aplica o acento via `mix-blend-mode: color` (efeito de serigrafia), a mesma leitura que `~/Documents/ds/foundations/image.html` documenta. `props`: `children`, `style`, `className`. Compõe com `Frame` por aninhamento (`<Frame><Duotone><img /></Duotone></Frame>`), não é uma variante fundida.

**`Button`** — `variant` (`primary`|`secondary`|`ghost`|`danger`, padrão `secondary` — o primário é o único preenchimento sólido, use um por tela), `size` (`md`|`sm`), `block`, `framed` (usa `BlueprintMarks`, o mesmo módulo interno do `Frame`), `iconOnly`, mais os atributos de `<button>`. Sem prop `icon`/`iconAfter` — para um botão com ícone, componha `<Icon />` diretamente como `children`. Hover/pressed são estado React (`useState`), não uma folha de estilo — o mesmo padrão já usado no `@vuotto/web`.

**`TextField`** — `label`, `hint`, `error` (substitui a dica e marca `aria-invalid`), `multiline`, `rows`, mais os atributos de `<input>`.

**`SearchField`** — mesmos atributos de `<input>`, já traz a lupa (`Icon` `search`) e o padding à esquerda.

## Documentação de fundação (Storybook)

Seis páginas em `Foundations/*` no Storybook, cada uma renderizando os tokens reais de `@industry/tokens` (nunca um valor de token fixo): `Foundations/Color` (papéis de cor + rampas tonais), `Foundations/Typography` (escala h1-h6 e corpo), `Foundations/Semantics` (rampas semânticas + data-viz), `Foundations/Spacing & Elevation` (escala de 4px, alvos de toque, raio, sombras), `Foundations/Icons` (o conjunto Lucide via `Icon`), `Foundations/Image` (o tratamento `Duotone`).

## Build

```sh
yarn workspace @industry/web build                 # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/web storybook              # dev, porta 6010
yarn workspace @industry/web build-storybook        # build estático (usado pelo Chromatic)
```

## Escopo

Este pacote tem seis componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField` e `SearchField` (parte do REB-67). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. A taxonomia de pastas (`src/components/{core,data,feedback,forms,navigation}`) já espelha `@vuotto/web` para receber esses componentes sem reestruturação. Os outros 5 controles (`Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`) e os componentes de layout/navegação/feedback/dados (REB-68 a REB-71) chegam em PRs seguintes.
