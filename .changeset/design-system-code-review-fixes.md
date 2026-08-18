---
'@ds/web': patch
'@ds/mobile': patch
---

Fixes from full-repo code review:

- `@ds/mobile`: `FAB` and `Card` no longer use `any` to cast the `style` prop — typed via `React.ComponentProps<typeof PaperX>['style']` instead.
- `@ds/mobile`: `AppBar`'s back/action buttons no longer carry React Native Paper's default 6px margin (same fix `IconButton` already had).
- `@ds/mobile`: `Snackbar`'s default `duration` raised from 1500ms to 6000ms, matching `@ds/web`'s `Snackbar` default.
- `@ds/mobile`: `Radio` renamed to `RadioButton` (single toggle, wraps Paper's `RadioButton`) — it modeled a different abstraction than `@ds/web`'s `Radio` (a full radio group), so the shared name implied a parity that didn't exist.
- `@ds/web`: every component now exports its `Props` type from its `index.ts` (previously only `@ds/mobile` did).
