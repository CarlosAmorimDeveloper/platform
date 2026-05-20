# @repo/typescript-config

[![TypeScript][typescript-shield]][typescript-url]

Configurações TypeScript compartilhadas do monorepo `platform`. Fornece três presets prontos para uso, cobrindo projetos genéricos, aplicações Next.js e pacotes React.

## Índice

- [Construído com](#construído-com)
- [Configurações disponíveis](#configurações-disponíveis)
- [Uso](#uso)
- [Opções de compilação](#opções-de-compilação)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Construído com

[![TypeScript][typescript-shield]][typescript-url]

## Configurações disponíveis

| Arquivo              | Uso recomendado                                    |
| -------------------- | -------------------------------------------------- |
| `base.json`          | Qualquer pacote TypeScript (tokens, eslint-config) |
| `nextjs.json`        | Aplicações Next.js (`apps/web/todo-app`)           |
| `react-library.json` | Pacotes React com JSX (`@ds/web`, `@ds/mobile`)    |

## Uso

Estenda a config desejada no `tsconfig.json` do seu pacote:

### Pacote TypeScript genérico

```json
{
  "extends": "@repo/typescript-config/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### Aplicação Next.js

```json
{
  "extends": "@repo/typescript-config/nextjs.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### Pacote React (com JSX)

```json
{
  "extends": "@repo/typescript-config/react-library.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

## Opções de compilação

As opções abaixo são definidas em `base.json` e herdadas por todas as configurações:

| Opção                      | Valor                       | Descrição                                              |
| -------------------------- | --------------------------- | ------------------------------------------------------ |
| `target`                   | `ES2022`                    | Compila para ES2022                                    |
| `lib`                      | `es2022, DOM, DOM.Iterable` | Inclui tipos do DOM e ES2022                           |
| `module`                   | `NodeNext`                  | Resolução de módulos para Node.js com ESM              |
| `moduleResolution`         | `NodeNext`                  | Exige extensões explícitas nos imports                 |
| `strict`                   | `true`                      | Ativa todas as verificações estritas                   |
| `noUncheckedIndexedAccess` | `true`                      | Acesso por índice retorna `T \| undefined`             |
| `isolatedModules`          | `true`                      | Compatível com transpiladores como esbuild/swc         |
| `declaration`              | `true`                      | Gera arquivos `.d.ts`                                  |
| `declarationMap`           | `true`                      | Gera source maps para as declarações                   |
| `skipLibCheck`             | `true`                      | Ignora verificação de tipos em `.d.ts` de dependências |
| `esModuleInterop`          | `true`                      | Compatibilidade com imports de módulos CommonJS        |

### Adições de `nextjs.json`

| Opção              | Valor      | Descrição                                          |
| ------------------ | ---------- | -------------------------------------------------- |
| `module`           | `ESNext`   | Sobrescreve para ESNext (bundler do Next.js)       |
| `moduleResolution` | `Bundler`  | Resolução via bundler (sem extensões obrigatórias) |
| `jsx`              | `preserve` | Preserva JSX para o Next.js transformar            |
| `noEmit`           | `true`     | Apenas verificação de tipos, sem output            |

### Adições de `react-library.json`

| Opção | Valor       | Descrição                                 |
| ----- | ----------- | ----------------------------------------- |
| `jsx` | `react-jsx` | Transforma JSX com o runtime do React 17+ |

## Contribuindo

Consulte o [README raiz do monorepo](../../README.md) para instruções de configuração e fluxo de contribuição.

## Licença

Uso interno — repositório privado.

---

[typescript-shield]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[typescript-url]: https://www.typescriptlang.org
