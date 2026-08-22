# AppointMate

[![Expo][expo-shield]][expo-url]
[![React Native][reactnative-shield]][reactnative-url]
[![Firebase][firebase-shield]][firebase-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

App Expo / React Native para preparar consultas de acompanhamento de saúde mental: registra humor, sono, energia, apetite, concentração, medicação e dúvidas entre uma consulta e outra, e exporta tudo em PDF para levar (ou enviar) ao profissional de saúde. Parte do monorepo `platform`, em `apps/mobile/appointmate`.

## Índice

- [Funcionalidades](#funcionalidades)
- [Construído com](#construído-com)
- [Arquitetura](#arquitetura)
- [Privacidade e LGPD](#privacidade-e-lgpd)
- [Desenvolvimento](#desenvolvimento)
- [Scripts](#scripts)
- [Testes](#testes)
- [Build e deploy](#build-e-deploy)
- [Estrutura](#estrutura)
- [Tecnologias](#tecnologias)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Funcionalidades

- **Autenticação** — login, cadastro e recuperação de senha via Firebase Auth.
- **Registro estruturado entre consultas** — formulário com humor geral (escala de 5 pontos), sono, energia, apetite, concentração, lista de medicações e adesão, o que melhorou, o que tem sido difícil, contexto e perguntas para a próxima consulta.
- **Rascunho e envio** — um registro pode ficar em `draft` (editável a qualquer momento) até ser marcado como `submitted`.
- **Exportação em PDF** — gera um PDF formatado do registro (`expo-print`) e compartilha localmente (`expo-sharing`) — sem upload para nenhum servidor além do Firestore do próprio app.
- **Histórico filtrável por período** — tela inicial lista os registros anteriores com filtro por data.

## Construído com

[![Expo][expo-shield]][expo-url]
[![React Native][reactnative-shield]][reactnative-url]
[![Firebase][firebase-shield]][firebase-url]
[![React Hook Form][rhf-shield]][rhf-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Jest][jest-shield]][jest-url]

## Arquitetura

Clean Architecture, com dependências sempre apontando para dentro:

```
src/
├── domain/          # form.ts, pdf.ts, timeFilter.ts — regras puras, testáveis sem mocks
├── services/          # authService, formsService — única camada que fala com Firebase
├── context/            # AuthContext — estado de autenticação global
├── screens/             # Login, Register, Home, FormEntry, FormDetail…
├── navigation/            # AuthStack, AppStack
├── hooks/                  # ligam screens a services/domain
└── utils/                    # validation, firebaseErrors
```

Validação e formatação de dados de formulário vivem em `domain/` (`isDateOnOrAfterToday`, `formatDateInput` etc.), nunca inline nas telas; as regras do `Controller` do `react-hook-form` chamam essas funções puras.

## Privacidade e LGPD

O app trata **dado sensível de saúde** (Lei 13.709/2018, Art. 5º II) — humor, sono, medicação, notas clínicas em texto livre. Medidas em vigor:

- **Isolamento por usuário no próprio banco**: as Firestore Security Rules (`firestore.rules`) exigem `resource.data.userId == request.auth.uid` em toda leitura/escrita/exclusão — inclusive em queries de listagem, não só em leitura de documento único.
- **Allow-list de campos** (`hasOnly([...])`) em `create`/`update` — nenhum campo fora do schema declarado do formulário é aceito pelo Firestore, mesmo que o cliente tente enviar.
- **Sem SDK de analytics/crash-reporting/telemetria** — nenhum dado do app trafega para um terceiro além do Firebase do próprio projeto.
- **Sem log de conteúdo de formulário** — nenhum campo de `FormValues` ou documento de `forms` é logado, nem em desenvolvimento.
- **Exportação local, sem upload** — o PDF gerado é compartilhado via o menu nativo do sistema; não existe envio automático por e-mail ou sincronização com outro serviço.

## Desenvolvimento

```sh
# a partir da raiz do monorepo
yarn workspace @app/appointmate start
# ou diretamente:
cd apps/mobile/appointmate
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

Jest + Testing Library cobrindo `domain/` (sem mocks — funções puras), `services/` (Firebase mockado) e as telas principais. Rodam em CI a cada PR que toca `apps/mobile/**` (ver `.github/workflows/mobile-apps.yml`).

## Build e deploy

Builds gerenciados pelo [EAS Build](https://docs.expo.dev/build/introduction/) (`eas.json`), com credenciais de assinatura gerenciadas remotamente pela Expo (`credentialsSource: "remote"`) — nenhuma chave de assinatura fica no repositório. Ainda não publicado (`versionCode: 1`, sem submit até o momento).

```sh
eas build --platform android --profile production
eas submit --platform android
```

## Estrutura

```
apps/mobile/appointmate/
├── src/
│   ├── domain/        # form.ts, pdf.ts, timeFilter.ts
│   ├── services/        # authService, formsService
│   ├── context/           # AuthContext
│   ├── screens/            # Login, Register, Home, FormEntry, FormDetail…
│   └── navigation/           # AuthStack, AppStack
├── firestore.rules
├── eas.json
└── app.json
```

## Tecnologias

| Camada       | Tecnologia                                        |
| ------------ | ------------------------------------------------- |
| Framework    | Expo SDK 54 (React Native 0.81, New Architecture) |
| UI           | React 19 + `@vuotto/mobile` / `@vuotto/tokens`    |
| Navegação    | React Navigation (native-stack)                   |
| Formulários  | React Hook Form                                   |
| Backend      | Firebase Auth + Firestore                         |
| Exportação   | expo-print + expo-sharing                         |
| Testes       | Jest + Testing Library + Firestore emulator       |
| Build/Deploy | EAS Build + EAS Submit                            |
| Tipos        | TypeScript 5.9 (strict)                           |

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
[rhf-shield]: https://img.shields.io/badge/React_Hook_Form-EC5990?style=for-the-badge&logo=reacthookform&logoColor=white
[rhf-url]: https://react-hook-form.com
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[jest-shield]: https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=jest&logoColor=white
[jest-url]: https://jestjs.io
