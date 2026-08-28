# Platform

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Vercel][vercel-shield]][vercel-url]

Monorepo pessoal reunindo uma aplicação web, dois apps mobile publicados na Google Play Store e um Design System compartilhado entre as duas plataformas — construído com [Turborepo](https://turborepo.dev), [Yarn Workspaces](https://classic.yarnpkg.com/en/docs/workspaces/), [Next.js](https://nextjs.org) e [Expo](https://expo.dev).

**Todo App:** [https://todo-app-vuotto.vercel.app](https://todo-app-vuotto.vercel.app)

## Índice

- [Aplicações](#aplicações)
- [Construído com](#construído-com)
- [Pré-requisitos](#pré-requisitos)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Instalação](#instalação)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Design System](#design-system)
- [Tecnologias](#tecnologias)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Aplicações

Cada app tem seu próprio README com detalhes de arquitetura, funcionalidades e scripts.

| App                                              | Plataforma                | O que é                                                                                             | Stack principal                               |
| ------------------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| [Todo App](apps/web/todo-app/README.md)          | Web (Next.js 16)          | Gerenciador de tarefas com persistência local                                                       | Redux Toolkit, Tailwind CSS, `@industry/web`  |
| [AppointMate](apps/mobile/appointmate/README.md) | Mobile (Expo/Android/iOS) | Registro estruturado de humor/sono/medicação entre consultas de saúde mental, com exportação em PDF | Firebase, React Hook Form, `@industry/mobile` |
| [Tickets App](apps/mobile/tickets-app/README.md) | Mobile (Expo/Android/iOS) | Sistema de tickets multi-tenant por workspace, publicado na Play Store                              | Firebase, Zustand, `@industry/mobile`         |

As três consomem o mesmo Design System Industry (`@industry/web` na web, `@industry/mobile` nos apps nativos), temado a partir de `@industry/tokens`. O design system anterior, Vuotto Tech, foi substituído nessa migração e removido do monorepo.

## Construído com

[![Turborepo][turborepo-shield]][turborepo-url]
[![Next.js][nextjs-shield]][nextjs-url]
[![React][react-shield]][react-url]
[![Expo][expo-shield]][expo-url]
[![React Native][reactnative-shield]][reactnative-url]
[![Firebase][firebase-shield]][firebase-url]
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
│   ├── web/
│   │   └── todo-app/           # Next.js 16 — ver README do projeto
│   └── mobile/
│       ├── appointmate/        # Expo — registro de saúde mental (LGPD)
│       └── tickets-app/        # Expo — tickets multi-tenant (Play Store)
├── packages/
│   ├── design-system/
│   │   └── industry/
│   │       ├── web/             # Componentes React (@industry/web)
│   │       ├── mobile/          # Componentes React Native (@industry/mobile)
│   │       └── tokens/          # Tokens de design (@industry/tokens)
│   ├── eslint-config/          # Configuração ESLint compartilhada
│   └── typescript-config/      # tsconfig base compartilhado
├── turbo.json
└── package.json
```

## Instalação

```sh
git clone <url-do-repositorio>
cd platform
yarn install
```

O Yarn Workspaces instala as dependências de todos os pacotes em uma única etapa.

## Desenvolvimento

```sh
yarn dev                                # Roda o dev script persistente de cada workspace em paralelo
yarn dev --filter=todo-app              # Só a Todo App -> http://localhost:3000
yarn workspace @industry/web storybook  # Storybook do design system web -> http://localhost:6010
yarn workspace @app/appointmate start   # Um app mobile (ou @app/tickets)
```

Cada app mobile requer seu próprio `.env` local com credenciais do Firebase — veja o `.env.example` de cada projeto.

## Scripts

Execute a partir da **raiz do monorepo**:

| Comando             | Descrição                                          |
| ------------------- | -------------------------------------------------- |
| `yarn dev`          | Inicia todos os servidores em modo desenvolvimento |
| `yarn build`        | Compila todas as aplicações e pacotes              |
| `yarn lint`         | ESLint em todo o projeto                           |
| `yarn check-types`  | TypeScript em todo o projeto                       |
| `yarn format`       | Formata o código com Prettier                      |
| `yarn format:check` | Verifica a formatação sem aplicar mudanças         |
| `yarn changeset`    | Cria um changeset para versionamento de pacotes    |

Scripts específicos de cada app/pacote (`test`, `build:android`, `storybook` etc.) estão listados no README correspondente.

## Design System

O design system adotado pelos três apps é o **Industry**, três pacotes temados a partir de `@industry/tokens`:

- **[`@industry/web`](packages/design-system/industry/web/README.md)** — componentes React, próprios (sem MUI/Emotion), estilizados via CSS custom properties. Documentado no Storybook, com regressão visual via Chromatic.
- **[`@industry/mobile`](packages/design-system/industry/mobile/README.md)** — componentes React Native, próprios (sem React Native Paper).
- **[`@industry/tokens`](packages/design-system/industry/tokens/README.md)** — cores, espaçamentos e tamanhos de fonte, como constantes TypeScript e variáveis CSS.

O design system anterior, **Vuotto Tech**, foi substituído pelo Industry nessa migração e removido do monorepo.

## Tecnologias

| Camada                | Tecnologia                                                |
| --------------------- | --------------------------------------------------------- |
| Monorepo              | Turborepo + Yarn Workspaces v1                            |
| Framework (web)       | Next.js 16 (App Router)                                   |
| Framework (mobile)    | Expo SDK 54 (React Native 0.81, New Architecture)         |
| Estado (web)          | Redux Toolkit                                             |
| Estado (mobile)       | Zustand (Tickets App) / Context API (AppointMate)         |
| Backend (mobile)      | Firebase Auth + Firestore                                 |
| Design System         | `@industry/web` / `@industry/mobile` + `@industry/tokens` |
| Testes                | Jest + Testing Library                                    |
| Testes visuais        | Chromatic (Storybook)                                     |
| Build/Deploy (mobile) | EAS Build + EAS Submit                                    |
| Tipos                 | TypeScript 5.9 (strict)                                   |
| Lint / Formato        | ESLint + Prettier                                         |

## Contribuindo

Pull requests são bem-vindos. Para mudanças maiores, abra uma issue primeiro.

Ao alterar pacotes do design system (`@industry/web`, `@industry/mobile` ou `@industry/tokens`), lembre-se de criar um changeset:

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
[expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[expo-url]: https://expo.dev
[reactnative-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[reactnative-url]: https://reactnative.dev
[firebase-shield]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[firebase-url]: https://firebase.google.com
