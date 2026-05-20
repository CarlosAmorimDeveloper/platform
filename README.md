# Platform

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Vercel][vercel-shield]][vercel-url]

Monorepo contendo uma aplicação Todo e um Design System de componentes React compartilhados, construído com [Turborepo](https://turborepo.dev), [Next.js](https://nextjs.org) e [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

**Todo App:** [https://todo-app-vuotto.vercel.app](https://todo-app-vuotto.vercel.app)

## Índice

- [Construído com](#construído-com)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Scripts disponíveis](#scripts-disponíveis)
- [Build de produção](#build-de-produção)
- [Testes](#testes)
- [Design System](#design-system)
- [Arquitetura da Todo App](#arquitetura-da-todo-app)
- [Tecnologias](#tecnologias)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Construído com

[![Turborepo][turborepo-shield]][turborepo-url]
[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Redux][redux-shield]][redux-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![Storybook][storybook-shield]][storybook-url]
[![Chromatic][chromatic-shield]][chromatic-url]
[![Vercel][vercel-shield]][vercel-url]
[![Yarn][yarn-shield]][yarn-url]

## Pré-requisitos

| Ferramenta | Versão mínima |
| ---------- | ------------- |
| Node.js    | 18            |
| Yarn       | 1.22.x        |

> O projeto usa **Yarn v1 (Classic)**. Não use `npm` ou `pnpm` — o lockfile e os workspaces são específicos do Yarn.

## Estrutura do projeto

```
platform/
├── apps/
│   └── web/
│       └── todo-app/                  # Aplicação Next.js 16
│           ├── src/
│           │   ├── app/               # App Router (layout, page, globals.css)
│           │   ├── components/
│           │   │   ├── TaskForm/
│           │   │   ├── TaskItem/
│           │   │   └── TaskList/
│           │   └── redux/             # Store, slice e provider
│           └── package.json
├── packages/
│   ├── design-system/
│   │   ├── web/                       # Componentes React (@ds/web)
│   │   │   ├── components/
│   │   │   │   ├── Button/
│   │   │   │   └── Input/
│   │   │   └── package.json
│   │   ├── mobile/                    # Componentes React Native (@ds/mobile)
│   │   │   ├── src/
│   │   │   │   └── index.ts
│   │   │   ├── tailwind.config.js
│   │   │   ├── tailwind-utils.js
│   │   │   ├── babel.config.js
│   │   │   ├── metro.config.js
│   │   │   ├── global.css
│   │   │   └── package.json
│   │   └── tokens/                    # Tokens de design (@ds/tokens)
│   │       ├── src/
│   │       │   ├── colors.ts
│   │       │   ├── spacing.ts
│   │       │   ├── font-sizes.ts
│   │       │   ├── radii.ts
│   │       │   ├── global.css
│   │       │   └── index.ts
│   │       └── package.json
│   ├── eslint-config/                 # Configuração ESLint compartilhada
│   └── typescript-config/             # tsconfig base compartilhado
├── turbo.json
└── package.json
```

## Instalação

Clone o repositório e instale as dependências a partir da raiz do monorepo:

```sh
git clone <url-do-repositorio>
cd platform
yarn install
```

O Yarn Workspaces instala as dependências de todos os pacotes em uma única etapa.

## Desenvolvimento

### Tudo ao mesmo tempo (recomendado)

Inicia a Todo App e o Storybook em paralelo via Turborepo:

```sh
yarn dev
```

### Somente a Todo App

```sh
yarn dev --filter=todo-app
# ou diretamente:
cd apps/web/todo-app
yarn dev
```

A aplicação ficará disponível em `http://localhost:3000`.

### Somente o Storybook

```sh
yarn workspace @ds/web storybook
# ou via turbo:
yarn turbo storybook
```

O Storybook ficará disponível em `http://localhost:6006`.

## Scripts disponíveis

Execute os scripts abaixo a partir da **raiz do monorepo**:

| Comando             | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `yarn dev`          | Inicia todos os servidores em modo desenvolvimento |
| `yarn build`        | Compila todas as aplicações e pacotes              |
| `yarn lint`         | Executa o ESLint em todo o projeto                 |
| `yarn check-types`  | Verifica os tipos TypeScript em todo o projeto     |
| `yarn format`       | Formata o código com Prettier                      |
| `yarn format:check` | Verifica a formatação sem aplicar mudanças         |
| `yarn changeset`    | Cria um changeset para versionamento de pacotes    |

### Scripts da Todo App

```sh
cd apps/web/todo-app

yarn dev        # Servidor de desenvolvimento Next.js
yarn build      # Build de produção
yarn start      # Inicia o servidor de produção (requer build)
yarn test       # Executa os testes com Jest
yarn lint       # Lint do projeto
```

### Scripts do Design System Web (`packages/design-system/web`)

```sh
cd packages/design-system/web

yarn storybook        # Inicia o Storybook em modo desenvolvimento
yarn build-storybook  # Gera o build estático do Storybook
yarn check-types      # Verificação de tipos TypeScript
yarn lint             # Lint do pacote
```

### Scripts do Design System Mobile (`packages/design-system/mobile`)

```sh
cd packages/design-system/mobile

yarn test             # Executa os testes com Jest
yarn check-types      # Verificação de tipos TypeScript
```

## Build de produção

```sh
# Build completo do monorepo
yarn build

# Build somente da Todo App
yarn build --filter=todo-app
```

O output da Todo App fica em `apps/web/todo-app/.next/`.

## Testes

```sh
cd apps/web/todo-app
yarn test

# Com watch mode
yarn test --watch
```

Os testes usam **Jest** + **Testing Library**. Cada componente tem seu arquivo `*.spec.tsx` no mesmo diretório.

## Design System

O monorepo possui três pacotes de design system:

### `@ds/web` — Componentes React

Exporta componentes React reutilizáveis estilizados com CSS Modules (SCSS) e Tailwind CSS. Consumido pela Todo App via alias de workspace.

#### `Button`

```tsx
import { Button } from "@ds/web/components/Button";

<Button>Adicionar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost" size="sm">Editar</Button>
<Button variant="danger" size="sm">Remover</Button>
<Button type="submit" disabled={!value}>Salvar</Button>
```

| Prop       | Tipo    | Padrão      | Opções                                         |
| ---------- | ------- | ----------- | ---------------------------------------------- |
| `variant`  | string  | `"primary"` | `"primary"` `"secondary"` `"ghost"` `"danger"` |
| `size`     | string  | `"md"`      | `"md"` `"sm"`                                  |
| `type`     | string  | `"button"`  | `"button"` `"submit"` `"reset"`                |
| `disabled` | boolean | `false`     | —                                              |

#### `Input`

```tsx
import { Input } from "@ds/web/components/Input";

<Input placeholder="Nova tarefa…" />
<Input variant="inline" autoFocus />
<Input type="checkbox" checked={done} onChange={handleToggle} />
<Input disabled placeholder="Desativado" />
```

| Prop      | Tipo   | Padrão      | Opções                            |
| --------- | ------ | ----------- | --------------------------------- |
| `variant` | string | `"default"` | `"default"` `"inline"`            |
| `type`    | string | `"text"`    | qualquer tipo nativo de `<input>` |

> Quando `type="checkbox"`, o `variant` é ignorado e o estilo de checkbox é aplicado automaticamente.

### `@ds/mobile` — Componentes React Native

Configura o [NativeWind v4](https://www.nativewind.dev) para React Native com o tema do design system. Importa os tokens de `@ds/tokens` e os mapeia para o Tailwind CSS, gerando classes de estilo compatíveis com React Native StyleSheet.

```ts
import { styled, useColorScheme, vars } from '@ds/mobile';
```

Inclui `tailwind.config.js`, `babel.config.js` e `metro.config.js` prontos para uso. Consulte [`packages/design-system/mobile`](packages/design-system/mobile/README.md) para a referência completa.

### `@ds/tokens` — Tokens de design

Exporta constantes TypeScript e variáveis CSS para cores, espaçamentos, tamanhos de fonte e raios de borda.

```ts
import { colors, spacing, fontSizes, radii } from '@ds/tokens';
import '@ds/tokens/global.css';
```

Consulte [`packages/design-system/tokens`](packages/design-system/tokens/README.md) para a referência completa.

## Arquitetura da Todo App

### Estado global (Redux)

O estado das tarefas é gerenciado com **Redux Toolkit** e persiste automaticamente no `localStorage`.

```
src/redux/
├── store.ts          # configureStore + subscribe para persistência
├── taskSlice.ts      # actions: addTask, toggleTask, editTask, removeTask, hydrateState
└── ReduxProvider.tsx # Provider com hidratação segura via useEffect (evita mismatch de SSR)
```

**Modelo de dados (`Task`):**

```ts
interface Task {
  id: string; // UUID gerado com crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}
```

### Componentes

| Componente | Responsabilidade                                                    |
| ---------- | ------------------------------------------------------------------- |
| `TaskForm` | Formulário para criar ou editar uma tarefa                          |
| `TaskList` | Lista todas as tarefas do store                                     |
| `TaskItem` | Renderiza uma tarefa individual com toggle, edição inline e remoção |

A edição inline no `TaskItem` é ativada por duplo clique ou pela tecla `Enter`/`Espaço` quando o item está focado.

## Tecnologias

| Camada                      | Tecnologia                     |
| --------------------------- | ------------------------------ |
| Monorepo                    | Turborepo + Yarn Workspaces v1 |
| Framework                   | Next.js 16 (App Router)        |
| UI                          | React 19                       |
| Estado                      | Redux Toolkit                  |
| Estilização                 | Tailwind CSS v4 + SCSS Modules |
| Design System (web)         | `@ds/web` + `@ds/tokens`       |
| Design System (mobile)      | `@ds/mobile` + NativeWind v4   |
| Documentação de componentes | Storybook 8                    |
| Testes visuais              | Chromatic                      |
| Testes                      | Jest + Testing Library         |
| Tipos                       | TypeScript 5.9                 |
| Lint / Formato              | ESLint + Prettier              |

## Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro para discutir o que você gostaria de mudar.

Ao alterar pacotes do design system (`@ds/web`, `@ds/mobile` ou `@ds/tokens`), lembre-se de criar um changeset:

```sh
yarn changeset
```

## Licença

Uso interno — repositório privado.

---

[contributors-shield]: https://img.shields.io/github/contributors/CarlosAmorimDeveloper/platform.svg?style=for-the-badge
[contributors-url]: https://github.com/CarlosAmorimDeveloper/platform/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/CarlosAmorimDeveloper/platform.svg?style=for-the-badge
[forks-url]: https://github.com/CarlosAmorimDeveloper/platform/network/members
[stars-shield]: https://img.shields.io/github/stars/CarlosAmorimDeveloper/platform.svg?style=for-the-badge
[stars-url]: https://github.com/CarlosAmorimDeveloper/platform/stargazers
[issues-shield]: https://img.shields.io/github/issues/CarlosAmorimDeveloper/platform.svg?style=for-the-badge
[issues-url]: https://github.com/CarlosAmorimDeveloper/platform/issues
[vercel-shield]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[vercel-url]: https://todo-app-vuotto.vercel.app
[turborepo-shield]: https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white
[turborepo-url]: https://turborepo.dev
[nextjs-shield]: https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[nextjs-url]: https://nextjs.org
[react-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[react-url]: https://react.dev
[redux-shield]: https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white
[redux-url]: https://redux-toolkit.js.org
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[tailwind-shield]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[tailwind-url]: https://tailwindcss.com
[storybook-shield]: https://img.shields.io/badge/Storybook-FF4785?style=for-the-badge&logo=storybook&logoColor=white
[storybook-url]: https://storybook.js.org
[chromatic-shield]: https://img.shields.io/badge/Chromatic-FC521F?style=for-the-badge&logo=chromatic&logoColor=white
[chromatic-url]: https://www.chromatic.com
[yarn-shield]: https://img.shields.io/badge/Yarn-2C8EBB?style=for-the-badge&logo=yarn&logoColor=white
[yarn-url]: https://classic.yarnpkg.com
