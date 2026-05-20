# @ds/mobile — React Native Paper Components + Storybook Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar React Native Paper v5 como fundação de componentes, criar 9 componentes mobile com paridade a `@ds/web`, refatorar o Button existente e configurar Storybook com react-native-web.

**Architecture:** React Native Paper v5 (MD3) serve como fundação, paralelo ao MUI no `@ds/web`. Um `theme.ts` central mapeia `@ds/tokens` para o Paper MD3Theme. Storybook usa `@storybook/react-vite` + alias `react-native → react-native-web` no Vite para renderizar componentes RN no browser. Testes usam `@testing-library/react-native` com providers centralizados em `test-utils.tsx`.

**Tech Stack:** React Native Paper v5, react-native-web 0.19, @storybook/react-vite 8, @testing-library/react-native 12, Vite 6, TypeScript 5.9

---

## Mapa de arquivos

| Ação      | Arquivo                                                                      |
| --------- | ---------------------------------------------------------------------------- |
| Modificar | `packages/design-system/mobile/package.json`                                 |
| Modificar | `packages/design-system/mobile/jest.config.js`                               |
| Criar     | `packages/design-system/mobile/jest.setup.js`                                |
| Modificar | `packages/design-system/mobile/tsconfig.json`                                |
| Modificar | `packages/design-system/mobile/__mocks__/react-native.js`                    |
| Criar     | `packages/design-system/mobile/__mocks__/react-native-safe-area-context.js`  |
| Criar     | `packages/design-system/mobile/__tests__/test-utils.tsx`                     |
| Criar     | `packages/design-system/mobile/src/theme.ts`                                 |
| Criar     | `packages/design-system/mobile/.storybook/main.ts`                           |
| Criar     | `packages/design-system/mobile/.storybook/preview.tsx`                       |
| Modificar | `packages/design-system/mobile/src/components/Button/Button.tsx`             |
| Modificar | `packages/design-system/mobile/src/components/Button/index.ts`               |
| Criar     | `packages/design-system/mobile/src/components/Button/Button.stories.tsx`     |
| Deletar   | `packages/design-system/mobile/src/components/Button/button-classes.ts`      |
| Modificar | `packages/design-system/mobile/__tests__/Button.test.tsx`                    |
| Deletar   | `packages/design-system/mobile/__tests__/button-classes.test.ts`             |
| Criar     | `packages/design-system/mobile/src/components/AppBar/AppBar.tsx`             |
| Criar     | `packages/design-system/mobile/src/components/AppBar/AppBar.stories.tsx`     |
| Criar     | `packages/design-system/mobile/src/components/AppBar/index.ts`               |
| Criar     | `packages/design-system/mobile/__tests__/AppBar.test.tsx`                    |
| Criar     | `packages/design-system/mobile/src/components/Card/Card.tsx`                 |
| Criar     | `packages/design-system/mobile/src/components/Card/Card.stories.tsx`         |
| Criar     | `packages/design-system/mobile/src/components/Card/index.ts`                 |
| Criar     | `packages/design-system/mobile/__tests__/Card.test.tsx`                      |
| Criar     | `packages/design-system/mobile/src/components/Checkbox/Checkbox.tsx`         |
| Criar     | `packages/design-system/mobile/src/components/Checkbox/Checkbox.stories.tsx` |
| Criar     | `packages/design-system/mobile/src/components/Checkbox/index.ts`             |
| Criar     | `packages/design-system/mobile/__tests__/Checkbox.test.tsx`                  |
| Criar     | `packages/design-system/mobile/src/components/Dialog/Dialog.tsx`             |
| Criar     | `packages/design-system/mobile/src/components/Dialog/Dialog.stories.tsx`     |
| Criar     | `packages/design-system/mobile/src/components/Dialog/index.ts`               |
| Criar     | `packages/design-system/mobile/__tests__/Dialog.test.tsx`                    |
| Criar     | `packages/design-system/mobile/src/components/Input/Input.tsx`               |
| Criar     | `packages/design-system/mobile/src/components/Input/Input.stories.tsx`       |
| Criar     | `packages/design-system/mobile/src/components/Input/index.ts`                |
| Criar     | `packages/design-system/mobile/__tests__/Input.test.tsx`                     |
| Criar     | `packages/design-system/mobile/src/components/Menu/Menu.tsx`                 |
| Criar     | `packages/design-system/mobile/src/components/Menu/Menu.stories.tsx`         |
| Criar     | `packages/design-system/mobile/src/components/Menu/index.ts`                 |
| Criar     | `packages/design-system/mobile/__tests__/Menu.test.tsx`                      |
| Criar     | `packages/design-system/mobile/src/components/Radio/Radio.tsx`               |
| Criar     | `packages/design-system/mobile/src/components/Radio/Radio.stories.tsx`       |
| Criar     | `packages/design-system/mobile/src/components/Radio/index.ts`                |
| Criar     | `packages/design-system/mobile/__tests__/Radio.test.tsx`                     |
| Criar     | `packages/design-system/mobile/src/components/Select/Select.tsx`             |
| Criar     | `packages/design-system/mobile/src/components/Select/Select.stories.tsx`     |
| Criar     | `packages/design-system/mobile/src/components/Select/index.ts`               |
| Criar     | `packages/design-system/mobile/__tests__/Select.test.tsx`                    |
| Criar     | `packages/design-system/mobile/src/components/Snackbar/Snackbar.tsx`         |
| Criar     | `packages/design-system/mobile/src/components/Snackbar/Snackbar.stories.tsx` |
| Criar     | `packages/design-system/mobile/src/components/Snackbar/index.ts`             |
| Criar     | `packages/design-system/mobile/__tests__/Snackbar.test.tsx`                  |
| Criar     | `packages/design-system/mobile/src/components/index.ts`                      |
| Modificar | `packages/design-system/mobile/src/index.ts`                                 |

---

## Task 1: Dependências e scripts

**Files:**

- Modify: `packages/design-system/mobile/package.json`

- [ ] **Step 1: Substituir o package.json completo**

```json
{
  "name": "@ds/mobile",
  "version": "0.0.0",
  "private": true,
  "main": "src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./theme": "./src/theme.ts"
  },
  "scripts": {
    "test": "jest",
    "check-types": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "storybook": "storybook dev -p 6007",
    "build-storybook": "storybook build"
  },
  "dependencies": {
    "@ds/tokens": "*",
    "react-native-paper": "^5"
  },
  "devDependencies": {
    "@repo/eslint-config": "*",
    "@repo/typescript-config": "*",
    "@storybook/addon-essentials": "^8",
    "@storybook/react": "^8",
    "@storybook/react-vite": "^8",
    "@testing-library/react-native": "^12",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/react-native": "*",
    "@types/react-test-renderer": "^19",
    "eslint": "^9",
    "globals": "*",
    "jiti": "^1.21.0",
    "nativewind": "^4.0.36",
    "react": "^19",
    "react-dom": "^19",
    "react-native": ">=0.72",
    "react-native-safe-area-context": "^4",
    "react-native-web": "^0.19",
    "react-test-renderer": "^19",
    "storybook": "^8",
    "tailwindcss": "^3.4.17",
    "typescript": "5.9.2",
    "vite": "^6"
  },
  "peerDependencies": {
    "nativewind": "^4.0.36",
    "react": ">=18",
    "react-native": ">=0.72",
    "react-native-paper": "^5",
    "react-native-safe-area-context": "^4"
  }
}
```

- [ ] **Step 2: Instalar dependências**

```bash
cd /path/to/repo && yarn install
```

Esperado: sem erros. `node_modules/react-native-paper`, `node_modules/react-native-web` e `node_modules/storybook` devem existir.

- [ ] **Step 3: Commit**

```bash
git add packages/design-system/mobile/package.json yarn.lock
git commit -m "chore(ds-mobile): add react-native-paper, storybook, and testing deps"
```

---

## Task 2: Infraestrutura de testes

**Files:**

- Modify: `packages/design-system/mobile/jest.config.js`
- Create: `packages/design-system/mobile/jest.setup.js`
- Modify: `packages/design-system/mobile/__mocks__/react-native.js`
- Create: `packages/design-system/mobile/__mocks__/react-native-safe-area-context.js`
- Create: `packages/design-system/mobile/__tests__/test-utils.tsx`

- [ ] **Step 1: Atualizar jest.config.js**

```js
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.{js,ts,tsx}'],
  transform: {
    '^.+\\.(js|ts|tsx)$': [
      'babel-jest',
      {
        configFile: false,
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-typescript',
          ['@babel/preset-react', { runtime: 'automatic' }],
        ],
      },
    ],
  },
  // Transform react-native and Paper source (they ship as JSX/TS)
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|react-native-paper|react-native-safe-area-context)/)',
  ],
  moduleNameMapper: {
    '^react-native-safe-area-context$': '<rootDir>/__mocks__/react-native-safe-area-context.js',
  },
  setupFiles: ['<rootDir>/jest.setup.js'],
};
```

- [ ] **Step 2: Criar jest.setup.js**

```js
// Suppress RN internal warnings in test output
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
```

- [ ] **Step 3: Simplificar **mocks**/react-native.js**

O mock anterior apenas emulava Pressable e Text como HTML para testes baseados em jsdom. Agora usamos o react-native real via transformIgnorePatterns. O arquivo de mock não é mais necessário, mas é mantido vazio para não quebrar o jest.config.js caso algum teste antigo o referencie diretamente.

```js
'use strict';
// Arquivo mantido como stub. O react-native real é transformado via
// transformIgnorePatterns em jest.config.js.
module.exports = require('react-native');
```

- [ ] **Step 4: Criar **mocks**/react-native-safe-area-context.js**

`react-native-safe-area-context` usa bindings nativos que não existem em Node. Este mock provê implementações JS puras.

```js
'use strict';

const React = require('react');

const SafeAreaProvider = ({ children }) => children;
SafeAreaProvider.displayName = 'SafeAreaProvider';

const SafeAreaView = ({ children }) => children;
SafeAreaView.displayName = 'SafeAreaView';

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaInsetsContext: React.createContext({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
};
```

- [ ] **Step 5: Criar **tests**/test-utils.tsx**

Helper centralizado que envolve componentes nos providers necessários para render em testes.

```tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';

function AllProviders({ children }: { children: ReactElement }) {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </SafeAreaProvider>
  );
}

function customRender(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { wrapper: AllProviders as React.ComponentType, ...options });
}

export { customRender as render };
export * from '@testing-library/react-native';
```

- [ ] **Step 6: Verificar que os testes de utilitários existentes ainda passam**

```bash
yarn workspace @ds/mobile test --testPathPattern="tailwind"
```

Esperado: `tailwind-config.test.js` e `tailwind-utils.test.js` PASS. Os testes do Button vão falhar (serão reescritos na Task 5).

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/jest.config.js \
        packages/design-system/mobile/jest.setup.js \
        packages/design-system/mobile/__mocks__/react-native.js \
        packages/design-system/mobile/__mocks__/react-native-safe-area-context.js \
        packages/design-system/mobile/__tests__/test-utils.tsx
git commit -m "chore(ds-mobile): update test infrastructure for React Native Paper"
```

---

## Task 3: Theme

**Files:**

- Create: `packages/design-system/mobile/src/theme.ts`

- [ ] **Step 1: Criar src/theme.ts**

Paralelo exato a `packages/design-system/web/theme.ts`, mas usando Paper MD3Theme em vez de MUI.

```ts
import { MD3LightTheme } from 'react-native-paper';
import { colors, radii } from '@ds/tokens';

export const theme = {
  ...MD3LightTheme,
  roundness: radii.md,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary[600],
    onPrimary: colors.neutral[0],
    primaryContainer: colors.primary[100],
    onPrimaryContainer: colors.primary[900],
    secondary: colors.primary[400],
    onSecondary: colors.neutral[0],
    error: colors.error[500],
    onError: colors.neutral[0],
    background: colors.neutral[50],
    onBackground: colors.neutral[900],
    surface: colors.neutral[0],
    onSurface: colors.neutral[900],
    surfaceVariant: colors.neutral[100],
    onSurfaceVariant: colors.neutral[600],
    outline: colors.neutral[300],
    outlineVariant: colors.neutral[200],
  },
};

export type AppTheme = typeof theme;
```

- [ ] **Step 2: Verificar que o TypeScript aceita**

```bash
yarn workspace @ds/mobile check-types
```

Esperado: sem erros.

- [ ] **Step 3: Commit**

```bash
git add packages/design-system/mobile/src/theme.ts
git commit -m "feat(ds-mobile): add Paper MD3 theme mapped from @ds/tokens"
```

---

## Task 4: Storybook

**Files:**

- Create: `packages/design-system/mobile/.storybook/main.ts`
- Create: `packages/design-system/mobile/.storybook/preview.tsx`
- Modify: `packages/design-system/mobile/tsconfig.json`

- [ ] **Step 1: Criar .storybook/main.ts**

```ts
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  async viteFinal(config) {
    const { mergeConfig } = await import('vite');
    return mergeConfig(config, {
      resolve: {
        alias: {
          // Renderiza componentes RN no browser via react-native-web
          'react-native': 'react-native-web',
        },
      },
    });
  },
};

export default config;
```

- [ ] **Step 2: Criar .storybook/preview.tsx**

```tsx
import type { Preview, Decorator } from '@storybook/react';
import React from 'react';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { theme } from '../src/theme';

const withProviders: Decorator = (Story) => (
  <SafeAreaProvider>
    <PaperProvider theme={theme}>
      <Story />
    </PaperProvider>
  </SafeAreaProvider>
);

const preview: Preview = {
  decorators: [withProviders],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Step 3: Atualizar tsconfig.json**

Adicionar `DOM` e `DOM.Iterable` ao `lib` — Storybook/Vite rodam no browser e precisam dos globals do DOM. Não alterar `include` nem `rootDir` (`.storybook` é compilado pelo Vite, não pelo `tsc --noEmit`).

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "types": ["react-native", "nativewind/types"]
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

- [ ] **Step 4: Commit**

```bash
git add packages/design-system/mobile/.storybook/ \
        packages/design-system/mobile/tsconfig.json
git commit -m "feat(ds-mobile): configure Storybook with react-native-web"
```

---

## Task 5: Refatorar Button para React Native Paper

**Files:**

- Modify: `packages/design-system/mobile/src/components/Button/Button.tsx`
- Modify: `packages/design-system/mobile/src/components/Button/index.ts`
- Create: `packages/design-system/mobile/src/components/Button/Button.stories.tsx`
- Delete: `packages/design-system/mobile/src/components/Button/button-classes.ts`
- Modify: `packages/design-system/mobile/__tests__/Button.test.tsx`
- Delete: `packages/design-system/mobile/__tests__/button-classes.test.ts`

- [ ] **Step 1: Reescrever **tests**/Button.test.tsx (test-first)**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renderiza o texto do children', () => {
    render(<Button>Adicionar</Button>);
    expect(screen.getByText('Adicionar')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Pressionar</Button>);
    fireEvent.press(screen.getByText('Pressionar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled=true', () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} disabled testID="btn">
        Desabilitado
      </Button>,
    );
    fireEvent.press(screen.getByTestId('btn'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('renderiza com testID', () => {
    render(<Button testID="meu-botao">OK</Button>);
    expect(screen.getByTestId('meu-botao')).toBeTruthy();
  });

  it('aceita todas as variantes sem erros', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger'] as const;
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar que falha**

```bash
yarn workspace @ds/mobile test --testPathPattern="Button.test"
```

Esperado: FAIL — os testes antigos usam `data-classname` e `@testing-library/react`, que não existem mais.

- [ ] **Step 3: Reescrever src/components/Button/Button.tsx**

```tsx
import React from 'react';
import { Button as PaperButton } from 'react-native-paper';
import { colors } from '@ds/tokens';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

export interface ButtonProps {
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  children: string;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
}

const modeMap: Record<Variant, 'contained' | 'outlined' | 'text'> = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  danger: 'contained',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  children,
  onPress,
  testID,
  accessibilityLabel,
}: ButtonProps) {
  return (
    <PaperButton
      mode={modeMap[variant]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      compact={size === 'sm'}
      buttonColor={variant === 'danger' ? colors.error[500] : undefined}
      textColor={variant === 'danger' ? colors.neutral[0] : undefined}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </PaperButton>
  );
}
```

- [ ] **Step 4: Atualizar src/components/Button/index.ts**

```ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```

- [ ] **Step 5: Rodar os testes e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Button.test"
```

Esperado: todos os 5 testes PASS.

- [ ] **Step 6: Criar src/components/Button/Button.stories.tsx**

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Estilo visual do botão',
      table: { defaultValue: { summary: 'primary' } },
    },
    size: {
      control: 'radio',
      options: ['md', 'sm'],
      description: 'Tamanho do botão',
      table: { defaultValue: { summary: 'md' } },
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: 'primary', children: 'Adicionar' },
};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Cancelar' },
};

export const Ghost: Story = {
  args: { variant: 'ghost', size: 'sm', children: 'Editar' },
};

export const Danger: Story = {
  args: { variant: 'danger', size: 'sm', children: 'Remover' },
};

export const Disabled: Story = {
  args: { variant: 'primary', children: 'Adicionar', disabled: true },
};
```

- [ ] **Step 7: Deletar arquivos obsoletos**

```bash
rm packages/design-system/mobile/src/components/Button/button-classes.ts
rm packages/design-system/mobile/__tests__/button-classes.test.ts
```

- [ ] **Step 8: Rodar todos os testes do pacote**

```bash
yarn workspace @ds/mobile test
```

Esperado: PASS em `Button.test.tsx`, `tailwind-config.test.js`, `tailwind-utils.test.js`. O `tailwind-utils.test.js` e `tailwind-config.test.js` não devem ser afetados.

- [ ] **Step 9: Commit**

```bash
git add packages/design-system/mobile/src/components/Button/ \
        packages/design-system/mobile/__tests__/Button.test.tsx
git commit -m "refactor(ds-mobile): migrate Button to React Native Paper"
```

---

## Task 6: Componente AppBar

**Files:**

- Create: `packages/design-system/mobile/src/components/AppBar/AppBar.tsx`
- Create: `packages/design-system/mobile/src/components/AppBar/AppBar.stories.tsx`
- Create: `packages/design-system/mobile/src/components/AppBar/index.ts`
- Create: `packages/design-system/mobile/__tests__/AppBar.test.tsx`

- [ ] **Step 1: Escrever o teste (test-first)**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { AppBar } from '../src/components/AppBar';

describe('AppBar', () => {
  it('renderiza o título', () => {
    render(<AppBar title="Meu App" />);
    expect(screen.getByText('Meu App')).toBeTruthy();
  });

  it('não renderiza botão de voltar quando onBackPress não é fornecido', () => {
    render(<AppBar title="Título" testID="appbar" />);
    expect(screen.queryByTestId('appbar-back')).toBeNull();
  });

  it('renderiza botão de voltar quando onBackPress é fornecido', () => {
    render(<AppBar title="Título" onBackPress={() => {}} testID="appbar" />);
    expect(screen.getByTestId('appbar-back')).toBeTruthy();
  });

  it('chama onBackPress ao pressionar botão de voltar', () => {
    const onBackPress = jest.fn();
    render(<AppBar title="Título" onBackPress={onBackPress} testID="appbar" />);
    fireEvent.press(screen.getByTestId('appbar-back'));
    expect(onBackPress).toHaveBeenCalledTimes(1);
  });

  it('renderiza botões de ação', () => {
    const onPress = jest.fn();
    render(
      <AppBar
        title="Título"
        actions={[{ icon: 'magnify', onPress, accessibilityLabel: 'Buscar' }]}
      />,
    );
    fireEvent.press(screen.getByLabelText('Buscar'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="AppBar.test"
```

Esperado: FAIL — `Cannot find module '../src/components/AppBar'`.

- [ ] **Step 3: Criar src/components/AppBar/AppBar.tsx**

```tsx
import React from 'react';
import { Appbar } from 'react-native-paper';

interface AppBarAction {
  icon: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

export interface AppBarProps {
  title: string;
  onBackPress?: () => void;
  actions?: AppBarAction[];
  testID?: string;
}

export function AppBar({ title, onBackPress, actions, testID }: AppBarProps) {
  return (
    <Appbar.Header testID={testID}>
      {onBackPress && (
        <Appbar.BackAction onPress={onBackPress} testID={testID ? `${testID}-back` : undefined} />
      )}
      <Appbar.Content title={title} />
      {actions?.map((action, index) => (
        <Appbar.Action
          key={index}
          icon={action.icon}
          onPress={action.onPress}
          accessibilityLabel={action.accessibilityLabel}
        />
      ))}
    </Appbar.Header>
  );
}
```

- [ ] **Step 4: Criar src/components/AppBar/index.ts**

```ts
export { AppBar } from './AppBar';
export type { AppBarProps } from './AppBar';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="AppBar.test"
```

Esperado: todos os 5 testes PASS.

- [ ] **Step 6: Criar src/components/AppBar/AppBar.stories.tsx**

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AppBar } from './AppBar';

const meta: Meta<typeof AppBar> = {
  title: 'Components/AppBar',
  component: AppBar,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    onBackPress: { action: 'onBackPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: 'Título da Página' },
};

export const ComBotaoVoltar: Story = {
  args: { title: 'Detalhes', onBackPress: () => {} },
};

export const ComAcoes: Story = {
  args: {
    title: 'Lista',
    actions: [
      { icon: 'magnify', onPress: () => {}, accessibilityLabel: 'Buscar' },
      { icon: 'dots-vertical', onPress: () => {}, accessibilityLabel: 'Mais opções' },
    ],
  },
};

export const Completo: Story = {
  args: {
    title: 'Meu App',
    onBackPress: () => {},
    actions: [{ icon: 'magnify', onPress: () => {}, accessibilityLabel: 'Buscar' }],
  },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/AppBar/ \
        packages/design-system/mobile/__tests__/AppBar.test.tsx
git commit -m "feat(ds-mobile): add AppBar component"
```

---

## Task 7: Componente Card

**Files:**

- Create: `packages/design-system/mobile/src/components/Card/Card.tsx`
- Create: `packages/design-system/mobile/src/components/Card/Card.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Card/index.ts`
- Create: `packages/design-system/mobile/__tests__/Card.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Card } from '../src/components/Card';

describe('Card', () => {
  it('renderiza sem erros com testID', () => {
    render(
      <Card testID="card">
        <></>
      </Card>,
    );
    expect(screen.getByTestId('card')).toBeTruthy();
  });

  it('renderiza título e subtítulo', () => {
    render(<Card testID="card" title="Título" subtitle="Subtítulo" />);
    expect(screen.getByText('Título')).toBeTruthy();
    expect(screen.getByText('Subtítulo')).toBeTruthy();
  });

  it('chama onPress ao pressionar', () => {
    const onPress = jest.fn();
    render(<Card testID="card" onPress={onPress} title="Pressionar" />);
    fireEvent.press(screen.getByTestId('card'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não é pressionável quando onPress não é fornecido', () => {
    render(<Card testID="card" title="Sem press" />);
    const card = screen.getByTestId('card');
    // sem onPress, o card não tem handler de press
    expect(card.props.onPress).toBeUndefined();
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Card.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Card'`.

- [ ] **Step 3: Criar src/components/Card/Card.tsx**

```tsx
import React, { ReactNode } from 'react';
import { Card as PaperCard } from 'react-native-paper';

export interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  onPress?: () => void;
  coverUri?: string;
  testID?: string;
}

export function Card({ title, subtitle, children, onPress, coverUri, testID }: CardProps) {
  return (
    <PaperCard onPress={onPress} testID={testID}>
      {coverUri && <PaperCard.Cover source={{ uri: coverUri }} />}
      {(title || subtitle) && <PaperCard.Title title={title ?? ''} subtitle={subtitle} />}
      {children && <PaperCard.Content>{children}</PaperCard.Content>}
    </PaperCard>
  );
}
```

- [ ] **Step 4: Criar src/components/Card/index.ts**

```ts
export { Card } from './Card';
export type { CardProps } from './Card';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Card.test"
```

Esperado: todos os 4 testes PASS.

- [ ] **Step 6: Criar src/components/Card/Card.stories.tsx**

```tsx
import React from 'react';
import { Text } from 'react-native';
import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    subtitle: { control: 'text' },
    coverUri: { control: 'text' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Título do Card',
    subtitle: 'Subtítulo opcional',
    children: <Text>Conteúdo do card aqui.</Text>,
  },
};

export const Pressionavel: Story = {
  args: {
    title: 'Card Pressionável',
    subtitle: 'Toque para interagir',
    onPress: () => {},
  },
};

export const ComCover: Story = {
  args: {
    title: 'Com Imagem',
    coverUri: 'https://picsum.photos/400/200',
    children: <Text>Descrição abaixo da imagem.</Text>,
  },
};

export const SomenteTitulo: Story = {
  args: { title: 'Apenas Título' },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Card/ \
        packages/design-system/mobile/__tests__/Card.test.tsx
git commit -m "feat(ds-mobile): add Card component"
```

---

## Task 8: Componente Checkbox

**Files:**

- Create: `packages/design-system/mobile/src/components/Checkbox/Checkbox.tsx`
- Create: `packages/design-system/mobile/src/components/Checkbox/Checkbox.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Checkbox/index.ts`
- Create: `packages/design-system/mobile/__tests__/Checkbox.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Checkbox } from '../src/components/Checkbox';

describe('Checkbox', () => {
  it('renderiza o label', () => {
    render(<Checkbox checked={false} onValueChange={() => {}} label="Aceito os termos" />);
    expect(screen.getByText('Aceito os termos')).toBeTruthy();
  });

  it('chama onValueChange com true quando desmarcado e pressionado', () => {
    const onValueChange = jest.fn();
    render(<Checkbox checked={false} onValueChange={onValueChange} label="Item" testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).toHaveBeenCalledWith(true);
  });

  it('chama onValueChange com false quando marcado e pressionado', () => {
    const onValueChange = jest.fn();
    render(<Checkbox checked={true} onValueChange={onValueChange} label="Item" testID="cb" />);
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).toHaveBeenCalledWith(false);
  });

  it('não chama onValueChange quando disabled', () => {
    const onValueChange = jest.fn();
    render(
      <Checkbox checked={false} onValueChange={onValueChange} disabled label="Item" testID="cb" />,
    );
    fireEvent.press(screen.getByTestId('cb'));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Checkbox.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Checkbox'`.

- [ ] **Step 3: Criar src/components/Checkbox/Checkbox.tsx**

```tsx
import React from 'react';
import { Checkbox as PaperCheckbox } from 'react-native-paper';

export interface CheckboxProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export function Checkbox({
  checked,
  onValueChange,
  label = '',
  disabled = false,
  testID,
  accessibilityLabel,
}: CheckboxProps) {
  return (
    <PaperCheckbox.Item
      status={checked ? 'checked' : 'unchecked'}
      onPress={disabled ? undefined : () => onValueChange(!checked)}
      label={label}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
```

- [ ] **Step 4: Criar src/components/Checkbox/index.ts**

```ts
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Checkbox.test"
```

Esperado: todos os 4 testes PASS.

- [ ] **Step 6: Criar src/components/Checkbox/Checkbox.stories.tsx**

```tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onValueChange: { action: 'onValueChange' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Desmarcado: Story = {
  args: { checked: false, label: 'Aceito os termos de uso' },
};

export const Marcado: Story = {
  args: { checked: true, label: 'Aceito os termos de uso' },
};

export const Desabilitado: Story = {
  args: { checked: false, label: 'Opção indisponível', disabled: true },
};

export const MarcadoDesabilitado: Story = {
  args: { checked: true, label: 'Opção bloqueada', disabled: true },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Checkbox/ \
        packages/design-system/mobile/__tests__/Checkbox.test.tsx
git commit -m "feat(ds-mobile): add Checkbox component"
```

---

## Task 9: Componente Dialog

**Files:**

- Create: `packages/design-system/mobile/src/components/Dialog/Dialog.tsx`
- Create: `packages/design-system/mobile/src/components/Dialog/Dialog.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Dialog/index.ts`
- Create: `packages/design-system/mobile/__tests__/Dialog.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Dialog } from '../src/components/Dialog';
import { Button } from '../src/components/Button';

describe('Dialog', () => {
  it('renderiza o conteúdo quando visible=true', () => {
    render(
      <Dialog visible={true} onDismiss={() => {}} title="Confirmação">
        <></>
      </Dialog>,
    );
    expect(screen.getByText('Confirmação')).toBeTruthy();
  });

  it('não renderiza o conteúdo quando visible=false', () => {
    render(
      <Dialog visible={false} onDismiss={() => {}} title="Confirmação">
        <></>
      </Dialog>,
    );
    expect(screen.queryByText('Confirmação')).toBeNull();
  });

  it('chama onDismiss ao fechar', () => {
    const onDismiss = jest.fn();
    render(
      <Dialog visible={true} onDismiss={onDismiss} title="Aviso" testID="dialog">
        <></>
      </Dialog>,
    );
    // Paper Dialog expõe onDismiss no wrapper
    const dialog = screen.getByTestId('dialog');
    fireEvent(dialog, 'onDismiss');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('renderiza actions passados como prop', () => {
    render(
      <Dialog
        visible={true}
        onDismiss={() => {}}
        title="Confirmar"
        actions={<Button testID="action-btn">Confirmar</Button>}
      >
        <></>
      </Dialog>,
    );
    expect(screen.getByTestId('action-btn')).toBeTruthy();
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Dialog.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Dialog'`.

- [ ] **Step 3: Criar src/components/Dialog/Dialog.tsx**

```tsx
import React, { ReactNode } from 'react';
import { Dialog as PaperDialog, Portal } from 'react-native-paper';

export interface DialogProps {
  visible: boolean;
  onDismiss: () => void;
  title?: string;
  children?: ReactNode;
  actions?: ReactNode;
  testID?: string;
}

export function Dialog({ visible, onDismiss, title, children, actions, testID }: DialogProps) {
  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={onDismiss} testID={testID}>
        {title && <PaperDialog.Title>{title}</PaperDialog.Title>}
        {children && <PaperDialog.Content>{children}</PaperDialog.Content>}
        {actions && <PaperDialog.Actions>{actions}</PaperDialog.Actions>}
      </PaperDialog>
    </Portal>
  );
}
```

**Nota:** `Portal` do React Native Paper exige que o componente pai esteja envolvido em `PaperProvider`, que já é fornecido pelo `AllProviders` em `test-utils.tsx`.

- [ ] **Step 4: Criar src/components/Dialog/index.ts**

```ts
export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Dialog.test"
```

Esperado: todos os 4 testes PASS.

- [ ] **Step 6: Criar src/components/Dialog/Dialog.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Text } from 'react-native';
import { Dialog } from './Dialog';
import { Button } from '../Button';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    title: { control: 'text' },
    onDismiss: { action: 'onDismiss' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function DialogInterativo() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onPress={() => setVisible(true)}>Abrir Dialog</Button>
      <Dialog
        visible={visible}
        onDismiss={() => setVisible(false)}
        title="Confirmar ação"
        actions={
          <>
            <Button variant="ghost" size="sm" onPress={() => setVisible(false)}>
              Cancelar
            </Button>
            <Button size="sm" onPress={() => setVisible(false)}>
              Confirmar
            </Button>
          </>
        }
      >
        <Text>Tem certeza que deseja continuar?</Text>
      </Dialog>
    </>
  );
}

export const Interativo: Story = {
  render: () => <DialogInterativo />,
};

export const Aberto: Story = {
  args: {
    visible: true,
    title: 'Deletar item',
    children: <Text>Esta ação não pode ser desfeita.</Text>,
    actions: (
      <Button size="sm" variant="danger">
        Deletar
      </Button>
    ),
  },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Dialog/ \
        packages/design-system/mobile/__tests__/Dialog.test.tsx
git commit -m "feat(ds-mobile): add Dialog component"
```

---

## Task 10: Componente Input

**Files:**

- Create: `packages/design-system/mobile/src/components/Input/Input.tsx`
- Create: `packages/design-system/mobile/src/components/Input/Input.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Input/index.ts`
- Create: `packages/design-system/mobile/__tests__/Input.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Input } from '../src/components/Input';

describe('Input', () => {
  it('renderiza o label', () => {
    render(<Input value="" onChangeText={() => {}} label="E-mail" />);
    expect(screen.getByText('E-mail')).toBeTruthy();
  });

  it('chama onChangeText com o novo texto', () => {
    const onChangeText = jest.fn();
    render(<Input value="" onChangeText={onChangeText} label="Nome" testID="input" />);
    fireEvent.changeText(screen.getByTestId('input'), 'Carlos');
    expect(onChangeText).toHaveBeenCalledWith('Carlos');
  });

  it('renderiza mensagem de erro quando error é fornecido', () => {
    render(<Input value="" onChangeText={() => {}} label="Senha" error="Campo obrigatório" />);
    expect(screen.getByText('Campo obrigatório')).toBeTruthy();
  });

  it('não renderiza mensagem de erro quando error não é fornecido', () => {
    render(<Input value="" onChangeText={() => {}} label="Nome" />);
    expect(screen.queryByText('Campo obrigatório')).toBeNull();
  });

  it('renderiza como desabilitado', () => {
    render(<Input value="" onChangeText={() => {}} label="Campo" disabled testID="input" />);
    expect(screen.getByTestId('input').props.disabled).toBe(true);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Input.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Input'`.

- [ ] **Step 3: Criar src/components/Input/Input.tsx**

```tsx
import React from 'react';
import { TextInput as PaperTextInput, HelperText } from 'react-native-paper';

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export function Input({
  value,
  onChangeText,
  label,
  placeholder,
  error,
  disabled = false,
  secureTextEntry = false,
  testID,
  accessibilityLabel,
}: InputProps) {
  return (
    <>
      <PaperTextInput
        mode="outlined"
        value={value}
        onChangeText={onChangeText}
        label={label}
        placeholder={placeholder}
        error={Boolean(error)}
        disabled={disabled}
        secureTextEntry={secureTextEntry}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
      />
      {error && (
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      )}
    </>
  );
}
```

- [ ] **Step 4: Criar src/components/Input/index.ts**

```ts
export { Input } from './Input';
export type { InputProps } from './Input';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Input.test"
```

Esperado: todos os 5 testes PASS.

- [ ] **Step 6: Criar src/components/Input/Input.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    secureTextEntry: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function InputControlado(
  props: Omit<React.ComponentProps<typeof Input>, 'value' | 'onChangeText'>,
) {
  const [value, setValue] = useState('');
  return <Input {...props} value={value} onChangeText={setValue} />;
}

export const Default: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'E-mail', placeholder: 'seu@email.com' },
};

export const ComErro: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Senha', error: 'Senha muito curta' },
};

export const Desabilitado: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Campo bloqueado', disabled: true },
};

export const Senha: Story = {
  render: (args) => <InputControlado {...args} />,
  args: { label: 'Senha', secureTextEntry: true },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Input/ \
        packages/design-system/mobile/__tests__/Input.test.tsx
git commit -m "feat(ds-mobile): add Input component"
```

---

## Task 11: Componente Menu

**Files:**

- Create: `packages/design-system/mobile/src/components/Menu/Menu.tsx`
- Create: `packages/design-system/mobile/src/components/Menu/Menu.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Menu/index.ts`
- Create: `packages/design-system/mobile/__tests__/Menu.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React, { useState } from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Menu } from '../src/components/Menu';
import { Button } from '../src/components/Button';

describe('Menu', () => {
  it('renderiza o anchor', () => {
    render(
      <Menu
        visible={false}
        onDismiss={() => {}}
        anchor={<Button testID="anchor">Abrir</Button>}
        items={[]}
      />,
    );
    expect(screen.getByTestId('anchor')).toBeTruthy();
  });

  it('renderiza os itens quando visible=true', () => {
    render(
      <Menu
        visible={true}
        onDismiss={() => {}}
        anchor={<Button>Anchor</Button>}
        items={[
          { label: 'Editar', onPress: () => {} },
          { label: 'Deletar', onPress: () => {} },
        ]}
      />,
    );
    expect(screen.getByText('Editar')).toBeTruthy();
    expect(screen.getByText('Deletar')).toBeTruthy();
  });

  it('chama onPress do item ao pressionar', () => {
    const onPressEditar = jest.fn();
    render(
      <Menu
        visible={true}
        onDismiss={() => {}}
        anchor={<Button>Anchor</Button>}
        items={[{ label: 'Editar', onPress: onPressEditar }]}
      />,
    );
    fireEvent.press(screen.getByText('Editar'));
    expect(onPressEditar).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Menu.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Menu'`.

- [ ] **Step 3: Criar src/components/Menu/Menu.tsx**

```tsx
import React, { ReactNode } from 'react';
import { Menu as PaperMenu } from 'react-native-paper';

export interface MenuItemOption {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  visible: boolean;
  onDismiss: () => void;
  anchor: ReactNode;
  items: MenuItemOption[];
  testID?: string;
}

export function Menu({ visible, onDismiss, anchor, items, testID }: MenuProps) {
  return (
    <PaperMenu visible={visible} onDismiss={onDismiss} anchor={anchor} testID={testID}>
      {items.map((item, index) => (
        <PaperMenu.Item
          key={index}
          title={item.label}
          onPress={item.disabled ? undefined : item.onPress}
          disabled={item.disabled}
        />
      ))}
    </PaperMenu>
  );
}
```

- [ ] **Step 4: Criar src/components/Menu/index.ts**

```ts
export { Menu } from './Menu';
export type { MenuProps, MenuItemOption } from './Menu';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Menu.test"
```

Esperado: todos os 3 testes PASS.

- [ ] **Step 6: Criar src/components/Menu/Menu.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';
import { Button } from '../Button';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

function MenuInterativo() {
  const [visible, setVisible] = useState(false);
  return (
    <Menu
      visible={visible}
      onDismiss={() => setVisible(false)}
      anchor={<Button onPress={() => setVisible(true)}>Abrir Menu</Button>}
      items={[
        { label: 'Editar', onPress: () => setVisible(false) },
        { label: 'Compartilhar', onPress: () => setVisible(false) },
        { label: 'Deletar', onPress: () => setVisible(false) },
        { label: 'Arquivado (bloqueado)', onPress: () => {}, disabled: true },
      ]}
    />
  );
}

export const Interativo: Story = {
  render: () => <MenuInterativo />,
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Menu/ \
        packages/design-system/mobile/__tests__/Menu.test.tsx
git commit -m "feat(ds-mobile): add Menu component"
```

---

## Task 12: Componente Radio

**Files:**

- Create: `packages/design-system/mobile/src/components/Radio/Radio.tsx`
- Create: `packages/design-system/mobile/src/components/Radio/Radio.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Radio/index.ts`
- Create: `packages/design-system/mobile/__tests__/Radio.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Radio } from '../src/components/Radio';

describe('Radio', () => {
  it('renderiza o label', () => {
    render(<Radio selected={false} onPress={() => {}} label="Opção A" />);
    expect(screen.getByText('Opção A')).toBeTruthy();
  });

  it('chama onPress ao ser pressionado', () => {
    const onPress = jest.fn();
    render(<Radio selected={false} onPress={onPress} label="Opção" testID="radio" />);
    fireEvent.press(screen.getByTestId('radio'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não chama onPress quando disabled', () => {
    const onPress = jest.fn();
    render(<Radio selected={false} onPress={onPress} disabled label="Bloqueado" testID="radio" />);
    fireEvent.press(screen.getByTestId('radio'));
    expect(onPress).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Radio.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Radio'`.

- [ ] **Step 3: Criar src/components/Radio/Radio.tsx**

```tsx
import React from 'react';
import { RadioButton } from 'react-native-paper';

export interface RadioProps {
  selected: boolean;
  onPress: () => void;
  label?: string;
  disabled?: boolean;
  testID?: string;
  accessibilityLabel?: string;
}

export function Radio({
  selected,
  onPress,
  label = '',
  disabled = false,
  testID,
  accessibilityLabel,
}: RadioProps) {
  return (
    <RadioButton.Item
      status={selected ? 'checked' : 'unchecked'}
      onPress={disabled ? undefined : onPress}
      label={label}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
    />
  );
}
```

- [ ] **Step 4: Criar src/components/Radio/index.ts**

```ts
export { Radio } from './Radio';
export type { RadioProps } from './Radio';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Radio.test"
```

Esperado: todos os 3 testes PASS.

- [ ] **Step 6: Criar src/components/Radio/Radio.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Radio } from './Radio';

const meta: Meta<typeof Radio> = {
  title: 'Components/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    selected: { control: 'boolean' },
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    onPress: { action: 'onPress' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function RadioGrupo() {
  const [selected, setSelected] = useState('a');
  return (
    <>
      <Radio selected={selected === 'a'} onPress={() => setSelected('a')} label="Opção A" />
      <Radio selected={selected === 'b'} onPress={() => setSelected('b')} label="Opção B" />
      <Radio
        selected={selected === 'c'}
        onPress={() => setSelected('c')}
        label="Opção C"
        disabled
      />
    </>
  );
}

export const Grupo: Story = {
  render: () => <RadioGrupo />,
};

export const Selecionado: Story = {
  args: { selected: true, label: 'Selecionado' },
};

export const NaoSelecionado: Story = {
  args: { selected: false, label: 'Não selecionado' },
};

export const Desabilitado: Story = {
  args: { selected: false, label: 'Indisponível', disabled: true },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Radio/ \
        packages/design-system/mobile/__tests__/Radio.test.tsx
git commit -m "feat(ds-mobile): add Radio component"
```

---

## Task 13: Componente Select

**Files:**

- Create: `packages/design-system/mobile/src/components/Select/Select.tsx`
- Create: `packages/design-system/mobile/src/components/Select/Select.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Select/index.ts`
- Create: `packages/design-system/mobile/__tests__/Select.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Select } from '../src/components/Select';

const options = [
  { label: 'React Native', value: 'rn' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Expo', value: 'expo' },
];

describe('Select', () => {
  it('renderiza o placeholder quando nenhum valor selecionado', () => {
    render(
      <Select
        value=""
        onChange={() => {}}
        options={options}
        placeholder="Escolha uma opção"
        testID="select"
      />,
    );
    expect(screen.getByText('Escolha uma opção')).toBeTruthy();
  });

  it('renderiza o label do valor selecionado', () => {
    render(<Select value="rn" onChange={() => {}} options={options} testID="select" />);
    expect(screen.getByText('React Native')).toBeTruthy();
  });

  it('mostra as opções ao pressionar o trigger', () => {
    render(<Select value="" onChange={() => {}} options={options} testID="select" />);
    fireEvent.press(screen.getByTestId('select-trigger'));
    expect(screen.getByText('React Native')).toBeTruthy();
    expect(screen.getByText('Flutter')).toBeTruthy();
  });

  it('chama onChange com o valor da opção pressionada', () => {
    const onChange = jest.fn();
    render(<Select value="" onChange={onChange} options={options} testID="select" />);
    fireEvent.press(screen.getByTestId('select-trigger'));
    fireEvent.press(screen.getByText('Flutter'));
    expect(onChange).toHaveBeenCalledWith('flutter');
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Select.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Select'`.

- [ ] **Step 3: Criar src/components/Select/Select.tsx**

```tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { Menu as PaperMenu, TouchableRipple, Text } from 'react-native-paper';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  testID?: string;
}

export function Select({
  value,
  onChange,
  options,
  label,
  placeholder = 'Selecione',
  disabled = false,
  testID,
}: SelectProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const selectedLabel = options.find((o) => o.value === value)?.label ?? placeholder;

  return (
    <View testID={testID}>
      <PaperMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <TouchableRipple
            onPress={disabled ? undefined : () => setMenuVisible(true)}
            disabled={disabled}
            testID={testID ? `${testID}-trigger` : undefined}
          >
            <View>
              {label && <Text variant="labelSmall">{label}</Text>}
              <Text>{selectedLabel}</Text>
            </View>
          </TouchableRipple>
        }
      >
        {options.map((option) => (
          <PaperMenu.Item
            key={option.value}
            title={option.label}
            onPress={() => {
              onChange(option.value);
              setMenuVisible(false);
            }}
          />
        ))}
      </PaperMenu>
    </View>
  );
}
```

- [ ] **Step 4: Criar src/components/Select/index.ts**

```ts
export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Select.test"
```

Esperado: todos os 4 testes PASS.

- [ ] **Step 6: Criar src/components/Select/Select.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const frameworkOptions = [
  { label: 'React Native', value: 'rn' },
  { label: 'Flutter', value: 'flutter' },
  { label: 'Expo', value: 'expo' },
  { label: 'Ionic', value: 'ionic' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    placeholder: { control: 'text' },
    label: { control: 'text' },
    onChange: { action: 'onChange' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SelectControlado(props: Omit<React.ComponentProps<typeof Select>, 'value' | 'onChange'>) {
  const [value, setValue] = useState('');
  return <Select {...props} value={value} onChange={setValue} options={frameworkOptions} />;
}

export const Default: Story = {
  render: (args) => <SelectControlado {...args} />,
  args: { label: 'Framework', placeholder: 'Escolha um framework' },
};

export const ComValorInicial: Story = {
  render: () => {
    const [value, setValue] = useState('rn');
    return (
      <Select value={value} onChange={setValue} options={frameworkOptions} label="Framework" />
    );
  },
};

export const Desabilitado: Story = {
  render: (args) => <SelectControlado {...args} />,
  args: { label: 'Bloqueado', disabled: true },
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Select/ \
        packages/design-system/mobile/__tests__/Select.test.tsx
git commit -m "feat(ds-mobile): add Select component"
```

---

## Task 14: Componente Snackbar

**Files:**

- Create: `packages/design-system/mobile/src/components/Snackbar/Snackbar.tsx`
- Create: `packages/design-system/mobile/src/components/Snackbar/Snackbar.stories.tsx`
- Create: `packages/design-system/mobile/src/components/Snackbar/index.ts`
- Create: `packages/design-system/mobile/__tests__/Snackbar.test.tsx`

- [ ] **Step 1: Escrever o teste**

```tsx
import React from 'react';
import { render, screen, fireEvent } from './test-utils';
import { Snackbar } from '../src/components/Snackbar';

describe('Snackbar', () => {
  it('renderiza a mensagem quando visible=true', () => {
    render(<Snackbar visible={true} onDismiss={() => {}} message="Salvo com sucesso" />);
    expect(screen.getByText('Salvo com sucesso')).toBeTruthy();
  });

  it('não renderiza a mensagem quando visible=false', () => {
    render(<Snackbar visible={false} onDismiss={() => {}} message="Salvo com sucesso" />);
    expect(screen.queryByText('Salvo com sucesso')).toBeNull();
  });

  it('renderiza botão de ação quando action é fornecido', () => {
    render(
      <Snackbar
        visible={true}
        onDismiss={() => {}}
        message="Item deletado"
        action={{ label: 'Desfazer', onPress: () => {} }}
      />,
    );
    expect(screen.getByText('Desfazer')).toBeTruthy();
  });

  it('chama action.onPress ao pressionar o botão de ação', () => {
    const onPressMock = jest.fn();
    render(
      <Snackbar
        visible={true}
        onDismiss={() => {}}
        message="Item deletado"
        action={{ label: 'Desfazer', onPress: onPressMock }}
      />,
    );
    fireEvent.press(screen.getByText('Desfazer'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Rodar o teste para confirmar FAIL**

```bash
yarn workspace @ds/mobile test --testPathPattern="Snackbar.test"
```

Esperado: FAIL — `Cannot find module '../src/components/Snackbar'`.

- [ ] **Step 3: Criar src/components/Snackbar/Snackbar.tsx**

```tsx
import React from 'react';
import { Snackbar as PaperSnackbar } from 'react-native-paper';

export interface SnackbarProps {
  visible: boolean;
  onDismiss: () => void;
  message: string;
  duration?: number;
  action?: { label: string; onPress: () => void };
  testID?: string;
}

export function Snackbar({
  visible,
  onDismiss,
  message,
  duration = PaperSnackbar.DURATION_SHORT,
  action,
  testID,
}: SnackbarProps) {
  if (!visible) return null;

  return (
    <PaperSnackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      action={action}
      testID={testID}
    >
      {message}
    </PaperSnackbar>
  );
}
```

- [ ] **Step 4: Criar src/components/Snackbar/index.ts**

```ts
export { Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';
```

- [ ] **Step 5: Rodar o teste e confirmar PASS**

```bash
yarn workspace @ds/mobile test --testPathPattern="Snackbar.test"
```

Esperado: todos os 4 testes PASS.

- [ ] **Step 6: Criar src/components/Snackbar/Snackbar.stories.tsx**

```tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Snackbar } from './Snackbar';
import { Button } from '../Button';

const meta: Meta<typeof Snackbar> = {
  title: 'Components/Snackbar',
  component: Snackbar,
  tags: ['autodocs'],
  argTypes: {
    visible: { control: 'boolean' },
    message: { control: 'text' },
    onDismiss: { action: 'onDismiss' },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SnackbarInterativo({
  message,
  action,
}: {
  message: string;
  action?: { label: string; onPress: () => void };
}) {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ padding: 16 }}>
      <Button onPress={() => setVisible(true)}>Mostrar Snackbar</Button>
      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        message={message}
        action={action}
      />
    </View>
  );
}

export const Default: Story = {
  render: () => <SnackbarInterativo message="Operação realizada com sucesso" />,
};

export const ComAcao: Story = {
  render: () => (
    <SnackbarInterativo message="Item deletado" action={{ label: 'Desfazer', onPress: () => {} }} />
  ),
};
```

- [ ] **Step 7: Commit**

```bash
git add packages/design-system/mobile/src/components/Snackbar/ \
        packages/design-system/mobile/__tests__/Snackbar.test.tsx
git commit -m "feat(ds-mobile): add Snackbar component"
```

---

## Task 15: Barrel exports e verificação final

**Files:**

- Create: `packages/design-system/mobile/src/components/index.ts`
- Modify: `packages/design-system/mobile/src/index.ts`

- [ ] **Step 1: Criar src/components/index.ts**

```ts
export { AppBar } from './AppBar';
export type { AppBarProps } from './AppBar';

export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';

export { Dialog } from './Dialog';
export type { DialogProps } from './Dialog';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Menu } from './Menu';
export type { MenuProps, MenuItemOption } from './Menu';

export { Radio } from './Radio';
export type { RadioProps } from './Radio';

export { Select } from './Select';
export type { SelectProps, SelectOption } from './Select';

export { Snackbar } from './Snackbar';
export type { SnackbarProps } from './Snackbar';
```

- [ ] **Step 2: Reescrever src/index.ts**

```ts
// NativeWind utilities para apps consumidores que usam NativeWind
export { useColorScheme, vars } from 'nativewind';

// Theme Paper (mapeia @ds/tokens para MD3)
export { theme } from './theme';
export type { AppTheme } from './theme';

// Todos os componentes e seus tipos
export * from './components';
```

- [ ] **Step 3: Rodar todos os testes**

```bash
yarn workspace @ds/mobile test
```

Esperado: todos os testes PASS. Nenhum FAIL.

- [ ] **Step 4: Checar tipos**

```bash
yarn workspace @ds/mobile check-types
```

Esperado: sem erros.

- [ ] **Step 5: Rodar o lint**

```bash
yarn workspace @ds/mobile lint
```

Esperado: 0 warnings.

- [ ] **Step 6: Commit dos exports**

```bash
git add packages/design-system/mobile/src/components/index.ts \
        packages/design-system/mobile/src/index.ts
git commit -m "feat(ds-mobile): add barrel exports for all components and theme"
```

- [ ] **Step 7: Verificar o Storybook**

```bash
yarn workspace @ds/mobile storybook
```

Abrir `http://localhost:6007` e verificar:

- Todos os 10 componentes aparecem no sidebar (AppBar, Button, Card, Checkbox, Dialog, Input, Menu, Radio, Select, Snackbar)
- Controls de `variant`, `size`, `disabled` funcionam no Button
- `PaperProvider` aplica o tema corretamente (cor primária indigo, bordas arredondadas)
- Nenhum erro de "Cannot find module react-native" no console

- [ ] **Step 8: Commit final**

```bash
git add -A
git commit -m "chore(ds-mobile): verify storybook and complete implementation"
```
