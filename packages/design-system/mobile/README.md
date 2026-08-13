# @ds/mobile

[![React Native][reactnative-shield]][reactnative-url]
[![React Native Paper][paper-shield]][paper-url]
[![TypeScript][typescript-shield]][typescript-url]

Pacote de design system para React Native. Parte do monorepo `platform`, em `packages/design-system/mobile`.

Baseado em [React Native Paper][paper-url] (Material Design 3), com um tema (`theme`) gerado a partir de `@ds/tokens` (cores, espaçamentos, raios de borda) e um catálogo de componentes prontos (`Button`, `Input`, `Textarea`, `Chip`, `Select`, `Radio`, `Checkbox`, `Alert`, `EmptyState`, `ErrorView`, `LoadingView`/`LoadingIndicator`, `Dialog`, `Snackbar`, `AppBar`, `FAB`, `Card`, `Menu`, `PieChart`) que encapsulam os componentes do Paper com a tipagem e as convenções do design system.

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
[![React Native Paper][paper-shield]][paper-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]
[![Storybook][storybook-shield]][storybook-url]

## Instalação

O pacote é consumido via Yarn Workspaces. No app React Native, adicione ao `package.json`:

```json
{
  "dependencies": {
    "@ds/mobile": "*"
  }
}
```

`react-native-paper`, `react-native-safe-area-context`, `react-native-svg`, `react-native-chart-kit` e `react-native` devem ser instalados pelo app consumidor (peer dependencies):

```sh
yarn add react-native-paper react-native-safe-area-context react-native-svg react-native-chart-kit react-native
```

## Uso

### 1. Envolver o app com o `PaperProvider` usando o `theme` do pacote

```tsx
// App.tsx
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '@ds/mobile/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>{/* ...telas do app */}</PaperProvider>
    </SafeAreaProvider>
  );
}
```

### 2. Usar os componentes do design system

```tsx
import { Button, Input, EmptyState } from '@ds/mobile';

export function TicketForm() {
  return (
    <>
      <Input value="" onChangeText={() => {}} label="Título" />
      <Button onPress={() => {}}>Salvar</Button>
      <EmptyState title="Nenhum ticket" description="Crie o primeiro ticket para começar." />
    </>
  );
}
```

Todos os componentes são wrappers tipados sobre o [React Native Paper][paper-url]. Alguns (`Alert`, `EmptyState`, `ErrorView`) não têm equivalente direto no Paper e são compostos hand-styled com `View`/`Text` estilizados diretamente com os tokens de `@ds/tokens` via `StyleSheet.create` — não há classes utilitárias/CSS envolvidas em nenhum dos dois casos.

## Tema

`theme` (exportado de `@ds/mobile` e de `@ds/mobile/theme`) estende o `MD3LightTheme` do React Native Paper com os tokens de `@ds/tokens`:

```ts
import { theme } from '@ds/mobile/theme';

theme.colors.primary; // colors.primary[600]
theme.colors.error; // colors.error[500]
theme.roundness; // radii.md
```

| Token do tema       | Origem em `@ds/tokens` |
| ------------------- | ---------------------- |
| `colors.primary`    | `colors.primary[600]`  |
| `colors.background` | `colors.neutral[50]`   |
| `colors.surface`    | `colors.neutral[0]`    |
| `colors.error`      | `colors.error[500]`    |
| `roundness`         | `radii.md`             |

Componentes hand-styled (não wrappers do Paper) usam `colors`, `spacing`, `fontSizes` e `radii` de `@ds/tokens` diretamente em `StyleSheet.create` (veja `Alert.tsx`, `EmptyState.tsx`, `ErrorView.tsx`).

## Exports

```ts
import { theme } from '@ds/mobile';
// ou, sem puxar o catálogo de componentes:
import { theme } from '@ds/mobile/theme';

import {
  Button,
  Input,
  Textarea,
  Chip,
  Select,
  Radio,
  Checkbox,
  Alert,
  EmptyState,
  ErrorView,
  LoadingView,
  LoadingIndicator,
  Dialog,
  Snackbar,
  AppBar,
  FAB,
  Card,
  Menu,
  PieChart,
} from '@ds/mobile';
import type { AppTheme, ButtonProps, InputProps /* ...Props por componente */ } from '@ds/mobile';
```

| Export      | Origem             | Descrição                                                                        |
| ----------- | ------------------ | -------------------------------------------------------------------------------- |
| `theme`     | `src/theme.ts`     | Tema do React Native Paper (MD3) com cores/roundness derivados de `@ds/tokens`   |
| `AppTheme`  | `src/theme.ts`     | Tipo do `theme`                                                                  |
| componentes | `src/components/*` | Um export nomeado + tipo de props por componente (ver `src/components/index.ts`) |

## Arquivos

| Arquivo              | Descrição                                                                                                |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/theme.ts`       | Tema do React Native Paper derivado de `@ds/tokens`                                                      |
| `src/test-utils.tsx` | `render` customizado com `PaperProvider`/`SafeAreaProvider` para testes                                  |
| `src/components/*`   | Um diretório por componente (`Component.tsx`, `index.ts`, `Component.test.tsx`, `Component.stories.tsx`) |
| `src/index.ts`       | Ponto de entrada do pacote (reexporta `theme` e todos os componentes)                                    |

## Testes

```sh
yarn test
```

Testados com Jest (`@react-native/jest-preset`, ambiente Node) e `@testing-library/react-native`. Cada componente tem seu próprio `Component.test.tsx`, cobrindo renderização, interação e estados (erro, desabilitado, seleção, visibilidade etc.).

## Scripts

| Comando                | Descrição                           |
| ---------------------- | ----------------------------------- |
| `yarn test`            | Executa os testes com Jest          |
| `yarn check-types`     | Verificação de tipos TypeScript     |
| `yarn lint`            | ESLint                              |
| `yarn storybook`       | Storybook em modo dev (porta 6007)  |
| `yarn build-storybook` | Build estático do Storybook         |
| `yarn chromatic`       | Publica testes visuais no Chromatic |

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
[paper-shield]: https://img.shields.io/badge/React_Native_Paper-6200EE?style=for-the-badge&logo=materialdesign&logoColor=white
[paper-url]: https://callstack.github.io/react-native-paper/
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[jest-shield]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io
[storybook-shield]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[storybook-url]: https://storybook.js.org
