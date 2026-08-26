# @industry/web + @industry/mobile Text & Action Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `Button`, `TextField`, and `SearchField` — the first three of REB-67/REB-73's eight controls — to `@industry/web` and `@industry/mobile`, ported from the source prototype's actual reference implementation (`~/Documents/ds/components/react/controls/*.jsx`+`.d.ts`), not reverse-engineered from CSS alone.

**Architecture:** REB-67/73's scope is 8 controls total (Button, TextField, Select, Switch, Checkbox, RadioGroup, SegmentedControl, SearchField) — too large for one plan. This plan covers the three "text & action" controls; a follow-up plan covers the four structurally-similar "choice" controls (Switch/Checkbox/RadioGroup/SegmentedControl, all hidden-native-input + custom-visual), and `Select` gets its own plan since REB-73 flags it needs a fundamentally different mobile implementation (a native bottom sheet/action sheet, not an HTML `<select>` equivalent) — different enough in shape that bundling it with the other seven would make this plan's tasks uneven.

**Styling approach — a real architectural decision, not a default:** the source prototype's own components emit CSS classes (`.btn`, `.btn-primary`, etc., defined in `~/Documents/ds/styles.css` lines 160–252) that rely on `:hover`/`:active`/`:disabled`/`:has()` — none of which a React inline `style` prop can express. Rather than introducing a component stylesheet into `@industry/web` — which would be the first one in this session's work on Industry, a real precedent-setting choice affecting every future component plan (REB-68 layout, REB-69 nav, REB-70 feedback, REB-71 data) — this plan follows the pattern **already established and merged** in this exact sibling package, `@vuotto/web`: `useState`-driven hover/pressed state, computed into an inline `style` object per render (see `vuotto-web/src/components/core/Button.tsx`'s `skin()` function and `vuotto-web/src/components/forms/Input.tsx`'s `focused` state — both read directly before writing this plan). `:focus-visible` needs no per-component handling at all: `@industry/tokens`'s `base.css` already applies `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` globally (ported in REB-48), so every focusable element in this plan inherits it for free. `.seg`'s CSS `:has(input:checked)` selector (relevant to a later plan, not this one) has an even simpler React answer: the component already receives `value` as a controlled prop, so "which option is checked" is a plain equality check, no `:has()` needed.

**The `framed` prop on `Button` needs the same corner-mark rendering `Frame` already has** (`--color-text` 55%-alpha "+" marks, 11px, offset 6px). Rather than duplicate that logic, this plan extracts it from `Frame.tsx` (already merged, on both platforms) into a small internal module, `BlueprintMarks.tsx`, not exported from either package's public barrel — `Frame` and `Button` both consume it. `Card`, `AppShell`, and other future `framed`-capable components in REB-68 will reuse the same module.

**Mobile has fewer interaction states than web by nature, not by omission:** touch has no `:hover` — `@industry/mobile`'s `Button` only distinguishes default/pressed/disabled (using `Pressable`'s `onPressIn`/`onPressOut`, the direct RN equivalent of web's `onMouseDown`/`onMouseUp`), collapsing web's three-step default→hover→active/pressed progression into two steps. This is a deliberate, correct platform difference, not a partial port.

**Tech Stack:** React 19, React Native, TypeScript strict, `@industry/tokens`, the already-built `Icon` component (for `SearchField`'s search glyph).

**Spec:** `~/Documents/ds/components/react/controls/{Button,TextField,SearchField}.{jsx,d.ts}` (the literal reference implementation this plan ports — read in full before writing this plan), `~/Documents/ds/styles.css` lines 160–209 (`.btn*`, `.field*`, `.input`, `.search` — the exact CSS values these components must visually match), `~/Documents/ds/readme.md` §8.1 "Controles", §"Do"/"Don't" (44px control height, never below it). Jira REB-67 (`@industry/web` controls) and REB-73 (`@industry/mobile` controls), both subtasks of epics REB-50/REB-51 — this plan covers 3 of their combined 8 components.

## Global Constraints

- **Yarn only** — never `npm`/`pnpm`.
- **No component stylesheet.** Hover/pressed state is `useState`-driven inline styles, matching `@vuotto/web`'s established pattern exactly (see Architecture above). Do not add a `.css` file to either package as part of this plan.
- **`Button` has no `icon`/`iconAfter` prop.** This is a real difference from `@vuotto/web`'s `Button` (which has both) — the source Industry `Button.jsx`/`.d.ts` (the literal port target) has neither; `iconOnly` is a sizing/padding flag only, and the caller composes an icon into `children` directly (e.g. `<Button iconOnly><Icon name="x" /></Button>`). Do not add icon props that don't exist in the source.
- **Every control's resting height is `--control-h` (44px) / `control.height`, no exceptions** — `TextField`/`SearchField`'s single-line height and `Button`'s default (non-`sm`) height are both this value; `Button`'s only smaller variant is `size="sm"` at `--control-h-sm` (36px) / `control.heightSm`, which the source explicitly reserves for "chrome de tabela" — not used by anything in this plan, just don't shrink the default below 44/`control.height`.
- **TypeScript strict + `noUncheckedIndexedAccess: true`** — do not weaken this locally. Ramp lookups (`accentRamp['300']`, `danger['400']`, etc.) are safe literal-key accesses on precise mapped types (established pattern from prior plans) — do not route them through a loosely-typed intermediate.
- **ESLint `--max-warnings 0`** — every lint warning is build-breaking.
- **No comments that restate the code.** Only comment a non-obvious invariant. This user's standing preference is stricter than usual — when in doubt, don't write the comment.
- **`BlueprintMarks` is internal, not public API.** It is not exported from either package's `src/components/core/index.ts` or `src/index.ts` — only `Frame` and `Button` (and later `Card`) import it directly by relative path.
- **This is 3 of 8 controls.** `Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl` are deliberately out of scope — two follow-up plans.

---

## File Structure

```
packages/design-system/industry-web/src/components/core/
├── BlueprintMarks.tsx        (new — extracted from Frame.tsx)
├── Frame.tsx                 (modify — use BlueprintMarks instead of inline Corner)
├── Button.tsx                (new)
├── Button.stories.tsx        (new)
├── TextField.tsx              (new)
├── TextField.stories.tsx      (new)
├── SearchField.tsx            (new)
├── SearchField.stories.tsx    (new)
└── index.ts                   (modify)

packages/design-system/industry-mobile/src/components/core/
├── BlueprintMarks.tsx        (new — extracted from Frame.tsx)
├── Frame.tsx                 (modify — use BlueprintMarks instead of inline Corner)
├── Button.tsx                (new)
├── Button.stories.tsx        (new)
├── TextField.tsx              (new)
├── TextField.stories.tsx      (new)
├── SearchField.tsx            (new)
├── SearchField.stories.tsx    (new)
└── index.ts                   (modify)

packages/design-system/industry-web/README.md      (modify)
packages/design-system/industry-mobile/README.md   (modify)
```

---

### Task 1: Web — extract `BlueprintMarks`, implement `Button`

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/BlueprintMarks.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/Frame.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Button.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Button.stories.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/index.ts`

**Interfaces:**

- Produces: `BlueprintMarks` (internal, not exported from `index.ts`) — a component with no props that renders the four corner marks; caller is responsible for `position: relative` on its own container. `Button`/`ButtonProps`/`ButtonVariant`/`ButtonSize`, re-exported from `core/index.ts`.

- [ ] **Step 1: Extract `BlueprintMarks` from `Frame.tsx`**

`packages/design-system/industry-web/src/components/core/BlueprintMarks.tsx`:

```tsx
import type { CSSProperties } from 'react';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_POSITIONS: Record<CornerPosition, CSSProperties> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  return (
    <i
      data-frame-corner={position}
      aria-hidden="true"
      style={{
        position: 'absolute',
        width: 11,
        height: 11,
        zIndex: 1,
        color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
        pointerEvents: 'none',
        ...CORNER_POSITIONS[position],
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          background: 'currentColor',
        }}
      />
      <span
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          background: 'currentColor',
        }}
      />
    </i>
  );
}

export function BlueprintMarks() {
  return (
    <>
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </>
  );
}
```

- [ ] **Step 2: Refactor `Frame.tsx` to use `BlueprintMarks`**

Replace the entire contents of `packages/design-system/industry-web/src/components/core/Frame.tsx` with:

```tsx
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { BlueprintMarks } from './BlueprintMarks';

export interface FrameProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  as?: ElementType;
  marks?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

export function Frame({ as: Tag = 'div', marks = true, children, style, ...rest }: FrameProps) {
  return (
    <Tag
      style={{
        position: 'relative',
        border: '1px solid var(--color-divider)',
        borderRadius: 0,
        ...style,
      }}
      {...rest}
    >
      {marks ? <BlueprintMarks /> : null}
      {children}
    </Tag>
  );
}
```

This is a pure refactor — no visual or behavioral change. `Frame`'s existing consumers (the `Icons`/`Image` foundation pages, already merged) are unaffected.

- [ ] **Step 3: Write `Button`**

Source: `~/Documents/ds/components/react/controls/Button.jsx`/`.d.ts`, styles from `~/Documents/ds/styles.css` lines 161–183.

`packages/design-system/industry-web/src/components/core/Button.tsx`:

```tsx
import { useState } from 'react';
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';
import { BlueprintMarks } from './BlueprintMarks';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  framed?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

function skin(variant: ButtonVariant, hovered: boolean, pressed: boolean): CSSProperties {
  if (variant === 'primary') {
    return {
      background: pressed
        ? 'var(--color-accent-500)'
        : hovered
          ? 'var(--color-accent-300)'
          : 'var(--color-accent)',
      color: 'var(--color-bg)',
      borderColor: pressed
        ? 'var(--color-accent-500)'
        : hovered
          ? 'var(--color-accent-300)'
          : 'var(--color-accent)',
    };
  }
  if (variant === 'ghost') {
    return {
      color: 'var(--color-accent-300)',
      borderColor: 'transparent',
      background: pressed
        ? 'color-mix(in srgb, var(--color-accent) 22%, transparent)'
        : hovered
          ? 'color-mix(in srgb, var(--color-accent) 14%, transparent)'
          : 'transparent',
    };
  }
  if (variant === 'danger') {
    return {
      color: 'var(--color-danger-300)',
      borderColor: 'color-mix(in srgb, var(--color-danger) 45%, transparent)',
      background: hovered
        ? 'color-mix(in srgb, var(--color-danger) 16%, transparent)'
        : 'transparent',
    };
  }
  return {
    color: 'var(--color-text)',
    borderColor: 'var(--color-divider)',
    background: pressed
      ? 'color-mix(in srgb, var(--color-text) 14%, transparent)'
      : hovered
        ? 'color-mix(in srgb, var(--color-text) 8%, transparent)'
        : 'transparent',
  };
}

export function Button({
  variant = 'secondary',
  size = 'md',
  block,
  framed,
  iconOnly,
  disabled,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const height = size === 'sm' ? 'var(--control-h-sm)' : 'var(--control-h)';

  return (
    <button
      type="button"
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{
        position: framed ? 'relative' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        minHeight: height,
        width: iconOnly ? height : block ? '100%' : undefined,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textDecoration: 'none',
        fontFamily: 'var(--font-heading)',
        fontWeight: 'var(--font-heading-weight)',
        fontSize: size === 'sm' ? 14 : 15,
        lineHeight: 1.2,
        border: '1px solid',
        borderRadius: 0,
        padding: iconOnly ? 0 : size === 'sm' ? '0 var(--space-3)' : '0 var(--space-4)',
        opacity: disabled ? 0.45 : 1,
        transition: 'background 120ms ease, border-color 120ms ease',
        ...skin(variant, hovered && !disabled, pressed && !disabled),
        ...style,
      }}
      {...rest}
    >
      {framed ? <BlueprintMarks /> : null}
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Write the Storybook stories**

`packages/design-system/industry-web/src/components/core/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
    </div>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Button iconOnly aria-label="Fechar">
      <Icon name="x" />
    </Button>
  ),
};

export const Framed: Story = {
  render: () => (
    <Button variant="primary" framed>
      Framed
    </Button>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
    </div>
  ),
};

export const Block: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Button variant="primary" block>
        Block
      </Button>
    </div>
  ),
};
```

- [ ] **Step 5: Update the barrel export**

`packages/design-system/industry-web/src/components/core/index.ts` — add these two lines:

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
```

- [ ] **Step 6: Build and verify**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn workspace @industry/web build
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check the story registered and `Frame`'s existing stories still build (proving the `BlueprintMarks` refactor didn't break `Frame`):

```sh
grep -o '"title":"Core/Button"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Core/Button" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Core/Frame"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Core/Frame" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 7: Commit**

```sh
git add packages/design-system/industry-web
git commit -m "feat(industry-web): extract BlueprintMarks and implement Button"
```

---

### Task 2: Web — `TextField` + `SearchField`

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/TextField.tsx`
- Create: `packages/design-system/industry-web/src/components/core/TextField.stories.tsx`
- Create: `packages/design-system/industry-web/src/components/core/SearchField.tsx`
- Create: `packages/design-system/industry-web/src/components/core/SearchField.stories.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/index.ts`

**Interfaces:**

- Consumes: `Icon` from `./Icon` (already built, merged).
- Produces: `TextField`/`TextFieldProps`, `SearchField`/`SearchFieldProps`, re-exported from `core/index.ts`.

- [ ] **Step 1: Write `TextField`**

Source: `~/Documents/ds/components/react/controls/TextField.jsx`/`.d.ts`, styles from `~/Documents/ds/styles.css` lines 186–200.

`packages/design-system/industry-web/src/components/core/TextField.tsx`:

```tsx
import { useId, useState } from 'react';
import type {
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

export interface TextFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style' | 'children' | 'onFocus' | 'onBlur'
> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  multiline?: boolean;
  rows?: number;
  style?: CSSProperties;
  onFocus?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function TextField({
  label,
  hint,
  error,
  multiline,
  rows = 3,
  id,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const fid = id ?? generatedId;
  const [focused, setFocused] = useState(false);

  const fieldStyle: CSSProperties = {
    width: '100%',
    minHeight: multiline ? 104 : 'var(--control-h)',
    padding: multiline ? 'var(--space-2) var(--space-3)' : '0 var(--space-3)',
    font: 'inherit',
    fontSize: 15,
    color: 'var(--color-text)',
    caretColor: 'var(--color-accent)',
    background: 'var(--color-surface)',
    border: `1px solid ${error ? 'var(--color-danger)' : focused ? 'var(--color-accent)' : 'var(--color-divider)'}`,
    borderRadius: 0,
    resize: multiline ? 'vertical' : undefined,
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      {label ? (
        <label
          htmlFor={fid}
          style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
        >
          {label}
        </label>
      ) : null}
      {multiline ? (
        <textarea
          id={fid}
          rows={rows}
          aria-invalid={error ? 'true' : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={fieldStyle}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fid}
          aria-invalid={error ? 'true' : undefined}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={fieldStyle}
          {...rest}
        />
      )}
      {error ? (
        <span style={{ fontSize: 12, color: 'var(--color-danger-300)' }}>{error}</span>
      ) : hint ? (
        <span
          style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Write `SearchField`**

Source: `~/Documents/ds/components/react/controls/SearchField.jsx`/`.d.ts`, styles from `~/Documents/ds/styles.css` lines 190–209. The source's raw inline `<svg>` is replaced with the real `Icon` component (Lucide `search`, already built) — the source spec itself says "Use Lucide... throughout," and the raw SVG in the prototype predates this package's own `Icon` component existing.

`packages/design-system/industry-web/src/components/core/SearchField.tsx`:

```tsx
import { useState } from 'react';
import type { CSSProperties, FocusEvent, InputHTMLAttributes } from 'react';
import { Icon } from './Icon';

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style' | 'onFocus' | 'onBlur'
> {
  style?: CSSProperties;
  onFocus?: (e: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
}

export function SearchField({
  placeholder = 'Search',
  style,
  onFocus,
  onBlur,
  ...rest
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type="search"
        placeholder={placeholder}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={{
          width: '100%',
          minHeight: 'var(--control-h)',
          padding: '0 var(--space-3) 0 var(--space-8)',
          font: 'inherit',
          fontSize: 15,
          color: 'var(--color-text)',
          caretColor: 'var(--color-accent)',
          background: 'var(--color-surface)',
          border: `1px solid ${focused ? 'var(--color-accent)' : 'var(--color-divider)'}`,
          borderRadius: 0,
        }}
        {...rest}
      />
      <span
        style={{
          position: 'absolute',
          left: 'var(--space-3)',
          top: '50%',
          transform: 'translateY(-50%)',
          opacity: 0.5,
          pointerEvents: 'none',
          display: 'flex',
        }}
      >
        <Icon name="search" size="sm" />
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Write the Storybook stories**

`packages/design-system/industry-web/src/components/core/TextField.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Core/TextField',
  component: TextField,
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <TextField label="Nome" placeholder="Digite seu nome" />
    </div>
  ),
};

export const WithHint: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <TextField label="E-mail" hint="Usamos só para login" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <TextField label="E-mail" error="E-mail inválido" defaultValue="not-an-email" />
    </div>
  ),
};

export const Multiline: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <TextField label="Notas" multiline rows={4} />
    </div>
  ),
};
```

`packages/design-system/industry-web/src/components/core/SearchField.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Core/SearchField',
  component: SearchField,
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: () => (
    <div style={{ width: 280 }}>
      <SearchField />
    </div>
  ),
};
```

- [ ] **Step 4: Update the barrel export**

`packages/design-system/industry-web/src/components/core/index.ts` — add these four lines:

```ts
export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';
export { SearchField } from './SearchField';
export type { SearchFieldProps } from './SearchField';
```

- [ ] **Step 5: Build and verify**

Run:

```sh
yarn workspace @industry/web build
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check both stories registered:

```sh
grep -o '"title":"Core/TextField"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Core/TextField" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Core/SearchField"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Core/SearchField" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 6: Commit**

```sh
git add packages/design-system/industry-web
git commit -m "feat(industry-web): implement TextField and SearchField"
```

---

### Task 3: Mobile — extract `BlueprintMarks`, implement `Button`

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/BlueprintMarks.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/Frame.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Button.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Button.stories.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/index.ts`

**Interfaces:**

- Consumes: `color`, `accentRamp`, `danger`, `alpha`, `control`, `fontFamily`, `fontWeight` from `@industry/tokens`.
- Produces: `BlueprintMarks` (internal), `Button`/`ButtonProps`/`ButtonVariant`/`ButtonSize`, re-exported from `core/index.ts`.

- [ ] **Step 1: Extract `BlueprintMarks` from `Frame.tsx`**

`packages/design-system/industry-mobile/src/components/core/BlueprintMarks.tsx`:

```tsx
import { View } from 'react-native';
import type { ViewStyle } from 'react-native';
import { color, alpha } from '@industry/tokens';

type CornerPosition = 'tl' | 'tr' | 'bl' | 'br';

const CORNER_COLOR = alpha(color.text, 55);

const CORNER_POSITIONS: Record<CornerPosition, ViewStyle> = {
  tl: { top: -6, left: -6 },
  tr: { top: -6, right: -6 },
  bl: { bottom: -6, left: -6 },
  br: { bottom: -6, right: -6 },
};

function Corner({ position }: { position: CornerPosition }) {
  return (
    <View
      testID={`frame-corner-${position}`}
      pointerEvents="none"
      style={[
        { position: 'absolute', width: 11, height: 11, zIndex: 1 },
        CORNER_POSITIONS[position],
      ]}
    >
      <View
        style={{
          position: 'absolute',
          left: 5,
          top: 0,
          width: 1,
          height: '100%',
          backgroundColor: CORNER_COLOR,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 5,
          left: 0,
          width: '100%',
          height: 1,
          backgroundColor: CORNER_COLOR,
        }}
      />
    </View>
  );
}

export function BlueprintMarks() {
  return (
    <>
      <Corner position="tl" />
      <Corner position="tr" />
      <Corner position="bl" />
      <Corner position="br" />
    </>
  );
}
```

- [ ] **Step 2: Refactor `Frame.tsx` to use `BlueprintMarks`**

Replace the entire contents of `packages/design-system/industry-mobile/src/components/core/Frame.tsx` with:

```tsx
import { View } from 'react-native';
import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { color } from '@industry/tokens';
import { BlueprintMarks } from './BlueprintMarks';

export interface FrameProps {
  marks?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function Frame({ marks = true, children, style }: FrameProps) {
  return (
    <View style={[{ borderWidth: 1, borderColor: color.divider, borderRadius: 0 }, style]}>
      {marks ? <BlueprintMarks /> : null}
      {children}
    </View>
  );
}
```

This is a pure refactor. `Frame.test.tsx` (already merged, 3 tests) queries corner marks by `testID="frame-corner-{position}"`, which `BlueprintMarks` still sets identically — those tests must still pass unchanged after this step.

- [ ] **Step 3: Write `Button`**

Mobile has no `:hover` (no mouse) — only default/pressed/disabled, using `Pressable`'s `onPressIn`/`onPressOut` (the RN equivalent of web's `onMouseDown`/`onMouseUp`). This collapses web's three-step default→hover→pressed into two steps, a correct platform difference, not a partial port.

`packages/design-system/industry-mobile/src/components/core/Button.tsx`:

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import {
  color,
  accentRamp,
  danger,
  alpha,
  control,
  fontFamily,
  fontWeight,
} from '@industry/tokens';
import { BlueprintMarks } from './BlueprintMarks';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  framed?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function skin(variant: ButtonVariant, pressed: boolean): { container: ViewStyle; text: TextStyle } {
  if (variant === 'primary') {
    return {
      container: {
        backgroundColor: pressed ? accentRamp['500'] : color.accent,
        borderColor: pressed ? accentRamp['500'] : color.accent,
      },
      text: { color: color.bg },
    };
  }
  if (variant === 'ghost') {
    return {
      container: {
        backgroundColor: pressed ? alpha(color.accent, 22) : 'transparent',
        borderColor: 'transparent',
      },
      text: { color: accentRamp['300'] },
    };
  }
  if (variant === 'danger') {
    return {
      container: {
        backgroundColor: pressed ? alpha(danger['400'], 16) : 'transparent',
        borderColor: alpha(danger['400'], 45),
      },
      text: { color: danger['300'] },
    };
  }
  return {
    container: {
      backgroundColor: pressed ? alpha(color.text, 14) : 'transparent',
      borderColor: color.divider,
    },
    text: { color: color.text },
  };
}

export function Button({
  variant = 'secondary',
  size = 'md',
  block,
  framed,
  iconOnly,
  disabled,
  onPressIn,
  onPressOut,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const height = size === 'sm' ? control.heightSm : control.height;
  const { container, text } = skin(variant, pressed && !disabled);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e: GestureResponderEvent) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        {
          position: framed ? 'relative' : undefined,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: height,
          width: iconOnly ? height : block ? '100%' : undefined,
          paddingHorizontal: iconOnly ? 0 : size === 'sm' ? 12 : 16,
          borderWidth: 1,
          borderRadius: 0,
          opacity: disabled ? 0.45 : 1,
        },
        container,
        style,
      ]}
      {...rest}
    >
      {framed ? <BlueprintMarks /> : null}
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              fontFamily: fontFamily.heading,
              fontWeight: fontWeight.heading,
              fontSize: size === 'sm' ? 14 : 15,
            },
            text,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
```

- [ ] **Step 4: Write the Storybook stories**

`packages/design-system/industry-mobile/src/components/core/Button.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { Icon } from './Icon';
import { Button } from './Button';
import { color } from '@industry/tokens';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',
  component: Button,
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Variants: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </View>
  ),
};

export const Sizes: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <Button size="md">Medium</Button>
      <Button size="sm">Small</Button>
    </View>
  ),
};

export const IconOnly: Story = {
  render: () => (
    <Button iconOnly accessibilityLabel="Fechar">
      <Icon name="X" size="sm" color={color.text} />
    </Button>
  ),
};

export const Framed: Story = {
  render: () => (
    <Button variant="primary" framed>
      Framed
    </Button>
  ),
};

export const Disabled: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      <Button variant="primary" disabled>
        Primary
      </Button>
      <Button variant="secondary" disabled>
        Secondary
      </Button>
    </View>
  ),
};

export const Block: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <Button variant="primary" block>
        Block
      </Button>
    </View>
  ),
};
```

- [ ] **Step 5: Update the barrel export**

`packages/design-system/industry-mobile/src/components/core/index.ts` — add these two lines:

```ts
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
```

- [ ] **Step 6: Build and verify**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn workspace @industry/mobile build
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile test
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0, `Frame.test.tsx`'s 3 tests still pass (proving the `BlueprintMarks` refactor didn't break `Frame`; `Duotone.test.tsx`'s 2 tests also unaffected — 5/5 total). Check the story registered:

```sh
grep -o '"title":"Core/Button"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Core/Button" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match.

- [ ] **Step 7: Commit**

```sh
git add packages/design-system/industry-mobile
git commit -m "feat(industry-mobile): extract BlueprintMarks and implement Button"
```

---

### Task 4: Mobile — `TextField` + `SearchField`

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/TextField.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/TextField.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/SearchField.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/SearchField.stories.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/index.ts`

**Interfaces:**

- Consumes: `color`, `control`, `semanticColor`, `danger`, `alpha` from `@industry/tokens`; `Icon` from `./Icon` (already built, merged).
- Produces: `TextField`/`TextFieldProps`, `SearchField`/`SearchFieldProps`, re-exported from `core/index.ts`.

- [ ] **Step 1: Write `TextField`**

`packages/design-system/industry-mobile/src/components/core/TextField.tsx`:

```tsx
import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import type {
  NativeSyntheticEvent,
  StyleProp,
  TextInputFocusEventData,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import { color, control, semanticColor, danger, alpha } from '@industry/tokens';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  hint,
  error,
  multiline,
  onFocus,
  onBlur,
  style,
  ...rest
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? semanticColor.danger : focused ? color.accent : color.divider;

  return (
    <View style={[{ gap: 6 }, style]}>
      {label ? <Text style={{ fontSize: 13, color: alpha(color.text, 70) }}>{label}</Text> : null}
      <TextInput
        multiline={multiline}
        onFocus={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e: NativeSyntheticEvent<TextInputFocusEventData>) => {
          setFocused(false);
          onBlur?.(e);
        }}
        placeholderTextColor={alpha(color.text, 38)}
        selectionColor={color.accent}
        style={{
          minHeight: multiline ? 104 : control.height,
          paddingHorizontal: 12,
          paddingVertical: multiline ? 8 : 0,
          fontSize: 15,
          color: color.text,
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor,
          borderRadius: 0,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        {...rest}
      />
      {error ? (
        <Text style={{ fontSize: 12, color: danger['300'] }}>{error}</Text>
      ) : hint ? (
        <Text style={{ fontSize: 12, color: alpha(color.text, 50) }}>{hint}</Text>
      ) : null}
    </View>
  );
}
```

- [ ] **Step 2: Write `SearchField`**

`packages/design-system/industry-mobile/src/components/core/SearchField.tsx`:

```tsx
import { TextInput, View } from 'react-native';
import type { StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { color, control, alpha } from '@industry/tokens';
import { Icon } from './Icon';

export interface SearchFieldProps extends Omit<TextInputProps, 'style'> {
  style?: StyleProp<ViewStyle>;
}

export function SearchField({ placeholder = 'Search', style, ...rest }: SearchFieldProps) {
  return (
    <View style={[{ position: 'relative', justifyContent: 'center' }, style]}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={alpha(color.text, 38)}
        selectionColor={color.accent}
        style={{
          minHeight: control.height,
          paddingLeft: 40,
          paddingRight: 12,
          fontSize: 15,
          color: color.text,
          backgroundColor: color.surface,
          borderWidth: 1,
          borderColor: color.divider,
          borderRadius: 0,
        }}
        {...rest}
      />
      <View style={{ position: 'absolute', left: 12, opacity: 0.5 }} pointerEvents="none">
        <Icon name="Search" size="sm" color={color.text} />
      </View>
    </View>
  );
}
```

- [ ] **Step 3: Write the Storybook stories**

`packages/design-system/industry-mobile/src/components/core/TextField.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { TextField } from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'Core/TextField',
  component: TextField,
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="Nome" placeholder="Digite seu nome" />
    </View>
  ),
};

export const WithHint: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="E-mail" hint="Usamos só para login" />
    </View>
  ),
};

export const WithError: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="E-mail" error="E-mail inválido" defaultValue="not-an-email" />
    </View>
  ),
};

export const Multiline: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <TextField label="Notas" multiline numberOfLines={4} />
    </View>
  ),
};
```

`packages/design-system/industry-mobile/src/components/core/SearchField.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View } from 'react-native';
import { SearchField } from './SearchField';

const meta: Meta<typeof SearchField> = {
  title: 'Core/SearchField',
  component: SearchField,
};

export default meta;
type Story = StoryObj<typeof SearchField>;

export const Default: Story = {
  render: () => (
    <View style={{ width: 280 }}>
      <SearchField />
    </View>
  ),
};
```

- [ ] **Step 4: Update the barrel export**

`packages/design-system/industry-mobile/src/components/core/index.ts` — add these four lines:

```ts
export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';
export { SearchField } from './SearchField';
export type { SearchFieldProps } from './SearchField';
```

- [ ] **Step 5: Build and verify**

Run:

```sh
yarn workspace @industry/mobile build
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile test
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0, still 5/5 tests passing (`Frame` 3 + `Duotone` 2 — this task adds no new tests, matching the established precedent that `Icon`-family/simple-wrapper components are Storybook-verified, not unit-tested, in this repo). Check both stories registered:

```sh
grep -o '"title":"Core/TextField"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Core/TextField" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Core/SearchField"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Core/SearchField" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 6: Commit**

```sh
git add packages/design-system/industry-mobile
git commit -m "feat(industry-mobile): implement TextField and SearchField"
```

---

### Task 5: Update package READMEs

**Files:**

- Modify: `packages/design-system/industry-web/README.md`
- Modify: `packages/design-system/industry-mobile/README.md`

**Interfaces:**

- Consumes: the final export surface of both packages from Tasks 1–4 (documents it — must not name an export that doesn't exist).
- Produces: nothing consumed by code — terminal task.

- [ ] **Step 1: Update the web README**

`packages/design-system/industry-web/README.md` — in the "Componentes" section, after the existing `Duotone` paragraph, add:

```markdown
**`Button`** — `variant` (`primary`|`secondary`|`ghost`|`danger`, padrão `secondary` — o primário é o único preenchimento sólido, use um por tela), `size` (`md`|`sm`), `block`, `framed` (usa `BlueprintMarks`, o mesmo módulo interno do `Frame`), `iconOnly`, mais os atributos de `<button>`. Sem prop `icon`/`iconAfter` — para um botão com ícone, componha `<Icon />` diretamente como `children`. Hover/pressed são estado React (`useState`), não uma folha de estilo — o mesmo padrão já usado no `@vuotto/web`.

**`TextField`** — `label`, `hint`, `error` (substitui a dica e marca `aria-invalid`), `multiline`, `rows`, mais os atributos de `<input>`.

**`SearchField`** — mesmos atributos de `<input>`, já traz a lupa (`Icon` `search`) e o padding à esquerda.
```

Update the "Escopo" section's closing sentence — replace it with:

```markdown
`Button`, `TextField` e `SearchField` (parte do REB-67) estão prontos. Os outros 5 controles (`Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`) e os componentes de layout/navegação/feedback/dados (REB-68 a REB-71) chegam em PRs seguintes.
```

- [ ] **Step 2: Update the mobile README**

`packages/design-system/industry-mobile/README.md` — same additions, adapted:

```markdown
**`Button`** — mesma API de props do `@industry/web` (`variant`, `size`, `block`, `framed`, `iconOnly`), sem `icon`/`iconAfter`. Diferença de plataforma: só tem estado padrão/pressionado (`Pressable` `onPressIn`/`onPressOut`) — sem `:hover`, que não existe em touch.

**`TextField`** — `label`, `hint`, `error`, mais os atributos de `TextInput` (inclui `multiline` nativamente).

**`SearchField`** — mesmos atributos de `TextInput`, com a lupa (`Icon` `Search`) e padding à esquerda.
```

Update the "Escopo" section's closing sentence:

```markdown
`Button`, `TextField` e `SearchField` (parte do REB-73) estão prontos. Os outros 5 controles (`Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`) e os componentes de layout/navegação/feedback/dados (REB-74 a REB-77) chegam em PRs seguintes.
```

- [ ] **Step 3: Verify no export drift**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
cat packages/design-system/industry-web/src/components/core/index.ts
cat packages/design-system/industry-mobile/src/components/core/index.ts
```

Confirm both files now export exactly `Frame`, `Icon`, `Duotone`, `Button`, `TextField`, `SearchField` (plus their types) — matches both READMEs' updated "Componentes" sections.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/README.md packages/design-system/industry-mobile/README.md
git commit -m "docs(industry): document Button, TextField and SearchField"
```

---

## Self-Review Notes

- **Spec coverage:** 3 of REB-67/73's 8 controls (`Button`, `TextField`, `SearchField`) ported to both platforms, sourced from the literal reference implementation (`.jsx`/`.d.ts`), not reverse-engineered. `Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl` explicitly out of scope — two follow-up plans (choice controls, then `Select` alone given its distinct mobile requirement).
- **Placeholder scan:** no TBD/TODO; every step has literal file content and literal expected output.
- **Type consistency:** `BlueprintMarks` (Tasks 1 and 3) has an identical public shape (no props) on both platforms; `Frame`'s refactored implementation is behavior-preserving on both (verified via the existing `Frame.test.tsx` on mobile, and the existing `Icons`/`Image` foundation stories on web, which already consume `Frame` and are unaffected). `Button`/`ButtonProps`/`ButtonVariant`/`ButtonSize` are platform-appropriate but API-parallel between web and mobile (same prop names, same defaults, `iconOnly` on both, no `icon`/`iconAfter` on either — deliberately matching the source's exact prop surface, not vuotto's larger one). `color`/`accentRamp`/`danger`/`alpha`/`control`/`fontFamily`/`fontWeight`/`semanticColor` imports in Tasks 3–4 match `@industry/tokens`'s actual `src/native/index.ts` export names (already verified in prior plans' final reviews).
