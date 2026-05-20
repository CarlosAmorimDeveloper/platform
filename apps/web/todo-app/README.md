# Todo App

[![Vercel][vercel-shield]][vercel-url]
[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Redux][redux-shield]][redux-url]
[![TypeScript][typescript-shield]][typescript-url]

Aplicação de gerenciamento de tarefas construída com [Next.js 16](https://nextjs.org) e [Redux Toolkit](https://redux-toolkit.js.org). Parte do monorepo `platform`.

**Deploy:** [https://todo-app-vuotto.vercel.app](https://todo-app-vuotto.vercel.app)

## Índice

- [Construído com](#construído-com)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Estrutura](#estrutura)
- [Estado global](#estado-global)
- [Testes](#testes)
- [Dependências principais](#dependências-principais)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Construído com

[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Redux][redux-shield]][redux-url]
[![Tailwind CSS][tailwind-shield]][tailwind-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

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

| Comando      | Descrição                                    |
| ------------ | -------------------------------------------- |
| `yarn dev`   | Servidor de desenvolvimento Next.js          |
| `yarn build` | Build de produção                            |
| `yarn start` | Inicia o servidor de produção (requer build) |
| `yarn test`  | Executa os testes com Jest                   |
| `yarn lint`  | Lint do projeto                              |

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
  id: string; // crypto.randomUUID()
  title: string;
  completed: boolean;
  createdAt: string; // ISO 8601
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

| Pacote        | Versão    |
| ------------- | --------- |
| Next.js       | 16        |
| React         | 19        |
| Redux Toolkit | ^2        |
| `@ds/web`     | workspace |
| Tailwind CSS  | v4        |

## Contribuindo

Consulte o [README raiz do monorepo](../../README.md) para instruções de configuração e fluxo de contribuição.

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
