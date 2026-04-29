# @ds/tokens

Tokens de design do monorepo `platform`. Exporta constantes TypeScript tipadas e variáveis CSS para cores, espaçamentos, tamanhos de fonte e raios de borda.

## Instalação

O pacote é consumido via Yarn Workspaces — nenhuma instalação adicional é necessária dentro do monorepo:

```ts
import { colors, spacing, fontSizes, radii } from "@ds/tokens";
```

Para usar as variáveis CSS globais:

```ts
import "@ds/tokens/global.css";
```

## Tokens disponíveis

### `colors`

Paleta de cores semântica com escalas numéricas (50–950).

| Grupo | Uso |
|---|---|
| `primary` | Cor de marca (índigo) |
| `neutral` | Cinzas e pretos/brancos |
| `success` | Feedbacks positivos |
| `warning` | Alertas e avisos |
| `error` | Erros e estados destrutivos |
| `info` | Informações e destaques neutros |

```ts
import { colors } from "@ds/tokens";

colors.primary[500]   // "#6366F1"
colors.neutral[0]     // "#FFFFFF"
colors.error[500]     // "#F43F5E"
```

### `spacing`

Escala de espaçamento em pixels (unitless — o consumidor aplica a unidade).

| Chave | px |
|---|---|
| `0` | 0 |
| `1` | 4 |
| `2` | 8 |
| `4` | 16 |
| `8` | 32 |
| `16` | 64 |
| ... | ... |

```ts
import { spacing } from "@ds/tokens";

spacing[4]   // 16
spacing[8]   // 32
```

### `fontSizes`

Escala tipográfica em pixels (unitless).

| Chave | px |
|---|---|
| `xs` | 12 |
| `sm` | 14 |
| `base` | 16 |
| `lg` | 18 |
| `xl` | 20 |
| `2xl` | 24 |
| `3xl` | 30 |
| `4xl` | 36 |
| `5xl` | 48 |
| `6xl` | 60 |
| `7xl` | 72 |

```ts
import { fontSizes } from "@ds/tokens";

fontSizes.base   // 16
fontSizes["2xl"] // 24
```

### `radii`

Escala de border-radius em pixels (unitless).

| Chave | px |
|---|---|
| `none` | 0 |
| `sm` | 2 |
| `base` | 4 |
| `md` | 6 |
| `lg` | 8 |
| `xl` | 12 |
| `2xl` | 16 |
| `3xl` | 24 |
| `full` | 9999 |

```ts
import { radii } from "@ds/tokens";

radii.md    // 6
radii.full  // 9999
```

## Scripts

| Comando | Descrição |
|---|---|
| `yarn check-types` | Verificação de tipos TypeScript |
