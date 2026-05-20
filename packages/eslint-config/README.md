# @repo/eslint-config

[![ESLint][eslint-shield]][eslint-url]
[![TypeScript][typescript-shield]][typescript-url]

Configurações ESLint compartilhadas do monorepo `platform`. Fornece três configurações prontas para uso com ESLint v9 (flat config).

## Índice

- [Construído com](#construído-com)
- [Configurações disponíveis](#configurações-disponíveis)
- [Uso](#uso)
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

### Aplicação Next.js (`apps/web/todo-app`)

```js
// eslint.config.mjs
import { nextConfig } from '@repo/eslint-config/next-js';

export default nextConfig;
```

### Pacote React interno (`packages/design-system/web`)

```js
// eslint.config.mjs
import { reactInternalConfig } from '@repo/eslint-config/react-internal';

export default reactInternalConfig;
```

### Pacote TypeScript genérico

```js
// eslint.config.mjs
import { baseConfig } from '@repo/eslint-config/base';

export default baseConfig;
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
