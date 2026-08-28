# @industry/tokens

Fonte única dos tokens de design do **Industry** — o design system de blueprint sobre fundo escuro — compartilhada por `@industry/web` e `@industry/mobile`. Portado de `~/Documents/ds/theme.json` e `styles.css`; ver `~/Documents/ds/readme.md` e `~/Documents/ds/DESIGN-SYSTEM.md` para o briefing completo do sistema.

Ao contrário do `@vuotto/tokens` (removido do monorepo, REB-100), o Industry **não tem tema claro** — `color-scheme: dark` é fixo no `:root` (`~/Documents/ds/DESIGN-SYSTEM.md`, §13).

## Duas saídas, um valor de origem

- **Web** (`./styles.css`, `./tokens/*`): os arquivos CSS deste pacote, com as mesmas rampas OKLCH do protótipo. Cores em `oklch()`, transparências em `color-mix(in srgb, ...)` — resolvidas pelo motor CSS do browser.
- **Mobile** (import default `.`): React Native não resolve `oklch()`/`color-mix()` em tempo real. `scripts/build-native-tokens.mjs` resolve os mesmos valores de `tokens/colors.css` para hex/rgba concretos via [`culori`](https://culorijs.org), gerando `src/native/colors.generated.ts` (arquivo gerado, nunca editado à mão — refaça `yarn build` depois de mudar `colors.css`).

## Instalação

```ts
// Web
import '@industry/tokens/styles.css';

// Mobile
import { color, neutral, accentRamp, success, space, control, fontSize } from '@industry/tokens';
```

## Build

```sh
yarn workspace @industry/tokens build                    # gera tudo: tokens nativos, tsup, CSS
yarn workspace @industry/tokens generate:native-tokens    # só a etapa de geração (debug rápido)
```

## A regra da tinta invertida

Nesta base não existe papel para inverter — **não** troque tinta para `--color-bg`/`color.bg` como se fosse um "branco" de tema claro:

- Um campo cheio é o passo erguido do acento: `--color-accent-800` / `accentRamp['800']`.
- A tinta sobre esse campo é `--color-text` / `color.text`.
- Hairlines e marcas de registro sobre um campo ou uma fotografia são mesclas alfa de `--color-text` — nunca de `--color-bg`.
- `--color-bg` / `color.bg` como primeiro plano só é correto em um lugar: tipo escuro sobre um preenchimento accent-400 (botão primário, segmento marcado, badge sólido).

## Como ler as rampas

A leitura inverte em relação a um tema claro. As rampas `neutral`, `accentRamp`, `accent2Ramp` (nove passos cada uma) e as semânticas `success`, `warning`, `danger` (cinco passos cada uma) compartilham a mesma estrutura conceitual:

- **300 é o passo legível** — tipo e ícones coloridos sobre o grafite.
- **400 é o preenchimento** — botões, barras de progresso, pontos, trilhos ativos. É o valor por trás dos aliases `color.accent` / `semanticColor.success` / etc.
- **900 é a superfície tingida** — fundo de tag, campo tênue.

Nas três rampas completas (`neutral`, `accentRamp`, `accent2Ramp`):

- **100–200 é tinta sobre esses preenchimentos tingidos.**

As rampas semânticas (`success`, `warning`, `danger`) são um subconjunto de cinco passos (`200`, `300`, `400`, `700`, `900`) — falta só o `100` (além dos passos intermediários `500` e `600`). O `200` existe e cumpre o mesmo papel do `100` nas rampas completas: tinta sobre esses preenchimentos tingidos. Use os passos disponíveis com a mesma lógica (300 legível, 400 preenchimento, 900 superfície tingida).

Prefira um passo da rampa a montar uma cor translúcida ad-hoc; `alpha(hex, percent)` existe só para os casos que a rampa não cobre.

Seis séries de dado-viz vivem em `viz['1']`…`viz['6']`, em uma luminosidade e croma fixos, matiz espalhada — atribua em ordem para manter gráficos comparáveis entre telas. Eixos e gridlines usam `viz.grid`.

## O que não traduz 1:1 pra mobile

- **`--font-mono`** é uma pilha de sistema (`ui-monospace, 'SF Mono', Menlo, monospace`), não uma fonte para linkar — exportado como `fontFamilyMono.ios`/`fontFamilyMono.android` em vez de um único `fontFamily.mono`.
- **`--safe-b` / `--safe-t`** (`env(safe-area-inset-*)`) são um conceito de CSS — no mobile, use `useSafeAreaInsets()` de `react-native-safe-area-context` (já é o padrão nos apps deste monorepo), não um token estático.
- **O anel hairline dos shadows** (`0 0 0 1px color-mix(...)` que acompanha cada `--shadow-*`) não existe nas props `shadow*` legadas do RN — aproxime com `borderWidth: 1` e `borderColor: color.divider`/`dividerStrong` no mesmo elemento.
- **Cor do `elevation` no Android**: `elevation` não aceita cor customizada — `shadow.md`/`.lg` etc. têm um `elevation` numérico aproximado (monocromático) ao lado dos campos `shadow*` de verdade (que só valem no iOS).
- **`--radius-sm/md/lg`** existem no token sheet (`radii.sm/md/lg`) mas a camada de componentes do Industry usa cantos retos (`radius: 0`) — só recorra a eles se estiver deliberadamente saindo do vocabulário blueprint (ver `~/Documents/ds/readme.md`).

## Escopo (REB-56 a REB-61)

Cores (rampas OKLCH + data-viz), tipografia (Barlow Condensed/Barlow/mono + escala h1-h6), espaçamento/raio/densidade/touch e elevação. Os componentes de `@industry/web` e `@industry/mobile` (REB-50/51) consomem isso, não o redefinem. O objeto blueprint (`.blueprint`, `.duotone`) é REB-49, não este pacote.
