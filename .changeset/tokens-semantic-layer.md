---
'@ds/tokens': minor
'@ds/web': patch
'@ds/mobile': patch
---

`@ds/tokens` ganha uma camada semântica (`semanticColors`, `semanticRadii`) entre os primitivos e o consumo por plataforma, além de um adaptador `@ds/tokens/platform/web` (`px()`/`rem()`). Primitivos foram movidos para `src/primitives/` mas continuam exportados no nível raiz do pacote (retrocompatível).

`@ds/web` e `@ds/mobile` migraram `theme.ts` para consumir a camada semântica nos papéis já confirmados iguais entre as plataformas (POR-74/75). Duas mudanças de valor visuais:

- `@ds/web`: `text.secondary` passa de `neutral[500]` para `neutral[600]` (alinha com o mobile).
- `@ds/web`: `shape.borderRadius` padrão passa de `radii.lg` (8) para `radii.md` (6) (alinha com o `roundness` do mobile).
