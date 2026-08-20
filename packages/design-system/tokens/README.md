# @ds/tokens

[![TypeScript][typescript-shield]][typescript-url]

Tokens de design do monorepo `platform`. Exporta constantes TypeScript tipadas e variáveis CSS para cores, espaçamentos, tamanhos de fonte e raios de borda.

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
3. **Adaptadores de plataforma** (`src/platform/`) — resolvem a unidade por ambiente. Web usa `px()`/`rem()` (`@ds/tokens/platform/web`); mobile consome os números crus do React Native diretamente, sem adaptador.

Hoje a camada semântica cobre só os papéis já confirmados iguais (ou deliberadamente unificados) entre web e mobile — ver POR-74/POR-75/POR-76 no Jira. Papéis ainda não decididos (`surfaceRaised`, `borderFocus`, `accentPressed`, tipografia, espaçamento, breakpoint, z-index) seguem resolvidos via primitivo direto até suas tarefas (POR-78 a POR-81) os promoverem.

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

### Tokens semânticos

`semanticColors` e `semanticRadii` resolvem primitivos para papéis nomeados por função. Use-os em vez do primitivo sempre que o papel já existir aqui.

| Token                          | Papel                                    | Primitivo             |
| ------------------------------ | ---------------------------------------- | --------------------- |
| `semanticColors.surface`       | fundo de superfície elevada (card/paper) | `colors.neutral[0]`   |
| `semanticColors.background`    | fundo de página                          | `colors.neutral[50]`  |
| `semanticColors.textPrimary`   | texto principal                          | `colors.neutral[900]` |
| `semanticColors.textSecondary` | texto secundário                         | `colors.neutral[600]` |
| `semanticColors.textOnAccent`  | texto sobre cor de marca                 | `colors.neutral[0]`   |
| `semanticColors.border`        | borda/divisor padrão                     | `colors.neutral[200]` |
| `semanticColors.accent`        | cor de marca principal                   | `colors.primary[600]` |
| `semanticColors.error`         | erro                                     | `colors.error[500]`   |
| `semanticRadii.radiusBase`     | raio padrão de componente                | `radii.md`            |

```ts
import { semanticColors, semanticRadii } from '@ds/tokens';

semanticColors.textSecondary; // '#4B5563'
semanticRadii.radiusBase; // 6
```

### Adaptador de plataforma (web)

```ts
import { px, rem } from '@ds/tokens/platform/web';

px(semanticRadii.radiusBase); // '6px'
rem(fontSizes.base); // '1rem'
```

No mobile não há adaptador — React Native já consome números crus diretamente.

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
