# Todo App

Aplicação de gerenciamento de tarefas construída com [Next.js 16](https://nextjs.org) e [Redux Toolkit](https://redux-toolkit.js.org). Parte do monorepo `platform`.

**Deploy:** [https://todo-app-vuotto.vercel.app](https://todo-app-vuotto.vercel.app)

## Desenvolvimento

A partir da raiz do monorepo:

```sh
yarn dev --filter=todo-app
```

Ou diretamente neste diretório:

```sh
yarn dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Scripts

| Comando | Descrição |
|---|---|
| `yarn dev` | Servidor de desenvolvimento Next.js |
| `yarn build` | Build de produção |
| `yarn start` | Inicia o servidor de produção (requer build) |
| `yarn test` | Executa os testes com Jest |
| `yarn lint` | Lint do projeto |

## Estrutura

```
src/
├── app/
│   ├── layout.tsx        # Layout raiz (fonte, metadados)
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globais + Tailwind
├── components/
│   ├── TaskForm/         # Formulário de criação/edição de tarefas
│   ├── TaskItem/         # Item individual com toggle, edição inline e remoção
│   └── TaskList/         # Lista de tarefas do store
└── redux/
    ├── store.ts          # configureStore + persistência no localStorage
    ├── taskSlice.ts      # Slice com actions: addTask, toggleTask, editTask, removeTask
    └── ReduxProvider.tsx # Provider com hidratação SSR-safe
```

## Estado global

O estado é gerenciado com **Redux Toolkit** e persiste automaticamente no `localStorage`.

**Modelo de dados:**

```ts
interface Task {
  id: string;         // crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: string;  // ISO 8601
}
```

## Testes

```sh
yarn test

# Watch mode
yarn test --watch
```

Os testes usam **Jest** + **Testing Library**. Cada componente tem seu arquivo `*.spec.tsx` no mesmo diretório.

## Dependências principais

| Pacote | Versão |
|---|---|
| Next.js | 16 |
| React | 19 |
| Redux Toolkit | ^2 |
| `@ds/web` | workspace |
| Tailwind CSS | v4 |
