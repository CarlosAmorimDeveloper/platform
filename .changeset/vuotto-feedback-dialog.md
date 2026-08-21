---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componente `Dialog` do Vuotto Tech em `@vuotto/web` e `@vuotto/mobile` (REB-30).

O protótipo era `position: absolute`, pensado para ser montado dentro de um container já posicionado da tela — não se sustenta como componente de verdade (ficaria empilhado sob qualquer ancestral `position: relative` que existisse por acaso). No web, `Dialog` agora renderiza num portal real via `createPortal` para `document.body`.

Extraí a lógica de focus trap do `SideNav` (usada na gaveta abaixo de 900px) para um hook compartilhado, `useFocusTrap` (`packages/design-system/vuotto-web/src/hooks/useFocusTrap.ts`), e refatorei o `SideNav` para usá-lo também em vez de duplicar a lógica — os dois precisavam exatamente do mesmo comportamento de overlay-com-foco-preso. O hook cobre: prender Tab dentro do container, Escape fecha, foco volta ao elemento que abriu ao fechar, e bloqueio de rolagem do fundo **sem salto de layout** (mede a largura da scrollbar via `window.innerWidth - document.documentElement.clientWidth` e compensa com `padding-right` no body enquanto está aberto). Essa última parte é uma melhoria que o `SideNav` ganha de graça — a versão anterior dele só travava o scroll sem compensar a scrollbar.

`aria-labelledby`/`aria-describedby` ligados a ids gerados via `useId()` para título/descrição. Superfície sólida (`var(--surface-solid)`), não vidro — já era assim no protótipo, mantido fiel.

No mobile, o `Modal` do RN (mesmo primitivo que `Select`/`SideNav` já usam) já isola a árvore de acessibilidade e bloqueia interação com o fundo nativamente — não precisou de foco preso nem bloqueio de scroll feitos à mão como no web.
