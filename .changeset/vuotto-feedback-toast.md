---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Sistema de Toast do Vuotto Tech: `Toast`, `ToastProvider`, `useToast`, em `@vuotto/web` e `@vuotto/mobile` (REB-31).

`ToastProvider` gerencia fila e visibilidade: no máximo 3 toasts simultâneos, o excedente entra numa fila FIFO e é promovido assim que abre espaço. Cada toast visível tem seu próprio timer de auto-dismiss (4s por padrão, configurável por `duration`); pausar/retomar é preciso — o tempo restante é guardado via timestamp ao pausar (`Date.now() - startedAt`), não reinicia do zero ao retomar. `useToast()` retorna `{ show }` e lança um erro claro se chamado fora de um `ToastProvider`.

No web, a pilha renderiza dentro de uma única região `<div aria-live="polite" aria-atomic="false">` persistente (nunca desmonta, só o conteúdo dentro dela muda) via portal para `document.body` — mesmo padrão do `Dialog`. Posição inferior-direita. Pausa no hover e no foco de cada toast.

No mobile, RN não tem portal — a pilha renderiza como uma `View` absolutamente posicionada dentro da árvore do próprio `ToastProvider`, que precisa ser montado perto da raiz do app (mesma exigência prática do `SafeAreaProvider`). Posição no topo da tela (não embaixo, ao contrário do web — fora do alcance do polegar e de uma eventual `TabBar`). RN não tem hover: pausar/retomar usa toque-e-segurar (`onPressIn`/`onPressOut`), mesmo padrão do `Tooltip`.
