# @repo/eslint-config

[![ESLint][eslint-shield]][eslint-url]
[![TypeScript][typescript-shield]][typescript-url]

Configurações ESLint compartilhadas do monorepo `platform`. Fornece três configurações prontas para uso com ESLint v9 (flat config), além de regras de fronteira de import compostas por quem consome.

## Índice

- [Construído com](#construído-com)
- [Configurações disponíveis](#configurações-disponíveis)
- [Uso](#uso)
- [Fronteiras de import](#fronteiras-de-import)
- [Plugins incluídos](#plugins-incluídos)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Construído com

[![ESLint][eslint-shield]][eslint-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Prettier][prettier-shield]][prettier-url]

## Configurações disponíveis

| Export                               | Arquivo             | Uso recomendado             |
| ------------------------------------ | ------------------- | --------------------------- |
| `@repo/eslint-config/base`           | `base.js`           | Qualquer pacote TypeScript  |
| `@repo/eslint-config/next-js`        | `next.js`           | Aplicações Next.js          |
| `@repo/eslint-config/react-internal` | `react-internal.js` | Pacotes React (sem Next.js) |

## Uso

### Aplicação Next.js

```js
// eslint.config.mjs
import { nextJsConfig } from '@repo/eslint-config/next-js';

export default nextJsConfig;
```

### Pacote React interno (`packages/design-system/industry/web`)

```js
// eslint.config.mjs
import { config } from '@repo/eslint-config/react-internal';

export default config;
```

### Pacote TypeScript genérico

```js
// eslint.config.mjs
import { config } from '@repo/eslint-config/base';

export default config;
```

## Fronteiras de import

`@repo/eslint-config/architecture-boundaries` exporta `domainServicesBoundaries(appSrcDir)`, que gera blocos de config (`no-restricted-imports`) aplicando a camada `domain/` → `services/` → `screens/`/`hooks/`/`components/`/`context/`/`store/`/`navigation/` documentada no `CLAUDE.md` raiz ("Clean Architecture"): `domain/` não pode importar de nenhuma camada externa, `services/` não pode importar de `screens/`/`hooks/`/etc. Usado por `appointmate`/`tickets-app`.

```js
// eslint.config.mjs (app com domain/services/screens)
import { config } from '@repo/eslint-config/react-internal';
import { domainServicesBoundaries } from '@repo/eslint-config/architecture-boundaries';

export default [...config, ...domainServicesBoundaries('src')];
```

## Plugins incluídos

- `@eslint/js` — regras base do JavaScript
- `typescript-eslint` — suporte a TypeScript
- `eslint-plugin-react` + `eslint-plugin-react-hooks` — regras React
- `@next/eslint-plugin-next` — regras específicas do Next.js
- `eslint-plugin-turbo` — regras para variáveis de ambiente do Turborepo
- `eslint-config-prettier` — desativa regras que conflitam com Prettier
- `eslint-plugin-only-warn` — converte erros em warnings (útil em desenvolvimento)

## Contribuindo

Consulte o [README raiz do monorepo](../../README.md) para instruções de configuração e fluxo de contribuição.

## Licença

Uso interno — repositório privado.

---

[eslint-shield]: https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white
[eslint-url]: https://eslint.org
[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
[prettier-shield]: https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black
[prettier-url]: https://prettier.io
