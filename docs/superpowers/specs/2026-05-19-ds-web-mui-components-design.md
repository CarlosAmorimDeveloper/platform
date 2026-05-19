# Design Spec: Novos componentes MUI para @ds/web

**Data:** 2026-05-19
**Pacote:** `packages/design-system/web`
**Status:** Aprovado — pronto para implementação

---

## Objetivo

Adicionar 8 novos componentes ao `@ds/web` seguindo o padrão já estabelecido por `Button` e `Input`: wrappers sobre MUI com API própria do design system, tema centralizado com tokens de `@ds/tokens`, e story no Storybook para cada componente.

---

## Componentes a criar

`Select`, `Checkbox`, `Radio`, `Dialog`, `Snackbar`, `Card`, `AppBar`, `Menu`

---

## Arquitetura

### Estrutura de arquivos

Cada componente segue o padrão existente:

```
packages/design-system/web/components/
├── Select/
│   ├── Select.tsx
│   ├── Select.stories.tsx
│   └── index.ts
├── Checkbox/   (idem)
├── Radio/      (idem)
├── Dialog/     (idem)
├── Snackbar/   (idem)
├── Card/       (idem)
├── AppBar/     (idem)
└── Menu/       (idem)
```

`components/index.ts` é atualizado com os novos exports.

### Abordagem

**Thin wrappers com API própria.** Nenhum consumidor importa MUI diretamente. O `theme.ts` centraliza tokens → MUI. Cada componente aceita `sx` como escape hatch opcional para ajustes pontuais.

---

## Atualização do `theme.ts`

O `theme.ts` atual tem valores hardcoded. Será atualizado para importar `@ds/tokens`:

| Slot MUI | Token |
|---|---|
| `palette.primary.main` | `colors.primary[600]` → `#4F46E5` |
| `palette.primary.light` | `colors.primary[400]` → `#818CF8` |
| `palette.primary.dark` | `colors.primary[800]` → `#3730A3` |
| `palette.primary.contrastText` | `colors.neutral[0]` → `#FFFFFF` |
| `palette.error.main` | `colors.error[500]` → `#F43F5E` |
| `palette.success.main` | `colors.success[500]` → `#22C55E` |
| `palette.warning.main` | `colors.warning[500]` → `#F59E0B` |
| `palette.text.primary` | `colors.neutral[900]` → `#111827` |
| `palette.text.secondary` | `colors.neutral[500]` → `#6B7280` |
| `palette.divider` | `colors.neutral[200]` → `#E5E7EB` |
| `palette.background.default` | `colors.neutral[50]` → `#F9FAFB` |
| `palette.background.paper` | `colors.neutral[0]` → `#FFFFFF` |
| `shape.borderRadius` | `radii.lg` → `8` |

Spacing não é mapeado diretamente (MUI usa multiplicador de base 8; tokens são valores absolutos — usar padrão MUI de `8` como base).

---

## API dos componentes

### `Select`

```tsx
interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  sx?: SxProps;
}
```

Baseado em `FormControl` + `InputLabel` + `MuiSelect` + `MenuItem`.

---

### `Checkbox`

```tsx
interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  sx?: SxProps;
}
```

Baseado em `FormControlLabel` + `MuiCheckbox`.

---

### `Radio`

```tsx
interface RadioProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
  row?: boolean;
  sx?: SxProps;
}
```

Baseado em `FormControl` + `FormLabel` + `RadioGroup` + `FormControlLabel` + `MuiRadio`.

---

### `Dialog`

```tsx
interface DialogProps {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;   // default: "Confirmar"
  cancelLabel?: string;    // default: "Cancelar"
  destructive?: boolean;   // torna o botão de confirm vermelho (color="error")
  sx?: SxProps;
}
```

Baseado em `MuiDialog` + `DialogTitle` + `DialogContent` + `DialogActions`.

---

### `Snackbar`

```tsx
type Severity = "success" | "error" | "warning" | "info";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: Severity;     // default: "info"
  onClose: () => void;
  duration?: number;       // default: 6000ms
  sx?: SxProps;
}
```

Baseado em `MuiSnackbar` + `Alert`. Posição fixa em `bottom-left`.

---

### `Card`

```tsx
interface CardProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  media?: { src: string; alt: string; height?: number };
  sx?: SxProps;
}
```

Baseado em `MuiCard` + `CardHeader` + `CardMedia` + `CardContent` + `CardActions`.

---

### `AppBar`

```tsx
interface AppBarProps {
  title: string;
  onMenuClick?: () => void;   // se fornecido, exibe ícone de menu à esquerda
  actions?: React.ReactNode;
  position?: "static" | "sticky" | "fixed";  // default: "static"
  sx?: SxProps;
}
```

Baseado em `MuiAppBar` + `Toolbar` + `Typography` + `IconButton` (MenuIcon de `@mui/icons-material`).

---

### `Menu`

```tsx
interface MenuItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  dividerAfter?: boolean;
}

interface MenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
  sx?: SxProps;
}
```

Baseado em `MuiMenu` + `MuiMenuItem` + `ListItemIcon` + `ListItemText` + `Divider`.

---

## Stories

Cada componente tem uma story file com pelo menos os estados:

| Componente | Stories mínimas |
|---|---|
| Select | `Default`, `WithError`, `Disabled` |
| Checkbox | `Default`, `Checked`, `Indeterminate`, `Disabled` |
| Radio | `Default`, `Row`, `Disabled` |
| Dialog | story com `render` + `useState` para `open`; variante `Destructive` |
| Snackbar | story com `render` + `useState`; variantes por `severity` |
| Card | `Default`, `WithMedia`, `WithActions` |
| AppBar | `Default`, `WithMenuButton`, `WithActions` |
| Menu | story com `render` + `useState` para `anchorEl` |

---

## Dependências

`@mui/icons-material` já pode estar instalado (AppBar usa `MenuIcon`). Verificar no `package.json` de `@ds/web` e adicionar se ausente.

---

## O que não muda

- `Button` e `Input` existentes — sem alterações
- `packages/design-system/tokens` — sem alterações
- Estrutura de build/Storybook — sem alterações
