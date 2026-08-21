# @vuotto/web

Componentes web (React DOM) do design system da marca **Vuotto Tech**. Ver [`@vuotto/tokens`](../vuotto-tokens/README.md) para os tokens compartilhados com [`@vuotto/mobile`](../vuotto-mobile/README.md), e `~/Documents/rebranding` para o protótipo de referência (`.jsx` = visual, `.d.ts` = contrato de props, `.prompt.md` = regra de uso, `readme.md`/`SKILL.md` = briefing de marca).

Independente de `@ds/tokens`/`@ds/web`/`@ds/mobile` — estética e propósito diferentes (Vuotto Tech vs. os produtos existentes no monorepo).

## Instalação

```ts
import { Icon, useTheme } from '@vuotto/web';
import '@vuotto/tokens/styles.css';
```

## Build

```sh
yarn workspace @vuotto/web build
yarn workspace @vuotto/web dev  # tsup --watch
```

## Tema

`useTheme()` gerencia `data-theme` na raiz do documento (`dark` é o padrão implícito de `@vuotto/tokens`; só `light` precisa do atributo), persiste a escolha em `localStorage` e usa `prefers-color-scheme` quando não há preferência salva. Aninhar `data-theme="light"` em qualquer subárvore funciona via CSS puro (seletor de atributo) — não precisa do hook para isso, só para a raiz do app.

## Ícones

`<Icon name="arrow-right" size="sm" />` — mesma API do protótipo, mas trocando o Lucide via CDN (script + mutação de DOM) por `lucide-react/dynamic`: cada glifo é um `import()` separado, carregado sob demanda. Nenhum script de terceiros, nenhum glifo não usado entra no bundle (validado via `esbuild --splitting`: o entry point fica pequeno e cada ícone vira um chunk próprio de menos de 1KB).

Por padrão o ícone é decorativo (`aria-hidden`); passe `aria-label` quando ele sozinho carregar significado (ex.: dentro de um botão só-ícone). A contraparte mobile (`@vuotto/mobile`'s `Icon`) tem uma API parecida mas não idêntica — ver o README de lá para as diferenças de plataforma.

## Escopo desta primeira fase (REB-12 a REB-16 / VT-1 a VT-5)

Só a fundação: pacote + build, tema, ícone (tokens/fontes ficaram em `@vuotto/tokens`). Os 30 componentes do protótipo (Button, Card, Table, Dialog, etc.) e os 4 UI kits (portfolio, console, mobile, docs) são as próximas fases do backlog (REB-2 em diante).
