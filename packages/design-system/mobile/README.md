# @ds/mobile

[![React Native][reactnative-shield]][reactnative-url]
[![NativeWind][nativewind-shield]][nativewind-url]
[![TypeScript][typescript-shield]][typescript-url]

Pacote de design system para React Native. Parte do monorepo `platform`, em `packages/design-system/mobile`.

Configura o [NativeWind v4](https://www.nativewind.dev) com o tema completo de `@ds/tokens` (cores, espaçamentos, tamanhos de fonte e raios de borda), gerando classes Tailwind CSS compatíveis com React Native StyleSheet.

## Índice

- [Construído com](#construído-com)
- [Instalação](#instalação)
- [Uso](#uso)
- [Tema](#tema)
- [Exports](#exports)
- [Arquivos](#arquivos)
- [Testes](#testes)
- [Scripts](#scripts)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Construído com

[![React Native][reactnative-shield]][reactnative-url]
[![NativeWind][nativewind-shield]][nativewind-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

## Instalação

O pacote é consumido via Yarn Workspaces. No app React Native, adicione ao `package.json`:

```json
{
  "dependencies": {
    "@ds/mobile": "*"
  }
}
```

O NativeWind e o React Native devem ser instalados pelo app consumidor (peer dependencies):

```sh
yarn add nativewind react-native
```

## Uso

### 1. Copiar as configurações de build

Referencie (ou copie) os arquivos de configuração do pacote no seu app:

**`babel.config.js`**

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: ['nativewind/babel'],
  };
};
```

**`metro.config.js`**

```js
const { getDefaultConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, {
  input: './global.css',
});
```

**`tailwind.config.js`** — importe a config base e estenda com os paths do seu app:

```js
const baseConfig = require('@ds/mobile/tailwind.config');

module.exports = {
  ...baseConfig,
  content: [...baseConfig.content, './app/**/*.{ts,tsx}', './screens/**/*.{ts,tsx}'],
};
```

**`global.css`** — importe no entry point do app:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Importar o CSS global no entry point

```ts
// index.ts ou App.tsx
import './global.css';
```

### 3. Usar as utilities do NativeWind

```ts
import { styled } from '@ds/mobile';
import { View, Text } from 'react-native';

const StyledView = styled(View);
const StyledText = styled(Text);

export function Card() {
  return (
    <StyledView className="bg-primary-50 p-4 rounded-lg">
      <StyledText className="text-primary-900 text-base font-semibold">
        Olá, NativeWind!
      </StyledText>
    </StyledView>
  );
}
```

## Tema

O `tailwind.config.js` estende o tema padrão do Tailwind com os tokens de `@ds/tokens`:

### Cores (`colors`)

Mapeadas diretamente como valores hex — sem conversão.

```js
className = 'bg-primary-500'; // #6366F1
className = 'text-neutral-900'; // #111827
className = 'border-error-300'; // #FDA4AF
```

Grupos disponíveis: `primary`, `neutral`, `success`, `warning`, `error`, `info`.

### Espaçamento (`spacing`)

Valores convertidos de números unitless para strings `px`.

```js
className = 'p-4'; // padding: 16px
className = 'm-8'; // margin: 32px
className = 'gap-2'; // gap: 8px
```

### Tamanho de fonte (`fontSize`)

```js
className = 'text-xs'; // 12px
className = 'text-base'; // 16px
className = 'text-2xl'; // 24px
```

### Border radius (`borderRadius`)

```js
className = 'rounded-sm'; // 2px
className = 'rounded-lg'; // 8px
className = 'rounded-full'; // 9999px
```

## Exports

```ts
import { styled, useColorScheme, vars } from '@ds/mobile';
import type { StyledProps } from '@ds/mobile';
```

| Export           | Origem       | Descrição                                          |
| ---------------- | ------------ | -------------------------------------------------- |
| `styled`         | `nativewind` | Cria componentes RN com suporte a classes Tailwind |
| `useColorScheme` | `nativewind` | Hook para detectar dark/light mode                 |
| `vars`           | `nativewind` | Define CSS custom properties em componentes RN     |
| `StyledProps`    | `nativewind` | Tipo para props de componentes estilizados         |

## Arquivos

| Arquivo              | Descrição                                               |
| -------------------- | ------------------------------------------------------- |
| `tailwind.config.js` | Config Tailwind com tema de `@ds/tokens` via `jiti`     |
| `tailwind-utils.js`  | Utilitários `toPx` e `mapToPx` para conversão de tokens |
| `babel.config.js`    | Plugin `nativewind/babel` para transformação de classes |
| `metro.config.js`    | Wrapper `withNativeWind` para o bundler Metro           |
| `global.css`         | Diretivas `@tailwind` requeridas pelo NativeWind v4     |
| `src/index.ts`       | Ponto de entrada do pacote                              |

## Testes

```sh
yarn test
```

Cobertura atual: **20 testes** — utilidades `toPx`/`mapToPx` e integração do `tailwind.config.js`.

## Scripts

| Comando            | Descrição                       |
| ------------------ | ------------------------------- |
| `yarn test`        | Executa os testes com Jest      |
| `yarn check-types` | Verificação de tipos TypeScript |

## Contribuindo

Consulte o [README raiz do monorepo](../../README.md) para instruções de configuração e fluxo de contribuição. Ao alterar o pacote, lembre-se de criar um changeset:

```sh
yarn changeset
```

## Licença

Uso interno — repositório privado.

---

[reactnative-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[reactnative-url]: https://reactnative.dev
[nativewind-shield]: https://img.shields.io/badge/NativeWind-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[nativewind-url]: https://www.nativewind.dev
[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[jest-shield]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io
