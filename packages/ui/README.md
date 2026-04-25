# @repo/ui

Design System compartilhado do monorepo. Contém componentes React reutilizáveis com Storybook para desenvolvimento e Chromatic para testes visuais.

## Componentes

Os componentes ficam em `components/` e são exportados via:

```ts
import { Button } from "@repo/ui/components";
import { Input } from "@repo/ui/components/Input";
```

## Storybook

**Storybook publicado:** [69ec244d49e023068a441802-efkfuzwurv.chromatic.com](https://69ec244d49e023068a441802-efkfuzwurv.chromatic.com/?path=/docs/components-button--docs)

Para rodar o Storybook localmente:

```bash
yarn workspace @repo/ui storybook
# ou a partir de packages/ui:
node_modules/.bin/storybook dev -p 6006
```

Para gerar o build estático:

```bash
yarn workspace @repo/ui build-storybook
```

## Chromatic

O Chromatic é usado para testes de regressão visual. A cada mudança nos componentes, snapshots são comparados com a baseline aprovada.

**Storybook publicado:** https://69ec244d49e023068a441802-efkfuzwurv.chromatic.com/

**Dashboard:** https://www.chromatic.com/setup?appId=69ec244d49e023068a441802

### Configuração local

Crie um arquivo `.env` em `packages/ui/` com o token do projeto:

```env
CHROMATIC_PROJECT_TOKEN=chpt_xxxxxxxxxxxx
```

> O token real está disponível no dashboard do Chromatic. Nunca commite o `.env`.

### Rodando o Chromatic

```bash
# A partir da raiz do monorepo:
yarn workspace @repo/ui chromatic

# Ou a partir de packages/ui (requer o build do Storybook):
node_modules/.bin/storybook build --output-dir storybook-static
node_modules/.bin/chromatic --exit-zero-on-changes --storybook-build-dir=storybook-static
```

### CI

Em pipelines de CI, defina `CHROMATIC_PROJECT_TOKEN` como variável de ambiente e execute:

```bash
yarn workspace @repo/ui chromatic
```

O Chromatic está integrado ao GitHub e reporta os resultados diretamente nos pull requests.
