# @ds/tokens

[![TypeScript][typescript-shield]][typescript-url]

Tokens de design do monorepo `platform`. Exporta constantes TypeScript tipadas e variáveis CSS para cor, tipografia, espaçamento, raio, borda, sombra, breakpoint e z-index.

## Índice

- [Construído com](#construído-com)
- [Instalação](#instalação)
- [Arquitetura em camadas](#arquitetura-em-camadas)
- [Tokens disponíveis](#tokens-disponíveis)
- [Uso no React Native](#uso-no-react-native)
- [Scripts](#scripts)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Arquitetura em camadas

`@ds/tokens` é a fonte única da verdade consumida por `@ds/web` e `@ds/mobile` — nenhum dos dois define paleta, escala ou raio próprios. A partir de três camadas:

1. **Primitivos** (`src/primitives/`) — valores brutos, sem unidade, nomeados por aparência (`colors.primary[600]`, `radii.md`). Continuam exportados no nível raiz do pacote por compatibilidade.
2. **Semânticos** (`src/semantic.ts`, exportado como `semanticColors`/`semanticRadii`) — nomeados por função (`textSecondary`, `border`, `accent`), nunca por aparência. Cada valor referencia um primitivo; um componente nunca deveria precisar saber que `textSecondary` "é" `neutral[600]`.
3. **Adaptadores de plataforma** (`src/platform/`) — resolvem a unidade por ambiente. A maioria dos tokens é um número cru que o React Native já consome diretamente sem adaptador; web usa `@ds/tokens/platform/web` (`px()`, `rem()`, `em()`, `fluidFontSize()`, `boxShadow()`) quando precisa de unidade CSS. Duas exceções pedem adaptador dos dois lados: `lineHeight`/`letterSpacing` são proporções que o CSS aceita direto mas o RN exige em px absolutos (`@ds/tokens/platform/native#resolveLineHeight`/`resolveLetterSpacing`), e `elevation` é um nível abstrato que cada plataforma resolve para sua própria API de sombra (`boxShadow()` no web, `shadowStyle()` no native).

A camada semântica cobre os papéis já confirmados iguais (ou deliberadamente unificados) entre web e mobile — ver POR-74 a POR-81 no Jira. Papéis ainda não decididos (variantes de alerta por cor, `surfaceSunken` como nome à parte, etc.) seguem resolvidos via primitivo direto até alguma tarefa futura os promover.

## Construído com

[![TypeScript][typescript-shield]][typescript-url]

## Instalação

O pacote é consumido via Yarn Workspaces — nenhuma instalação adicional é necessária dentro do monorepo:

```ts
import { colors, spacing, fontSizes, radii } from '@ds/tokens';
```

Para usar as variáveis CSS globais:

```ts
import '@ds/tokens/global.css';
```

## Tokens disponíveis

### `colors`

Paleta de cores semântica com escalas numéricas (50–950).

| Grupo     | Uso                             |
| --------- | ------------------------------- |
| `primary` | Cor de marca (índigo)           |
| `neutral` | Cinzas e pretos/brancos         |
| `success` | Feedbacks positivos             |
| `warning` | Alertas e avisos                |
| `error`   | Erros e estados destrutivos     |
| `info`    | Informações e destaques neutros |

```ts
import { colors } from '@ds/tokens';

colors.primary[500]; // "#6366F1"
colors.neutral[0]; // "#FFFFFF"
colors.error[500]; // "#F43F5E"
```

### `spacing`

Escala de espaçamento em pixels (unitless — o consumidor aplica a unidade).

| Chave | px  |
| ----- | --- |
| `0`   | 0   |
| `1`   | 4   |
| `2`   | 8   |
| `4`   | 16  |
| `8`   | 32  |
| `16`  | 64  |
| ...   | ... |

```ts
import { spacing } from '@ds/tokens';

spacing[4]; // 16
spacing[8]; // 32
spacing[128]; // 512
```

### `fontSizes`

Escala tipográfica em pixels (unitless).

| Chave  | px  |
| ------ | --- |
| `xs`   | 12  |
| `sm`   | 14  |
| `base` | 16  |
| `lg`   | 18  |
| `xl`   | 20  |
| `2xl`  | 24  |
| `3xl`  | 30  |
| `4xl`  | 36  |
| `5xl`  | 48  |
| `6xl`  | 60  |
| `7xl`  | 72  |

```ts
import { fontSizes } from '@ds/tokens';

fontSizes.base; // 16
fontSizes['2xl']; // 24
```

### `radii`

Escala de border-radius em pixels (unitless).

| Chave  | px   |
| ------ | ---- |
| `none` | 0    |
| `sm`   | 2    |
| `base` | 4    |
| `md`   | 6    |
| `lg`   | 8    |
| `xl`   | 12   |
| `2xl`  | 16   |
| `3xl`  | 24   |
| `full` | 9999 |

```ts
import { radii } from '@ds/tokens';

radii.md; // 6
radii.full; // 9999
```

### `fontWeights`, `lineHeights`, `letterSpacings`

Escalas tipográficas complementares ao `fontSizes`.

| Grupo            | Chaves                               | Valores                                                                 |
| ---------------- | ------------------------------------ | ----------------------------------------------------------------------- |
| `fontWeights`    | `regular`/`medium`/`semibold`/`bold` | `'400'`/`'500'`/`'600'`/`'700'` (string — direto no `fontWeight` do RN) |
| `lineHeights`    | `tight`/`snug`/`normal`/`relaxed`    | `1.25`/`1.375`/`1.5`/`1.625` (proporção sem unidade)                    |
| `letterSpacings` | `tight`/`normal`/`wide`/`wider`      | `-0.02`/`0`/`0.02`/`0.04` (proporção em-equivalente)                    |

`lineHeights` e `letterSpacings` são proporções, não valores absolutos — CSS aceita `line-height` sem unidade direto, mas `letter-spacing` exige `em`/`px` (use `em()` do adaptador web). Nenhuma das duas unidades existe no RN: lá sempre se resolve a proporção contra um `fontSizes` específico via `resolveLineHeight`/`resolveLetterSpacing` do adaptador native.

```ts
import { fontWeights, lineHeights, letterSpacings } from '@ds/tokens';

fontWeights.medium; // '500'
lineHeights.normal; // 1.5
letterSpacings.wide; // 0.02
```

### `borderWidths`

| Chave      | px  |
| ---------- | --- |
| `hairline` | 1   |
| `thick`    | 2   |

### `breakpoints`

Único grupo que não precisa existir no mobile (POR-81).

| Chave | px   |
| ----- | ---- |
| `sm`  | 640  |
| `md`  | 768  |
| `lg`  | 1024 |
| `xl`  | 1280 |

### `zIndices`

| Chave      | Valor |
| ---------- | ----- |
| `base`     | 0     |
| `dropdown` | 1000  |
| `header`   | 1100  |
| `overlay`  | 1200  |
| `modal`    | 1300  |
| `toast`    | 1400  |

### Tokens semânticos

`semanticColors` e `semanticRadii` resolvem primitivos para papéis nomeados por função. Use-os em vez do primitivo sempre que o papel já existir aqui.

| Token                          | Papel                                                    | Primitivo               |
| ------------------------------ | -------------------------------------------------------- | ----------------------- |
| `semanticColors.surface`       | fundo de superfície elevada (card/paper)                 | `colors.neutral[0]`     |
| `semanticColors.surfaceRaised` | superfície acima de `surface` (via `elevation`, não cor) | `colors.neutral[0]`     |
| `semanticColors.background`    | fundo de página                                          | `colors.neutral[50]`    |
| `semanticColors.textPrimary`   | texto principal                                          | `colors.neutral[900]`   |
| `semanticColors.textSecondary` | texto secundário                                         | `colors.neutral[600]`   |
| `semanticColors.textDisabled`  | texto/ícone desabilitado                                 | `colors.neutral[400]`   |
| `semanticColors.textOnAccent`  | texto sobre cor de marca                                 | `colors.neutral[0]`     |
| `semanticColors.border`        | borda/divisor padrão                                     | `colors.neutral[200]`   |
| `semanticColors.borderStrong`  | borda com mais contraste                                 | `colors.neutral[300]`   |
| `semanticColors.borderFocus`   | anel de foco                                             | `colors.primary[600]`   |
| `semanticColors.accent`        | cor de marca principal                                   | `colors.primary[600]`   |
| `semanticColors.accentHover`   | marca — estado hover (web)                               | `colors.primary[700]`   |
| `semanticColors.accentPressed` | marca — estado pressed/touch (mobile)                    | `colors.primary[800]`   |
| `semanticColors.success`       | sucesso                                                  | `colors.success[500]`   |
| `semanticColors.warning`       | alerta                                                   | `colors.warning[500]`   |
| `semanticColors.error`         | erro                                                     | `colors.error[500]`     |
| `semanticRadii.radiusBase`     | raio padrão de componente                                | `radii.md`              |
| `elevationLevels`              | níveis abstratos de elevação (`0\|1\|2\|3`)              | resolvido por adaptador |

```ts
import { semanticColors, semanticRadii, elevationLevels } from '@ds/tokens';

semanticColors.textSecondary; // '#4B5563'
semanticRadii.radiusBase; // 6
elevationLevels; // [0, 1, 2, 3]
```

### Adaptadores de plataforma

```ts
// Web — @ds/tokens/platform/web
import { px, rem, em, fluidFontSize, boxShadow } from '@ds/tokens/platform/web';

px(semanticRadii.radiusBase); // '6px'
rem(fontSizes.base); // '1rem'
em(letterSpacings.wide); // '0.02em'
fluidFontSize(fontSizes.base, fontSizes['2xl']); // clamp(...) entre 320px e 1280px de viewport
boxShadow(2); // '0 2px 6px rgba(0, 0, 0, 0.12)'
```

```ts
// Native — @ds/tokens/platform/native
import { resolveLineHeight, resolveLetterSpacing, shadowStyle } from '@ds/tokens/platform/native';

resolveLineHeight(fontSizes.base, lineHeights.normal); // 24
resolveLetterSpacing(fontSizes.base, letterSpacings.wide); // 0.32
shadowStyle(2); // { shadowColor, shadowOffset, shadowRadius, shadowOpacity, elevation }
```

Os demais tokens (`spacing`, `radii`, `borderWidths`, `zIndices`, cores) já são números/strings unitless prontos para uso direto no RN — não precisam de adaptador.

## Uso no React Native

Para React Native, os tokens são consumidos diretamente pelo pacote `@ds/mobile` — importados como constantes TypeScript comuns e usados para montar o `theme` do React Native Paper (`src/theme.ts`) e em `StyleSheet.create` dos componentes. Não há NativeWind/Tailwind no caminho — os valores em px continuam unitless, como em qualquer `StyleSheet` do React Native.

```ts
// Exemplo interno do @ds/mobile/src/theme.ts
import { MD3LightTheme } from 'react-native-paper';
import { colors, semanticColors, semanticRadii } from '@ds/tokens';

export const theme = {
  ...MD3LightTheme,
  roundness: semanticRadii.radiusBase, // 6, unitless — RN usa números puros, não "6px"
  colors: {
    ...MD3LightTheme.colors,
    primary: semanticColors.accent,
    // ...
  },
};
```

Consulte [`packages/design-system/mobile`](../mobile/README.md) para mais detalhes.

## Scripts

| Comando            | Descrição                       |
| ------------------ | ------------------------------- |
| `yarn check-types` | Verificação de tipos TypeScript |

## Contribuindo

Consulte o [README raiz do monorepo](../../README.md) para instruções de configuração e fluxo de contribuição. Ao alterar tokens, lembre-se de criar um changeset:

```sh
yarn changeset
```

## Licença

Uso interno — repositório privado.

---

[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
