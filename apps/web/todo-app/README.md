# Todo App

[![Vercel][vercel-shield]][vercel-url]
[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Redux][redux-shield]][redux-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

Aplicação de gerenciamento de tarefas construída com [Next.js 16](https://nextjs.org) e [Redux Toolkit](https://redux-toolkit.js.org). Parte do monorepo `platform`, em `apps/web/todo-app`.

**Deploy:** [https://todo-app-vuotto.vercel.app](https://todo-app-vuotto.vercel.app)

## Índice

- [Funcionalidades](#funcionalidades)
- [Construído com](#construído-com)
- [Arquitetura](#arquitetura)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Testes](#testes)
- [Estrutura](#estrutura)
- [Tecnologias](#tecnologias)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Funcionalidades

- **Criar tarefa** — formulário simples com título.
- **Concluir/reabrir** — toggle de status por clique.
- **Editar inline** — duplo clique no título, ou `Enter`/`Espaço` com o item focado, ativa edição direta na lista.
- **Remover tarefa**.
- **Persistência automática** — todo o estado é salvo no `localStorage` a cada mudança, sem precisar de backend.

## Construído com

[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Redux][redux-shield]][redux-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

## Arquitetura

O estado das tarefas é gerenciado com **Redux Toolkit** e persiste automaticamente no `localStorage`:

```
src/redux/
├── store.ts          # configureStore + subscribe para persistência
├── taskSlice.ts      # actions: addTask, toggleTask, editTask, removeTask, hydrateState
└── ReduxProvider.tsx # Provider com hidratação segura via useEffect (evita mismatch de SSR)
```

**Modelo de dados (`Task`):**

```ts
interface Task {
  id: string; // crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}
```

**Componentes:**

| Componente | Responsabilidade                                                    |
| ---------- | ------------------------------------------------------------------- |
| `TaskForm` | Formulário para criar ou editar uma tarefa                          |
| `TaskList` | Lista todas as tarefas do store                                     |
| `TaskItem` | Renderiza uma tarefa individual com toggle, edição inline e remoção |

`ReduxProvider` hidrata o store via `useEffect` para evitar mismatch de SSR — o store nunca é acessado diretamente durante o render no servidor.

## Desenvolvimento

```sh
# a partir da raiz do monorepo
yarn dev --filter=todo-app
# ou diretamente:
cd apps/web/todo-app
yarn dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Scripts

| Comando      | Descrição                                    |
| ------------ | -------------------------------------------- |
| `yarn dev`   | Servidor de desenvolvimento Next.js          |
| `yarn build` | Build de produção                            |
| `yarn start` | Inicia o servidor de produção (requer build) |
| `yarn test`  | Testes com Jest                              |
| `yarn lint`  | Lint do projeto                              |

## Testes

```sh
yarn test

# Watch mode
yarn test --watch
```

Jest + Testing Library. Cada componente tem seu arquivo `*.spec.tsx` no mesmo diretório.

## Estrutura

```
apps/web/todo-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Layout raiz (fonte, metadados)
│   │   ├── page.tsx          # Página principal
│   │   └── globals.css       # Estilos globais + Tailwind
│   ├── components/
│   │   ├── TaskForm/
│   │   ├── TaskItem/
│   │   └── TaskList/
│   └── redux/
│       ├── store.ts
│       ├── taskSlice.ts
│       └── ReduxProvider.tsx
└── package.json
```

## Tecnologias

| Camada        | Tecnologia              |
| ------------- | ----------------------- |
| Framework     | Next.js 16 (App Router) |
| UI            | React 19                |
| Estado global | Redux Toolkit           |
| Estilização   | Tailwind CSS v4         |
| Design System | `@industry/web`         |
| Testes        | Jest + Testing Library  |
| Deploy        | Vercel                  |
| Tipos         | TypeScript 5.9 (strict) |

## Contribuindo

Consulte o [README raiz do monorepo](../../../README.md) para instruções de configuração e fluxo de contribuição.

## Licença

Uso interno — repositório privado.

---

[vercel-shield]: https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white
[vercel-url]: https://todo-app-vuotto.vercel.app
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
[jest-shield]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io
