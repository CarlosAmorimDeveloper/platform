---
'@ds/mobile': patch
---

Accessibility fixes (APP-96):

- `Input`'s show/hide password icon now has an `accessibilityLabel` ("Mostrar senha"/"Ocultar senha") — previously unlabeled for screen readers.
- `Chip` now has a `hitSlop` of 4px on each side to improve its touch target.
- `Card` now accepts an `accessibilityLabel` prop, forwarded to the underlying Paper `Card`, so consumers with text-only content (e.g. a form summary card) can expose a single combined label instead of relying on fragmented child text.
