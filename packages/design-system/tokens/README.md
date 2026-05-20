# @ds/tokens

[![TypeScript][typescript-shield]][typescript-url]

Tokens de design do monorepo `platform`. Exporta constantes TypeScript tipadas e variáveis CSS para cores, espaçamentos, tamanhos de fonte e raios de borda.

## Índice

- [Construído com](#construído-com)
- [Instalação](#instalação)
- [Tokens disponíveis](#tokens-disponíveis)
- [Uso no React Native](#uso-no-react-native)
- [Scripts](#scripts)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

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

## Uso no React Native

Para React Native, os tokens são consumidos pelo pacote `@ds/mobile`, que os importa via `jiti` em tempo de configuração e os mapeia para o tema do Tailwind CSS / NativeWind v4. Os valores unitless (números) são convertidos automaticamente para strings `px` pelo utilitário `mapToPx`.

```js
// Exemplo interno do @ds/mobile/tailwind.config.js
const { colors, spacing, fontSizes, radii } = require('@ds/tokens');

// spacing[4] === 16  →  "16px" no tema Tailwind
// radii.lg === 8     →  "8px" no tema Tailwind
// colors.primary[500] === "#6366F1"  →  usado diretamente
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
