---
'@vuotto/web': minor
'@vuotto/mobile': minor
---

Componentes de formulário do Vuotto Tech: `Field`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `SegmentedControl`, `FileDrop`, em `@vuotto/web` e `@vuotto/mobile`.

Web ganha reforços de acessibilidade que o protótipo de origem não tinha: `Field` gera `id` automaticamente (`useId()`) e liga `aria-invalid`/`aria-describedby` no filho; `Checkbox`'s `indeterminate` vira a propriedade real do DOM (não só visual); `SegmentedControl` ganha `role="radiogroup"`/`role="radio"` com roving tabindex e navegação por seta; `FileDrop` valida tipo/tamanho antes de `onFiles`, aceita colar (`onPaste`) e abre o seletor com Enter/Espaço. Todos os controles usam `forwardRef` e funcionam com `react-hook-form` (exemplo com `zod` em `FormExample.stories.tsx`).

Mobile reimplementa em vez de portar — RN não tem `<select>` (`Select` abre um `Modal` com lista), drag-drop/paste (`FileDrop` vira `Pressable` presentational, o app conecta seu próprio picker), nem handle de resize (`Textarea`'s `rows` vira altura fixa). `Checkbox` usa `accessibilityState.checked='mixed'` como indeterminate real; `Switch` usa o `Switch` nativo do RN em vez de reconstruir do zero.
