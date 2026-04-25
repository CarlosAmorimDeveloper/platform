# Platform

Monorepo contendo uma aplicação Todo e um Design System de componentes React compartilhados, construído com [Turborepo](https://turborepo.dev), [Next.js](https://nextjs.org) e [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/).

## Pré-requisitos

| Ferramenta | Versão mínima |
|---|---|
| Node.js | 18 |
| Yarn | 1.22.x |

> O projeto usa **Yarn v1 (Classic)**. Não use `npm` ou `pnpm` — o lockfile e os workspaces são específicos do Yarn.

## Estrutura do projeto

```
platform/
├── apps/
│   └── web/
│       └── todo-app/          # Aplicação Next.js 16
│           ├── src/
│           │   ├── app/       # App Router (layout, page, globals.css)
│           │   ├── components/
│           │   │   ├── TaskForm/
│           │   │   ├── TaskItem/
│           │   │   └── TaskList/
│           │   └── redux/     # Store, slice e provider
│           └── package.json
├── packages/
│   ├── ui/                    # Design System (@repo/ui)
│   │   ├── components/
│   │   │   ├── Button/
│   │   │   └── Input/
│   │   └── package.json
│   ├── eslint-config/         # Configuração ESLint compartilhada
│   └── typescript-config/     # tsconfig base compartilhado
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
yarn workspace @repo/ui storybook
# ou via turbo:
yarn turbo storybook
```

O Storybook ficará disponível em `http://localhost:6006`.

## Scripts disponíveis

Execute os scripts abaixo a partir da **raiz do monorepo**:

| Comando | Descrição |
|---|---|
| `yarn dev` | Inicia todos os servidores em modo desenvolvimento |
| `yarn build` | Compila todas as aplicações e pacotes |
| `yarn lint` | Executa o ESLint em todo o projeto |
| `yarn check-types` | Verifica os tipos TypeScript em todo o projeto |
| `yarn format` | Formata o código com Prettier |
| `yarn format:check` | Verifica a formatação sem aplicar mudanças |

### Scripts da Todo App

```sh
cd apps/web/todo-app

yarn dev        # Servidor de desenvolvimento Next.js (Turbopack)
yarn build      # Build de produção
yarn start      # Inicia o servidor de produção (requer build)
yarn test       # Executa os testes com Jest
yarn lint       # Lint do projeto
```

### Scripts do Design System (`packages/ui`)

```sh
cd packages/ui

yarn storybook        # Inicia o Storybook em modo desenvolvimento
yarn build-storybook  # Gera o build estático do Storybook
yarn check-types      # Verificação de tipos TypeScript
yarn lint             # Lint do pacote
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
# A partir da raiz (roda testes de todos os pacotes que os possuem)
cd apps/web/todo-app
yarn test

# Com watch mode
yarn test --watch
```

Os testes usam **Jest** + **Testing Library**. Cada componente tem seu arquivo `*.spec.tsx` no mesmo diretório.

## Design System (`@repo/ui`)

O pacote `@repo/ui` exporta componentes React reutilizáveis estilizados com CSS Modules (SCSS). Ele é consumido pela Todo App via alias de workspace.

### `Button`

```tsx
import { Button } from "@repo/ui/components/Button";

<Button>Adicionar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost" size="sm">Editar</Button>
<Button variant="danger" size="sm">Remover</Button>
<Button type="submit" disabled={!value}>Salvar</Button>
```

| Prop | Tipo | Padrão | Opções |
|---|---|---|---|
| `variant` | string | `"primary"` | `"primary"` `"secondary"` `"ghost"` `"danger"` |
| `size` | string | `"md"` | `"md"` `"sm"` |
| `type` | string | `"button"` | `"button"` `"submit"` `"reset"` |
| `disabled` | boolean | `false` | — |

### `Input`

```tsx
import { Input } from "@repo/ui/components/Input";

<Input placeholder="Nova tarefa…" />
<Input variant="inline" autoFocus />
<Input type="checkbox" checked={done} onChange={handleToggle} />
<Input disabled placeholder="Desativado" />
```

| Prop | Tipo | Padrão | Opções |
|---|---|---|---|
| `variant` | string | `"default"` | `"default"` `"inline"` |
| `type` | string | `"text"` | qualquer tipo nativo de `<input>` |

> Quando `type="checkbox"`, o `variant` é ignorado e o estilo de checkbox é aplicado automaticamente.

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
  id: string;         // UUID gerado com crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: string;  // ISO 8601
}
```

### Componentes

| Componente | Responsabilidade |
|---|---|
| `TaskForm` | Formulário para criar ou editar uma tarefa |
| `TaskList` | Lista todas as tarefas do store |
| `TaskItem` | Renderiza uma tarefa individual com toggle, edição inline e remoção |

A edição inline no `TaskItem` é ativada por duplo clique ou pela tecla `Enter`/`Espaço` quando o item está focado.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Monorepo | Turborepo + Yarn Workspaces v1 |
| Framework | Next.js 16 (App Router, Turbopack) |
| UI | React 19 |
| Estado | Redux Toolkit |
| Estilização | Tailwind CSS v4 + SCSS Modules |
| Design System | `@repo/ui` (componentes próprios) |
| Documentação de componentes | Storybook 8 |
| Testes | Jest + Testing Library |
| Tipos | TypeScript 5.9 |
| Lint / Formato | ESLint + Prettier |
