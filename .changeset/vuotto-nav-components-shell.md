---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de shell de navegação do Vuotto Tech: `SideNav`, `TabBar`, em `@vuotto/web` e `@vuotto/mobile` (REB-28).

`SideNav` (web) ganha um modo `collapsed` (só ícones, rótulo preservado via `title`/`aria-label` nativos do navegador — não depende do componente `Tooltip`, que ainda não existe) e vira gaveta com scrim abaixo de 900px (`useMediaQuery` interno via `window.matchMedia`). A gaveta tem um focus trap feito à mão (salva o elemento com foco, foca o primeiro elemento focável, prende Tab dentro do container, Escape fecha, foco volta ao gatilho ao fechar) — o componente `Dialog` que vai formalizar esse padrão ainda não existe (REB-30, épico de Feedback). Item ativo ganha `aria-current="page"`; não foi adicionado suporte a `href`/integração com router específico, mesma decisão já tomada no `Table` para manter o componente agnóstico de framework de roteamento.

`SideNav` (mobile) é sempre gaveta — não existe o caso "sidebar estática" que o web tem para telas largas, já que um telefone é sempre "estreito". Usa o `Modal` do RN (mesmo padrão do `Select`), que já isola a árvore de acessibilidade e trata o botão/gesto de voltar, então não precisou reimplementar um focus trap manual como no web.

`TabBar` respeita a área segura inferior: `padding-bottom: calc(10px + env(safe-area-inset-bottom))` no web, `useSafeAreaInsets()` (`react-native-safe-area-context`, adicionado como peer/dev dependency em `@vuotto/mobile` seguindo o mesmo padrão já usado em `@ds/mobile`) no mobile. O limite de 5 itens é só documentado via JSDoc, não reforçado em tipo — uma tupla de tamanho variável pioraria a ergonomia para o caso comum de um array montado dinamicamente.
