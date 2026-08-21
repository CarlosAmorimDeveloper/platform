# @vuotto/tokens

Fonte única dos tokens de design da marca **Vuotto Tech**, compartilhada por [`@vuotto/web`](../vuotto-web/README.md) e [`@vuotto/mobile`](../vuotto-mobile/README.md). Portado de `~/Documents/rebranding/tokens/*.css` (protótipo web-only) — ver o `readme.md`/`SKILL.md` daquela pasta para o briefing completo de marca.

## Duas saídas, um valor de origem

- **Web** (`./styles.css`, `./tokens/*`): os arquivos CSS do protótipo, copiados sem alterar valores. Cores em `oklch()`, camadas de vidro em `color-mix()` — resolvidos pelo motor CSS do browser.
- **Mobile** (import default `.`): React Native não tem motor CSS — não resolve `oklch()`/`color-mix()` em tempo real. `scripts/build-native-tokens.mjs` resolve **os mesmos valores de `tokens/colors.css`** para hex/rgba concretos via [`culori`](https://culorijs.org), gerando `src/native/colors.generated.ts` (arquivo gerado, nunca editado à mão — refaça `yarn build` depois de mudar `colors.css`).

As duas saídas nascem do mesmo `tokens/colors.css` — mudar um valor lá e não regenerar o lado nativo é o único jeito de as duas plataformas divergirem, e o build já falha ruidosamente se isso acontecer (o script de geração roda toda vez).

## Instalação

```ts
// Web
import '@vuotto/tokens/styles.css';

// Mobile
import { semanticColors, space, radii, shadow } from '@vuotto/tokens';
const colors = semanticColors.dark; // ou .light — @vuotto/mobile's useTheme() já resolve isso
```

## Build

```sh
yarn workspace @vuotto/tokens build                    # gera tudo: tokens nativos, tsup, CSS
yarn workspace @vuotto/tokens generate:native-tokens    # só a etapa de geração (debug rápido)
```

## O que não traduz 1:1 pra mobile

- **Gradientes** (`--sheen-top`, `--glow-cool`/`violet`): CSS `linear-gradient()`/`radial-gradient()` não tem equivalente em `StyleSheet` do RN — precisa de um componente de gradiente (`expo-linear-gradient` ou similar) no lado mobile, não é algo que um token resolve sozinho. Não exportado daqui.
- **`--shadow-inset-top`**: sombra inset não existe no RN (`shadowOffset`/`elevation` são sempre externos) — o brilho de borda assinatura do sistema precisa de outra técnica no mobile (ex.: uma `View` de 1px no topo), documentado em `src/native/shadows.ts`.
- **`--shadow-focus`**: é um anel sólido de 3px sem blur — mais perto de borda que de sombra; exportado como `focusRingColor` pra usar com `borderWidth`/`borderColor`, não como `DropShadow`.
- **Cores no `elevation` do Android**: `elevation` não aceita cor customizada — `shadow.md`/`glow` etc. têm um `elevation` numérico aproximado (monocromático) ao lado dos campos `shadow*` de verdade (que só valem no iOS).

## Escopo (REB-12, REB-13, REB-14 / VT-1 a VT-3 — estendidos pra cobrir mobile)

Cores, tipografia, espaçamento, raio, sombra, movimento, z-index e fontes. Os 30 componentes e os 4 UI kits do backlog consomem isso, não o redefinem.
