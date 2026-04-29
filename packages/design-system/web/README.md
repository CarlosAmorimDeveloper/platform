# @ds/web

Pacote de componentes React do Design System. Parte do monorepo `platform`, em `packages/design-system/web`.

## Componentes

Os componentes ficam em `components/` e são exportados via:

```ts
import { Button } from "@ds/web/components/Button";
import { Input } from "@ds/web/components/Input";

// ou todos de uma vez:
import { Button, Input } from "@ds/web/components";
```

### `Button`

```tsx
<Button>Adicionar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="ghost" size="sm">Editar</Button>
<Button variant="danger" size="sm">Remover</Button>
<Button type="submit" disabled={!value}>Salvar</Button>
```

| Prop | Tipo | Padrão | Opções |
|---|---|---|---|
| `variant` | string | `"primary"` | `"primary"` `"secondary"` `"ghost"` `"danger"` |
| `size` | string | `"md"` | `"md"` `"sm"` |
| `type` | string | `"button"` | `"button"` `"submit"` `"reset"` |
| `disabled` | boolean | `false` | — |

### `Input`

```tsx
<Input placeholder="Nova tarefa…" />
<Input variant="inline" autoFocus />
<Input type="checkbox" checked={done} onChange={handleToggle} />
<Input disabled placeholder="Desativado" />
```

| Prop | Tipo | Padrão | Opções |
|---|---|---|---|
| `variant` | string | `"default"` | `"default"` `"inline"` |
| `type` | string | `"text"` | qualquer tipo nativo de `<input>` |

> Quando `type="checkbox"`, o `variant` é ignorado e o estilo de checkbox é aplicado automaticamente.

## Storybook

**Storybook publicado:** [69ec244d49e023068a441802-efkfuzwurv.chromatic.com](https://69ec244d49e023068a441802-efkfuzwurv.chromatic.com/?path=/docs/components-button--docs)

Para rodar o Storybook localmente:

```sh
# A partir da raiz do monorepo:
yarn workspace @ds/web storybook

# Ou a partir deste diretório:
yarn storybook
```

O Storybook ficará disponível em `http://localhost:6006`.

Para gerar o build estático:

```sh
yarn build-storybook
```

## Chromatic

O Chromatic é usado para testes de regressão visual. A cada mudança nos componentes, snapshots são comparados com a baseline aprovada.

**Dashboard:** https://www.chromatic.com/setup?appId=69ec244d49e023068a441802

### Configuração local

Crie um arquivo `.env` em `packages/design-system/web/` com o token do projeto:

```env
CHROMATIC_PROJECT_TOKEN=chpt_xxxxxxxxxxxx
```

> O token real está disponível no dashboard do Chromatic. Nunca commite o `.env`.

### Rodando o Chromatic

```sh
# A partir da raiz do monorepo:
yarn workspace @ds/web chromatic

# Ou a partir deste diretório:
yarn chromatic
```

### CI

Em pipelines de CI, defina `CHROMATIC_PROJECT_TOKEN` como variável de ambiente e execute:

```sh
yarn workspace @ds/web chromatic
```

O Chromatic está integrado ao GitHub e reporta os resultados diretamente nos pull requests.

## Scripts

| Comando | Descrição |
|---|---|
| `yarn storybook` | Inicia o Storybook em modo desenvolvimento |
| `yarn build-storybook` | Gera o build estático do Storybook |
| `yarn chromatic` | Executa os testes visuais no Chromatic |
| `yarn check-types` | Verificação de tipos TypeScript |
| `yarn lint` | Lint do pacote |
| `yarn generate:component` | Gera um novo componente via Turbo generator |

## Adicionando componentes

```sh
yarn generate:component
```

O generator cria a estrutura padrão (`Component.tsx`, `Component.module.scss`, `index.ts`, `Component.stories.tsx`) em `components/<Nome>/`.
