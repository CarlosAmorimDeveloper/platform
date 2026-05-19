# @ds/web: 8 novos componentes MUI — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar Select, Checkbox, Radio, Dialog, Snackbar, Card, AppBar e Menu ao pacote `@ds/web` com API própria do design system, tokens mapeados no `theme.ts`, e stories no Storybook.

**Architecture:** Thin wrappers sobre MUI seguindo o padrão de Button/Input. O `theme.ts` é atualizado para importar `@ds/tokens` em vez de valores hardcoded. Um decorator global no Storybook aplica o ThemeProvider em todas as stories.

**Tech Stack:** React 19, TypeScript 5.9, Material UI v6, `@ds/tokens`, `@mui/icons-material`, Storybook 8

---

## Arquivos que serão criados ou modificados

| Arquivo | Ação |
|---|---|
| `packages/design-system/web/package.json` | Modificar — adicionar `@mui/icons-material` |
| `packages/design-system/web/theme.ts` | Modificar — mapear `@ds/tokens` |
| `packages/design-system/web/.storybook/preview.tsx` | Criar — substitui `preview.ts` com ThemeProvider decorator |
| `packages/design-system/web/.storybook/preview.ts` | Deletar |
| `packages/design-system/web/components/index.ts` | Modificar — adicionar 8 exports |
| `packages/design-system/web/components/Select/Select.tsx` | Criar |
| `packages/design-system/web/components/Select/index.ts` | Criar |
| `packages/design-system/web/components/Select/Select.stories.tsx` | Criar |
| `packages/design-system/web/components/Checkbox/Checkbox.tsx` | Criar |
| `packages/design-system/web/components/Checkbox/index.ts` | Criar |
| `packages/design-system/web/components/Checkbox/Checkbox.stories.tsx` | Criar |
| `packages/design-system/web/components/Radio/Radio.tsx` | Criar |
| `packages/design-system/web/components/Radio/index.ts` | Criar |
| `packages/design-system/web/components/Radio/Radio.stories.tsx` | Criar |
| `packages/design-system/web/components/Dialog/Dialog.tsx` | Criar |
| `packages/design-system/web/components/Dialog/index.ts` | Criar |
| `packages/design-system/web/components/Dialog/Dialog.stories.tsx` | Criar |
| `packages/design-system/web/components/Snackbar/Snackbar.tsx` | Criar |
| `packages/design-system/web/components/Snackbar/index.ts` | Criar |
| `packages/design-system/web/components/Snackbar/Snackbar.stories.tsx` | Criar |
| `packages/design-system/web/components/Card/Card.tsx` | Criar |
| `packages/design-system/web/components/Card/index.ts` | Criar |
| `packages/design-system/web/components/Card/Card.stories.tsx` | Criar |
| `packages/design-system/web/components/AppBar/AppBar.tsx` | Criar |
| `packages/design-system/web/components/AppBar/index.ts` | Criar |
| `packages/design-system/web/components/AppBar/AppBar.stories.tsx` | Criar |
| `packages/design-system/web/components/Menu/Menu.tsx` | Criar |
| `packages/design-system/web/components/Menu/index.ts` | Criar |
| `packages/design-system/web/components/Menu/Menu.stories.tsx` | Criar |

---

## Task 1: Setup — feature branch e dependência

**Files:**
- Modify: `packages/design-system/web/package.json`

- [ ] **Criar feature branch**

```bash
git checkout -b feat/ds-web-mui-components
```

- [ ] **Adicionar `@mui/icons-material` ao package.json de `@ds/web`**

Abrir `packages/design-system/web/package.json` e adicionar na seção `dependencies`:

```json
"@mui/icons-material": "^6"
```

O bloco `dependencies` ficará:

```json
"dependencies": {
  "@ds/tokens": "*",
  "@emotion/react": "^11",
  "@emotion/styled": "^11",
  "@mui/icons-material": "^6",
  "@mui/material": "^6",
  "react": "^19.2.0",
  "react-dom": "^19.2.0"
}
```

- [ ] **Instalar dependências**

```bash
yarn install
```

Esperado: sem erros, `@mui/icons-material` aparece em `node_modules`.

- [ ] **Commit**

```bash
git add packages/design-system/web/package.json yarn.lock
git commit -m "feat(ds-web): add @mui/icons-material dependency"
```

---

## Task 2: Atualizar `theme.ts` com `@ds/tokens`

**Files:**
- Modify: `packages/design-system/web/theme.ts`

- [ ] **Substituir o conteúdo de `theme.ts`**

```ts
import { createTheme } from "@mui/material/styles";
import { colors, radii } from "@ds/tokens";

export const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary[600],
      light: colors.primary[400],
      dark: colors.primary[800],
      contrastText: colors.neutral[0],
    },
    error: {
      main: colors.error[500],
    },
    success: {
      main: colors.success[500],
    },
    warning: {
      main: colors.warning[500],
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[500],
    },
    divider: colors.neutral[200],
    background: {
      default: colors.neutral[50],
      paper: colors.neutral[0],
    },
  },
  typography: {
    fontFamily: "inherit",
    fontSize: 14,
  },
  shape: {
    borderRadius: radii.lg,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiOutlinedInput: {
      defaultProps: {
        notched: false,
      },
    },
    MuiInputLabel: {
      defaultProps: {
        shrink: true,
      },
    },
  },
});
```

- [ ] **Commit**

```bash
git add packages/design-system/web/theme.ts
git commit -m "feat(ds-web): map @ds/tokens to MUI theme"
```

---

## Task 3: Adicionar ThemeProvider ao Storybook

**Files:**
- Create: `packages/design-system/web/.storybook/preview.tsx`
- Delete: `packages/design-system/web/.storybook/preview.ts`

O Storybook precisa do `ThemeProvider` para que os componentes renderizem com as cores e forma do tema.

- [ ] **Deletar `preview.ts`**

```bash
rm packages/design-system/web/.storybook/preview.ts
```

- [ ] **Criar `packages/design-system/web/.storybook/preview.tsx`**

```tsx
import type { Preview, Decorator } from "@storybook/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../theme";
import "../styles/globals.css";

const withTheme: Decorator = (Story) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <Story />
  </ThemeProvider>
);

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
```

- [ ] **Verificar que o Storybook compila**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros de tipo.

- [ ] **Commit**

```bash
git add packages/design-system/web/.storybook/
git commit -m "feat(ds-web): wrap Storybook stories with ThemeProvider"
```

---

## Task 4: Componente `Select`

**Files:**
- Create: `packages/design-system/web/components/Select/Select.tsx`
- Create: `packages/design-system/web/components/Select/index.ts`
- Create: `packages/design-system/web/components/Select/Select.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Select/Select.tsx`**

```tsx
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error = false,
  helperText,
  fullWidth = false,
  sx,
}: SelectProps) {
  const labelId = `select-label-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} error={error} sx={sx}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect labelId={labelId} value={value} label={label} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Select/index.ts`**

```ts
export { Select } from "./Select";
```

- [ ] **Criar `packages/design-system/web/components/Select/Select.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

const OPTIONS = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "pendente", label: "Pendente" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    fullWidth: { control: "boolean" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("ativo");
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Status", options: OPTIONS },
};

export const WithError: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Status", options: OPTIONS, error: true, helperText: "Campo obrigatório" },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState("ativo");
    return <Select {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Status", options: OPTIONS, disabled: true },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Select/
git commit -m "feat(ds-web): add Select component"
```

---

## Task 5: Componente `Checkbox`

**Files:**
- Create: `packages/design-system/web/components/Checkbox/Checkbox.tsx`
- Create: `packages/design-system/web/components/Checkbox/index.ts`
- Create: `packages/design-system/web/components/Checkbox/Checkbox.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Checkbox/Checkbox.tsx`**

```tsx
import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  sx?: SxProps<Theme>;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  sx,
}: CheckboxProps) {
  return (
    <FormControlLabel
      sx={sx}
      label={label}
      control={
        <MuiCheckbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      }
    />
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Checkbox/index.ts`**

```ts
export { Checkbox } from "./Checkbox";
```

- [ ] **Criar `packages/design-system/web/components/Checkbox/Checkbox.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Components/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: "Aceito os termos" },
};

export const Checked: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: "Aceito os termos" },
};

export const Indeterminate: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: "Selecionar todos", indeterminate: true },
};

export const Disabled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
  args: { label: "Opção desativada", disabled: true },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Checkbox/
git commit -m "feat(ds-web): add Checkbox component"
```

---

## Task 6: Componente `Radio`

**Files:**
- Create: `packages/design-system/web/components/Radio/Radio.tsx`
- Create: `packages/design-system/web/components/Radio/index.ts`
- Create: `packages/design-system/web/components/Radio/Radio.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Radio/Radio.tsx`**

```tsx
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  row?: boolean;
  sx?: SxProps<Theme>;
}

export function Radio({
  label,
  value,
  onChange,
  options,
  disabled = false,
  row = false,
  sx,
}: RadioProps) {
  return (
    <FormControl disabled={disabled} sx={sx}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup value={value} row={row} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={option.label}
            control={<MuiRadio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Radio/index.ts`**

```ts
export { Radio } from "./Radio";
```

- [ ] **Criar `packages/design-system/web/components/Radio/Radio.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Radio } from "./Radio";

const OPTIONS = [
  { value: "email", label: "E-mail" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
];

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    row: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("email");
    return <Radio {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Notificações", options: OPTIONS },
};

export const Row: Story = {
  render: (args) => {
    const [value, setValue] = useState("email");
    return <Radio {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Notificações", options: OPTIONS, row: true },
};

export const Disabled: Story = {
  render: (args) => {
    const [value, setValue] = useState("email");
    return <Radio {...args} value={value} onChange={setValue} />;
  },
  args: { label: "Notificações", options: OPTIONS, disabled: true },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Radio/
git commit -m "feat(ds-web): add Radio component"
```

---

## Task 7: Componente `Dialog`

**Files:**
- Create: `packages/design-system/web/components/Dialog/Dialog.tsx`
- Create: `packages/design-system/web/components/Dialog/index.ts`
- Create: `packages/design-system/web/components/Dialog/Dialog.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Dialog/Dialog.tsx`**

```tsx
import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  sx?: SxProps<Theme>;
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  sx,
}: DialogProps) {
  return (
    <MuiDialog open={open} onClose={onClose} sx={sx}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color={destructive ? "error" : "primary"}
            variant="contained"
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Dialog/index.ts`**

```ts
export { Dialog } from "./Dialog";
```

- [ ] **Criar `packages/design-system/web/components/Dialog/Dialog.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Dialog } from "./Dialog";

const meta: Meta<typeof Dialog> = {
  title: "Components/Dialog",
  component: Dialog,
  tags: ["autodocs"],
  argTypes: {
    destructive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Abrir dialog</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: "Confirmar ação",
    children: "Tem certeza que deseja continuar? Esta ação não pode ser desfeita.",
    confirmLabel: "Confirmar",
    cancelLabel: "Cancelar",
  },
};

export const Destructive: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" color="error" onClick={() => setOpen(true)}>Deletar item</Button>
        <Dialog
          {...args}
          open={open}
          onClose={() => setOpen(false)}
          onConfirm={() => setOpen(false)}
        />
      </>
    );
  },
  args: {
    title: "Deletar item",
    children: "Esta ação é permanente. O item será removido e não poderá ser recuperado.",
    confirmLabel: "Deletar",
    cancelLabel: "Cancelar",
    destructive: true,
  },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Dialog/
git commit -m "feat(ds-web): add Dialog component"
```

---

## Task 8: Componente `Snackbar`

**Files:**
- Create: `packages/design-system/web/components/Snackbar/Snackbar.tsx`
- Create: `packages/design-system/web/components/Snackbar/index.ts`
- Create: `packages/design-system/web/components/Snackbar/Snackbar.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Snackbar/Snackbar.tsx`**

```tsx
import { Alert, Snackbar as MuiSnackbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: Severity;
  onClose: () => void;
  duration?: number;
  sx?: SxProps<Theme>;
}

export function Snackbar({
  open,
  message,
  severity = "info",
  onClose,
  duration = 6000,
  sx,
}: SnackbarProps) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={(_e, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={sx}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Snackbar/index.ts`**

```ts
export { Snackbar } from "./Snackbar";
```

- [ ] **Criar `packages/design-system/web/components/Snackbar/Snackbar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Snackbar } from "./Snackbar";

const meta: Meta<typeof Snackbar> = {
  title: "Components/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "radio",
      options: ["success", "error", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Mostrar notificação</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: { message: "Operação realizada com sucesso!", severity: "success" },
};

export const Error: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Mostrar erro</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: { message: "Ocorreu um erro. Tente novamente.", severity: "error" },
};

export const Warning: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Mostrar aviso</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: { message: "Atenção: esta ação afeta outros registros.", severity: "warning" },
};

export const Info: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="outlined" onClick={() => setOpen(true)}>Mostrar info</Button>
        <Snackbar {...args} open={open} onClose={() => setOpen(false)} />
      </>
    );
  },
  args: { message: "Atualização disponível. Recarregue a página.", severity: "info" },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Snackbar/
git commit -m "feat(ds-web): add Snackbar component"
```

---

## Task 9: Componente `Card`

**Files:**
- Create: `packages/design-system/web/components/Card/Card.tsx`
- Create: `packages/design-system/web/components/Card/index.ts`
- Create: `packages/design-system/web/components/Card/Card.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Card/Card.tsx`**

```tsx
import {
  Card as MuiCard,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  actions?: ReactNode;
  media?: { src: string; alt: string; height?: number };
  sx?: SxProps<Theme>;
}

export function Card({ title, subtitle, children, actions, media, sx }: CardProps) {
  return (
    <MuiCard sx={sx}>
      {(title || subtitle) && <CardHeader title={title} subheader={subtitle} />}
      {media && (
        <CardMedia
          component="img"
          height={media.height ?? 194}
          image={media.src}
          alt={media.alt}
        />
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
    </MuiCard>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Card/index.ts`**

```ts
export { Card } from "./Card";
```

- [ ] **Criar `packages/design-system/web/components/Card/Card.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button, Typography } from "@mui/material";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Título do card",
    subtitle: "Subtítulo opcional",
    children: (
      <Typography variant="body2" color="text.secondary">
        Conteúdo do card. Pode conter texto, listas ou qualquer elemento React.
      </Typography>
    ),
  },
};

export const WithActions: Story = {
  args: {
    title: "Card com ações",
    subtitle: "Última atualização: hoje",
    children: (
      <Typography variant="body2" color="text.secondary">
        Este card possui botões de ação na parte inferior.
      </Typography>
    ),
    actions: (
      <>
        <Button size="small">Ver mais</Button>
        <Button size="small" color="error">Remover</Button>
      </>
    ),
  },
};

export const WithMedia: Story = {
  args: {
    title: "Card com imagem",
    subtitle: "Foto de capa",
    media: {
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      alt: "Montanha ao amanhecer",
      height: 160,
    },
    children: (
      <Typography variant="body2" color="text.secondary">
        Card com imagem de capa exibida acima do conteúdo.
      </Typography>
    ),
  },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Card/
git commit -m "feat(ds-web): add Card component"
```

---

## Task 10: Componente `AppBar`

**Files:**
- Create: `packages/design-system/web/components/AppBar/AppBar.tsx`
- Create: `packages/design-system/web/components/AppBar/index.ts`
- Create: `packages/design-system/web/components/AppBar/AppBar.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/AppBar/AppBar.tsx`**

```tsx
import {
  AppBar as MuiAppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface AppBarProps {
  title: string;
  onMenuClick?: () => void;
  actions?: ReactNode;
  position?: "static" | "sticky" | "fixed";
  sx?: SxProps<Theme>;
}

export function AppBar({
  title,
  onMenuClick,
  actions,
  position = "static",
  sx,
}: AppBarProps) {
  return (
    <MuiAppBar position={position} sx={sx}>
      <Toolbar>
        {onMenuClick && (
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        {actions && <Box>{actions}</Box>}
      </Toolbar>
    </MuiAppBar>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/AppBar/index.ts`**

```ts
export { AppBar } from "./AppBar";
```

- [ ] **Criar `packages/design-system/web/components/AppBar/AppBar.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@mui/material";
import { AppBar } from "./AppBar";

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "radio",
      options: ["static", "sticky", "fixed"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Minha Aplicação" },
};

export const WithMenuButton: Story = {
  args: {
    title: "Dashboard",
    onMenuClick: () => alert("Menu clicado"),
  },
};

export const WithActions: Story = {
  args: {
    title: "Dashboard",
    onMenuClick: () => alert("Menu clicado"),
    actions: (
      <Button color="inherit" variant="outlined" size="small" sx={{ borderColor: "rgba(255,255,255,0.5)" }}>
        Login
      </Button>
    ),
  },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/AppBar/
git commit -m "feat(ds-web): add AppBar component"
```

---

## Task 11: Componente `Menu`

**Files:**
- Create: `packages/design-system/web/components/Menu/Menu.tsx`
- Create: `packages/design-system/web/components/Menu/index.ts`
- Create: `packages/design-system/web/components/Menu/Menu.stories.tsx`

- [ ] **Criar `packages/design-system/web/components/Menu/Menu.tsx`**

```tsx
import React from "react";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface MenuItemConfig {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  dividerAfter?: boolean;
}

interface MenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItemConfig[];
  sx?: SxProps<Theme>;
}

export function Menu({ anchorEl, open, onClose, items, sx }: MenuProps) {
  return (
    <MuiMenu anchorEl={anchorEl} open={open} onClose={onClose} sx={sx}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <MuiMenuItem
            disabled={item.disabled}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MuiMenuItem>
          {item.dividerAfter && <Divider />}
        </React.Fragment>
      ))}
    </MuiMenu>
  );
}
```

- [ ] **Criar `packages/design-system/web/components/Menu/index.ts`**

```ts
export { Menu } from "./Menu";
```

- [ ] **Criar `packages/design-system/web/components/Menu/Menu.stories.tsx`**

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Menu } from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    return (
      <>
        <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
          Abrir menu
        </Button>
        <Menu
          {...args}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        />
      </>
    );
  },
  args: {
    items: [
      { label: "Editar", onClick: () => alert("Editar"), icon: <EditIcon fontSize="small" /> },
      { label: "Copiar", onClick: () => alert("Copiar"), icon: <ContentCopyIcon fontSize="small" />, dividerAfter: true },
      { label: "Excluir", onClick: () => alert("Excluir"), icon: <DeleteIcon fontSize="small" /> },
    ],
  },
};

export const WithDisabledItem: Story = {
  render: (args) => {
    const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
    return (
      <>
        <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
          Abrir menu
        </Button>
        <Menu
          {...args}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        />
      </>
    );
  },
  args: {
    items: [
      { label: "Editar", onClick: () => alert("Editar"), icon: <EditIcon fontSize="small" /> },
      { label: "Publicar", onClick: () => alert("Publicar"), disabled: true },
      { label: "Excluir", onClick: () => alert("Excluir"), icon: <DeleteIcon fontSize="small" /> },
    ],
  },
};
```

- [ ] **Verificar tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/Menu/
git commit -m "feat(ds-web): add Menu component"
```

---

## Task 12: Atualizar `components/index.ts` e verificação final

**Files:**
- Modify: `packages/design-system/web/components/index.ts`

- [ ] **Substituir o conteúdo de `packages/design-system/web/components/index.ts`**

```ts
export { AppBar }  from "./AppBar";
export { Button }  from "./Button";
export { Card }    from "./Card";
export { Checkbox } from "./Checkbox";
export { Dialog }  from "./Dialog";
export { Input }   from "./Input";
export { Menu }    from "./Menu";
export { Radio }   from "./Radio";
export { Select }  from "./Select";
export { Snackbar } from "./Snackbar";
```

- [ ] **Verificação final de tipos**

```bash
cd packages/design-system/web && yarn check-types
```

Esperado: sem erros.

- [ ] **Commit**

```bash
git add packages/design-system/web/components/index.ts
git commit -m "feat(ds-web): export all new components from index"
```

---

## Task 13: Push e Pull Request

- [ ] **Push da branch**

```bash
git push -u origin feat/ds-web-mui-components
```

- [ ] **Criar PR**

```bash
gh pr create \
  --title "feat(ds-web): add Select, Checkbox, Radio, Dialog, Snackbar, Card, AppBar, Menu" \
  --body "$(cat <<'EOF'
## Summary

- Adiciona 8 novos componentes MUI ao \`@ds/web\`: Select, Checkbox, Radio, Dialog, Snackbar, Card, AppBar, Menu
- Atualiza \`theme.ts\` para usar \`@ds/tokens\` em vez de valores hardcoded
- Adiciona ThemeProvider ao Storybook via decorator global
- Cada componente expõe API própria do design system (thin wrapper sobre MUI)

## Test plan

- [ ] \`yarn workspace @ds/web check-types\` sem erros
- [ ] \`yarn workspace @ds/web storybook\` inicia sem erros em :6006
- [ ] Todos os 8 componentes aparecem no Storybook com stories funcionando
- [ ] ThemeProvider aplica as cores de \`@ds/tokens\` em todas as stories

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```
