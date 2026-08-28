# Tickets App

[![Expo][expo-shield]][expo-url]
[![React Native][reactnative-shield]][reactnative-url]
[![Firebase][firebase-shield]][firebase-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

Sistema de tickets multi-tenant construído com [Expo](https://expo.dev) / React Native e [Firebase](https://firebase.google.com) (Auth + Firestore). Publicado na Google Play Store. Parte do monorepo `platform`, em `apps/mobile/tickets-app`.

## Índice

- [Funcionalidades](#funcionalidades)
- [Multi-tenancy e papéis](#multi-tenancy-e-papéis)
- [Construído com](#construído-com)
- [Arquitetura](#arquitetura)
- [Segurança dos dados](#segurança-dos-dados)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Testes](#testes)
- [Build e deploy](#build-e-deploy)
- [Estrutura](#estrutura)
- [Tecnologias](#tecnologias)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Funcionalidades

- **Autenticação** — login, cadastro (cria um novo workspace automaticamente) e recuperação de senha via Firebase Auth.
- **Gestão de tickets** — criação, listagem com filtros por status/prioridade, detalhe com thread de comentários, atribuição a um responsável do workspace.
- **Prioridade e status configuráveis** — 5 níveis de prioridade (`very_low` → `very_high`) e 3 estágios de status (`open`, `in_progress`, `done`), cada um com um tom de `Badge` de `@industry/mobile`.
- **Gestão de usuários (admin)** — convite de novos membros para o próprio workspace, sem exigir que o convidado já tenha conta.
- **Dashboard** — visão consolidada dos tickets do workspace com gráficos (`PieChart` de `@industry/mobile`).

## Multi-tenancy e papéis

Cada usuário pertence a exatamente um `workspace_id`. Todo dado — tickets, comentários, outros usuários — é lido e escrito sempre escopado a esse workspace; não existe consulta "global" no app. Dois papéis:

| Papel      | Pode                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| `admin`    | Convidar/editar membros do workspace, editar ou excluir qualquer ticket/comentário |
| `standard` | Criar e gerenciar os próprios tickets e comentários                                |

O primeiro usuário de um workspace (quem se registra) se torna `admin` automaticamente; os demais são adicionados por convite.

## Construído com

[![Expo][expo-shield]][expo-url]
[![React Native][reactnative-shield]][reactnative-url]
[![Firebase][firebase-shield]][firebase-url]
[![Zustand][zustand-shield]][zustand-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

## Arquitetura

Segue a Clean Architecture usada em todo o monorepo — dependências sempre apontando para dentro:

```
src/
├── domain/          # Tipos e funções puras (Ticket, User, formatDate, toTicket…) — zero React/Firebase
├── services/         # Única camada que fala com Firebase (authService, ticketService)
├── store/            # useAuthStore (Zustand) — estado de autenticação global
├── screens/           # Composição e apresentação (Login, Dashboard, TicketList, TicketDetails…)
├── hooks/             # useTicketList, useTicketDetails, useUserList — ligam screens a services
├── navigation/        # AuthStack (não autenticado) e AppStack (autenticado)
└── constants/         # ticketStatus, ticketPriority — enums + labels + cores
```

`domain/` não importa nada de `services/` ou `screens/`; `screens/` nunca chama `firebase/firestore` diretamente — sempre via `services/`.

## Segurança dos dados

As Firestore Security Rules (`firestore.rules`) impõem o isolamento por workspace no próprio banco, não só no cliente:

- Leitura e escrita de `tickets` e `comments` exigem pertencer ao `workspace_id` do documento.
- Criação de usuário via auto-registro só é aceita se o `workspace_id` informado **ainda não existir** — impede que alguém se autodeclare admin de um workspace já existente.
- Edição de perfil por um usuário comum só pode alterar o próprio `name`; qualquer outro campo (`role`, `workspace_id`) exige ser admin do mesmo workspace.
- `hasOnly([...])` em cada regra de escrita bloqueia campos não previstos no payload.

Testadas com o emulador do Firestore (`yarn test:rules`), independente da suíte principal.

## Desenvolvimento

```sh
# a partir da raiz do monorepo
yarn workspace @app/tickets start
# ou diretamente:
cd apps/mobile/tickets-app
yarn start
```

Requer um arquivo `.env` local (veja `.env.example`) com as credenciais do projeto Firebase — nunca commitado.

## Scripts

| Comando                | Descrição                                             |
| ---------------------- | ----------------------------------------------------- |
| `yarn start`           | Inicia o Metro bundler (Expo)                         |
| `yarn android` / `ios` | Abre no emulador/dispositivo Android ou iOS           |
| `yarn lint`            | ESLint (`--max-warnings 0`)                           |
| `yarn check-types`     | Verificação de tipos TypeScript                       |
| `yarn test`            | Testes com Jest                                       |
| `yarn test:rules`      | Testa as Firestore Security Rules via emulador        |
| `yarn build:android`   | Build de produção (app bundle) via EAS                |
| `yarn build:preview`   | Build de teste interno (APK) via EAS                  |
| `yarn submit:android`  | Envia o build para a Google Play Store via EAS Submit |

## Testes

```sh
yarn test
```

**192 testes** (29 suítes) com Jest + Testing Library, cobrindo `domain/`, `services/`, `store/` e todas as telas. Rodam também em CI a cada PR que toca `apps/mobile/**` (ver `.github/workflows/mobile-apps.yml`).

## Build e deploy

Builds de produção são gerenciados pelo [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json`), com credenciais de assinatura gerenciadas remotamente pela Expo (`credentialsSource: "remote"`) — nenhuma chave de assinatura fica no repositório.

```sh
eas build --platform android --profile production
eas submit --platform android
```

## Estrutura

```
apps/mobile/tickets-app/
├── src/
│   ├── domain/           # ticket.ts, user.ts
│   ├── services/          # authService, ticketService
│   ├── store/              # useAuthStore (Zustand)
│   ├── screens/             # Login, Register, Dashboard, TicketList, TicketDetails, NewTicket, CreateUser…
│   ├── navigation/           # AuthStack, AppStack
│   └── constants/             # ticketStatus, ticketPriority
├── firestore.rules
├── eas.json
└── app.json
```

## Tecnologias

| Camada        | Tecnologia                                            |
| ------------- | ----------------------------------------------------- |
| Framework     | Expo SDK 54 (React Native 0.81, New Architecture)     |
| UI            | React 19 + `@industry/mobile` / `@industry/tokens`    |
| Navegação     | React Navigation (native-stack)                       |
| Estado global | Zustand                                               |
| Backend       | Firebase Auth + Firestore                             |
| Gráficos      | `PieChart` (`@industry/mobile`, via react-native-svg) |
| Testes        | Jest + Testing Library + Firestore emulator           |
| Build/Deploy  | EAS Build + EAS Submit                                |
| Tipos         | TypeScript 5.9 (strict)                               |

## Contribuindo

Consulte o [README raiz do monorepo](../../../README.md) para instruções de configuração e fluxo de contribuição.

## Licença

Uso interno — repositório privado.

---

[expo-shield]: https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white
[expo-url]: https://expo.dev
[reactnative-shield]: https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[reactnative-url]: https://reactnative.dev
[firebase-shield]: https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black
[firebase-url]: https://firebase.google.com
[zustand-shield]: https://img.shields.io/badge/Zustand-433E38?style=for-the-badge
[zustand-url]: https://zustand-demo.pmnd.rs
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[jest-shield]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io
