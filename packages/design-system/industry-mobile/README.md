# @industry/mobile

Componentes React Native do **Industry** — consumindo tokens de [`@industry/tokens`](../industry-tokens/README.md). Espelha a estrutura e o tooling de [`@vuotto/mobile`](../vuotto-mobile/README.md): export único `"."`, `dist/` construído com `tsup`, Storybook via `react-native-web`. Diferente de `@vuotto/mobile`, tem um setup de Jest (porta do que o extinto `@ds/mobile` usava), sem a entrada de `react-native-paper` — este pacote não depende dele).

## Instalação

```ts
import { Frame } from '@industry/mobile';
```

## Componentes

**`Frame`** — o objeto blueprint genérico: `View` com borda hairline reta (`color.divider`) mais quatro `View`s de canto posicionadas absolutamente, cada uma desenhando um `+` de 11px com duas barras finas (não há pseudo-elemento no RN). `props`: `marks` (padrão `true` — mesma regra do `@industry/web`, nunca remova as marcas), `children`, `style`. Sem prop `as` — RN não tem polimorfismo de tag como o DOM.

**`Icon`** — wrapper fino sobre `lucide-react-native` (`import * as icons from 'lucide-react-native/icons'`, indexado por nome). `props`: `name` (PascalCase, ex. `"ArrowRight"` — convenção do próprio `lucide-react-native`, diferente do kebab-case do web), `size` (`xs`|`sm`|`md`|`lg`|número, padrão `sm`), `color` (**obrigatório** — RN não tem `currentColor`), `strokeWidth` (padrão **1.5, sempre**), `style`, `accessibilityLabel`. Sem import dinâmico por nome — `lucide-react-native` não tem equivalente ao `lucide-react/dynamic` do web, então este wrapper importa todos os ícones (troca real de tamanho de bundle, documentada, não escondida — mesma decisão do `@vuotto/mobile`). `Icon` depende de `react-native-svg` como peer dependency (como o `@vuotto/mobile`) — apps que consumirem este pacote precisam declarar `react-native-svg` e, possivelmente, uma entrada em `nohoist` no `package.json` raiz.

**`Duotone`** — wrapper de imagem. **Aproximação documentada**, não um `mix-blend-mode` real: React Native não tem essa propriedade (não faz parte de `ViewStyle` no RN 0.81, e este monorepo não depende de `react-native-skia`, que teria blend modes de verdade). O que existe aqui é uma sobreposição plana com opacidade do acento (`alpha(color.accent, 55)`) — visualmente diferente de um blend real (tinge uniformemente em vez de preservar a luminância da foto por baixo), mas é o fallback que o REB-63 explicitamente permite. `props`: `children`, `style`.

**`Button`** — mesma API de props do `@industry/web` (`variant`, `size`, `block`, `framed`, `iconOnly`), sem `icon`/`iconAfter`. Diferença de plataforma: só tem estado padrão/pressionado (`Pressable` `onPressIn`/`onPressOut`) — sem `:hover`, que não existe em touch.

**`TextField`** — `label`, `hint`, `error`, mais os atributos de `TextInput` (inclui `multiline` nativamente).

**`SearchField`** — mesmos atributos de `TextInput`, com a lupa (`Icon` `Search`) e padding à esquerda.

**`Switch`** — `checked`/`defaultChecked`/`onCheckedChange` (não `value`/`onValueChange` do `Switch` nativo do RN — nome escolhido para não colidir com o `value` de string de `RadioGroup`/`SegmentedControl` abaixo), `label`, `disabled`. Sem componente nativo do RN por baixo (o `Switch` do RN não dá controle sobre as dimensões quadradas deste sistema) — é `Pressable` com o track e o thumb desenhados à mão, mesma abordagem do `Button`.

**`Checkbox`** — mesma lógica de estado controlado/não controlado de `Switch` (`checked`/`defaultChecked`/`onCheckedChange`), `label`, `disabled`. Sem tratamento visual de `disabled` — fiel à fonte web, que só define esse tratamento para `Switch`.

**`RadioGroup`** — `label`, `options` (strings ou `{value, label}`), `value`, `onValueChange`. Sem prop `name` — é uma amarração de formulário HTML sem equivalente em RN; o agrupamento aqui é implícito (uma instância do componente, um conjunto de opções). O anel "donut" do estado marcado (`box-shadow: inset` na web) não existe em RN — aproximado com um círculo sólido `color.bg` centralizado dentro do círculo de acento.

**`SegmentedControl`** — `options` (com `icon` opcional), `value`, `onValueChange`. Sem `name` (mesma razão do `RadioGroup`) nem `:hover` (não existe em toque).

## Documentação de fundação (Storybook)

Seis páginas em `Foundations/*` no Storybook, cada uma renderizando os tokens reais de `@industry/tokens` (nunca um valor fixo): `Foundations/Color`, `Foundations/Typography`, `Foundations/Semantics`, `Foundations/Spacing & Elevation`, `Foundations/Icons` (sujeita à mesma limitação de SVG invisível no preview documentada em "Limitação conhecida do Storybook"), `Foundations/Image` (o tratamento `Duotone`, aproximação documentada).

## Build e testes

```sh
yarn workspace @industry/mobile build                 # tsup: dist/index.{js,mjs,d.ts}
yarn workspace @industry/mobile test                   # Jest (node env)
yarn workspace @industry/mobile storybook               # dev, porta 6011
yarn workspace @industry/mobile build-storybook          # build estático (usado pelo Chromatic)
```

## Limitação conhecida do Storybook

Herdada de `@vuotto/mobile`: `react-native-web@0.19.x` ainda não suporta React 19 para SVG — `Icon`, que usa `react-native-svg` via `lucide-react-native`, vai montar sem erro mas renderizar invisível neste preview de navegador. Não afeta o app real (Metro/Fabric renderiza SVG normalmente) — só o preview do Storybook. `Frame` não usa `react-native-svg`, então não é afetado.

## O que não traduz 1:1 pra mobile

- **`mix-blend-mode: color`** (o efeito duotone de verdade) não existe no RN — `Duotone` usa uma sobreposição translúcida do acento como aproximação, não um blend real. Ver "Componentes" acima.
- **O anel "donut" do `RadioGroup` marcado** (`box-shadow: inset 0 0 0 4px` na web) não existe em RN — `View` não suporta sombra interna. Aproximado com um círculo sólido centralizado, ver "Componentes" acima.
- **`:hover` em `Checkbox`/`RadioGroup`/`SegmentedControl`** não existe — toque não tem estado de passar o mouse.

## Escopo

Este pacote tem dez componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField`, `SearchField`, `Switch`, `Checkbox`, `RadioGroup` e `SegmentedControl` (parte do REB-73). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. `Select` (o único controle restante do REB-73) chega em um PR próprio — precisa de bottom sheet/action sheet nativo, não um `<select>` HTML equivalente. Os componentes de layout/navegação/feedback/dados (REB-74 a REB-77) chegam em PRs seguintes.
