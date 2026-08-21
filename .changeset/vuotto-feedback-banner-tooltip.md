---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de feedback do Vuotto Tech: `Banner`, `Tooltip`, em `@vuotto/web` e `@vuotto/mobile` (REB-29).

`Banner` usa `role="status"` normalmente e `role="alert"` quando `tone="danger"` (`accessibilityLiveRegion="polite"`/`"assertive"` equivalente no mobile).

`Tooltip` abre por hover e por foco e fecha com Escape no web; liga `aria-describedby` ao filho via `cloneElement` (mesmo padrão do `Field`); reposiciona quando não cabe no viewport medindo `getBoundingClientRect` num `useLayoutEffect` e invertendo o lado quando ultrapassa a borda. No mobile, RN não tem hover nem tecla Escape: long-press substitui o hover (soltar o toque já fecha, cobrindo o mesmo papel de dismiss que Escape tem no web), e o reposicionamento é aproximado — mede a posição do _trigger_ via `measureInWindow` contra os limites da janela (a tooltip em si ainda não foi renderizada nesse ponto, diferente do measure-then-flip de duas passadas do web). RN também não suporta `transform` percentual (`translate(-50%)`), então a tooltip mobile alinha pela borda mais próxima do trigger em vez de centralizar.

O `ChartTooltip` interno usado pelos gráficos (`LineChart`/`BarChart`) e o atributo `title` nativo do modo `collapsed` do `SideNav` foram construídos como placeholders explícitos "até o `Tooltip` existir" (REB-26 e REB-28). Agora existe, mas trocá-los por ele é um polimento opcional fora do escopo deste ticket — ambos continuam como estão.
