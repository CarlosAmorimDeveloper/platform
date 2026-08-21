---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de navegação do Vuotto Tech: `Tabs`, `Breadcrumbs`, `Stepper`, em `@vuotto/web` e `@vuotto/mobile` (REB-27).

`Tabs` ganha `role="tablist"` com roving tabindex e navegação por seta/Home/End no web (mesmo padrão do `SegmentedControl`), e `aria-controls` opcional via `TabItem.panelId` quando o consumidor renderiza um painel correspondente. Em telas estreitas a faixa de abas rola horizontalmente em vez de quebrar linha — `overflow-x: auto` com a barra de rolagem escondida no web, `ScrollView` horizontal no mobile (RN não tem `overflow-x` num `View` simples).

`Breadcrumbs` marca o item atual com `aria-current="page"` e renderiza como texto não clicável em vez de um link com `pointerEvents: none` — mais correto semanticamente que um `<a>` "falso". No mobile não existe `href`/navegação por âncora, então `Crumb` usa `onPress?: () => void` por item em vez de `href`.

`Stepper` anuncia o passo atual para leitor de tela: `role="group"`/`aria-label` no web, `accessible`/`accessibilityLabel` no mobile — texto `"Passo X de Y"` em ambos, lido quando o foco entra no componente (não usei uma região `aria-live` porque um wizard real move o foco a cada passo, o que já dispara o anúncio).
