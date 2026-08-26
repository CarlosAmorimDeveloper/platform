# Industry Choice Controls Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `Switch`, `Checkbox`, `RadioGroup` and `SegmentedControl` from `~/Documents/ds/components/react/controls/` into `@industry/web` and `@industry/mobile`, completing REB-67/REB-73 except for `Select` (which needs its own plan — native bottom sheet on mobile). Also close the deferred finding from PR #99's final review: `@industry/web`'s `TextField`/`SearchField` are missing `:hover`, `:disabled`, and `::placeholder` styling present in the source spec.

**Architecture:** Same conventions as every prior Industry component: no stylesheet, all visual state computed via inline `style`/`StyleSheet` objects driven by React `useState` (hover/pressed/focused/checked), tokens consumed as CSS custom properties on web and `@industry/tokens` JS exports on mobile. Two genuinely new mechanics show up in this plan and are resolved once, up front, rather than per-task:

1. **`::placeholder` cannot be styled via inline `style` or JS** — it is a pseudo-element with no DOM hook. This is the one addition to `@industry/tokens`'s `base.css` in this plan: a single global `::placeholder` rule (not scoped to a class — this codebase doesn't use component classes, and `base.css` already carries other bare-element global defaults like `a`, `img`, `:focus-visible`). `:hover` and `:disabled` on `TextField`/`SearchField`, by contrast, **are** expressible via JS state (`useState` + `onMouseEnter`/`onMouseLeave`, and the existing `disabled` prop) exactly like `Button` already does — no CSS needed for those two.

2. **`Switch`/`Checkbox` visually depend on the native `<input>`'s `checked` state, but that `<input>` is deliberately visually hidden** (`opacity: 0`, absolutely positioned) so the design's own box/track can be drawn instead. The source HTML relies on the real `:checked` CSS pseudo-class via a sibling selector, which works for both controlled and uncontrolled inputs for free. Since this codebase has no stylesheet, that free behavior doesn't exist — so `Switch`/`Checkbox` here mirror `checked`/`defaultChecked` into local `useState`, updated `onChange`, exactly like React's own documented controlled/uncontrolled hybrid pattern. `RadioGroup`/`SegmentedControl` don't need this: the source's own `.d.ts` already makes them fully controlled (`value`/`onChange` from the parent, no `defaultValue`), so there's nothing to mirror.

**Tech Stack:** React 19, TypeScript strict, React Native 0.81.5 (`@industry/mobile`), `@industry/tokens` (CSS custom properties on web, JS token exports on mobile), Storybook 8, Jest (`@industry/mobile` only — `@industry/web` has no test infrastructure, matching `Button`/`TextField`/`SearchField`, which also ship with stories only, no `.test.tsx`).

**Spec:** `~/Documents/ds/components/react/controls/{Switch,Checkbox,RadioGroup,SegmentedControl}.{jsx,d.ts}` for props/behavior; `~/Documents/ds/styles.css` lines 193–252 for the exact visual rules (reproduced per-task below); `~/Documents/ds/DESIGN-SYSTEM.md` section 9 for the CSS-class-to-component mapping (informational only — this codebase doesn't ship those classes).

## Global Constraints

- No stylesheet / no CSS Modules / no component classes on either platform — every visual value is inline `style` (web) or a `StyleSheet`-shaped object literal (mobile), driven by `useState`. The one exception (`::placeholder` in `base.css`) is spelled out above and is the only CSS this plan adds.
- `border-radius: 0` everywhere (the whole Industry system is square-cornered) — never add a `borderRadius` other than the two cases that are already circles by design (`RadioGroup`'s dot, `Checkbox`'s check-mark corner trick doesn't apply here).
- Web components are thin wrappers around real `<input type="checkbox">` / `<input type="radio">` elements (accessibility, form semantics, keyboard operation come for free from the browser) — never replace them with a `<div role="checkbox">`-style reimplementation.
- Mobile has no native form input equivalent to reach for, so `Switch`/`Checkbox`/`RadioGroup`/`SegmentedControl` on `@industry/mobile` are built on `Pressable` with explicit `accessibilityRole`/`accessibilityState` — this mirrors how mobile `Button` already diverges from web's native `<button>`.
- Mobile prop names diverge from web on purpose where there's no synthetic-event equivalent to hand back: web keeps `onChange(e: ChangeEvent<HTMLInputElement>)` (matches the source `.d.ts` verbatim); mobile uses `onCheckedChange(checked: boolean)` for `Switch`/`Checkbox` and `onValueChange(value: string)` for `RadioGroup`/`SegmentedControl`, matching how React Native's own built-in `Switch` names its callback (`onValueChange`). This divergence gets one sentence in each mobile README, same treatment as the existing `Icon` PascalCase-vs-kebab-case and `Duotone` blend-mode-approximation notes.
- Mobile `RadioGroup`/`SegmentedControl` drop the web version's `name` prop — it's HTML form-grouping wiring with no RN equivalent (grouping is implicit: one component instance, one set of options).
- Faithfulness gap, deliberate: the source CSS defines a `:disabled` opacity dim (0.45) only for `.switch` (`.switch input:disabled + .track { opacity: 0.45; }`) and for `.input`/`.select` (text fields) — **not** for `.check`/`.radio`. Port this gap as-is: `Switch` (both platforms) dims when disabled, `Checkbox`/`RadioGroup` do not. Do not "fix" this by adding dimming the source doesn't define — if this looks wrong, it's wrong in the source too, and the fix belongs in a spec update, not a silent addition here.
- Hover, likewise: source defines `:hover` for `.radio`/`.check` (border turns accent) and for `.seg-opt` (background tint when unchecked), but **not** for `.switch`. Port exactly that split. Mobile has no hover concept at all (touch) — mobile components never track a `hovered` state, matching mobile `Button`'s existing "sem `:hover`, que não existe em touch" note.
- Every color/dimension value below is copied verbatim from `~/Documents/ds/styles.css` lines 193–252 or from `@industry/tokens` (`colors.css`, `spacing.css`, `colors.generated.ts`) — do not approximate or round a value that appears explicitly in either source.

---

### Task 1: `@industry/tokens` — add the `::placeholder` global rule

**Files:**

- Modify: `packages/design-system/industry-tokens/src/tokens/base.css`

**Interfaces:**

- Consumes: nothing new.
- Produces: a global `::placeholder` rule that `@industry/web`'s `TextField`/`SearchField` (Task 2) rely on for their placeholder color — no code change needed in those components for this to take effect, since they already render native `<input>`/`<textarea>` elements that any page importing `@industry/tokens/styles.css` will pick this up for.

- [ ] **Step 1: Add the rule**

Open `packages/design-system/industry-tokens/src/tokens/base.css`. Immediately after the `::selection` block (currently the last rule in the file), add:

```css
::placeholder {
  color: color-mix(in srgb, var(--color-text) 38%, transparent);
}
```

This is copied verbatim from the source spec's `.input::placeholder { color: color-mix(in srgb, var(--color-text) 38%, transparent); }` (`~/Documents/ds/styles.css:195`), scoped globally instead of to a `.input` class since this codebase doesn't ship that class — every text input/textarea rendered by `@industry/web` is already visually equivalent to `.input`.

- [ ] **Step 2: Verify the build picks it up**

Run: `yarn workspace @industry/tokens build`
Expected: exits 0. Then check the generated output contains the new rule:

Run: `grep -A2 '::placeholder' packages/design-system/industry-tokens/dist/tokens/base.css`
Expected: prints the 3-line rule from Step 1.

`dist/` is git-ignored (confirmed via `.gitignore`), so nothing from this step gets committed — it's verification only, source of truth is `src/tokens/base.css`.

- [ ] **Step 3: Commit**

```bash
git add packages/design-system/industry-tokens/src/tokens/base.css
git commit -m "feat(industry-tokens): add global ::placeholder rule"
```

---

### Task 2: `@industry/web` — `TextField`/`SearchField` hover + disabled polish

**Files:**

- Modify: `packages/design-system/industry-web/src/components/core/TextField.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/SearchField.tsx`

**Interfaces:**

- Consumes: the `::placeholder` rule from Task 1 (no code dependency, just needs `@industry/tokens/styles.css` imported by the consuming app, already true for every existing story).
- Produces: no interface change — `TextFieldProps`/`SearchFieldProps` are unchanged, this task only adds internal `hovered` state and a `disabled`-driven `opacity`/`cursor`.

This closes the "Important" finding parked in PR #99's final review: these two fields had `:focus`/`error` border-color logic but no `:hover` or `:disabled` treatment, even though the source spec defines both (`~/Documents/ds/styles.css:196,199`):

```css
.input:hover,
.select:hover {
  border-color: var(--color-divider-strong);
}
.input:disabled,
.select:disabled {
  opacity: 0.45;
}
```

- [ ] **Step 1: Add hover + disabled to `TextField`**

Open `packages/design-system/industry-web/src/components/core/TextField.tsx`. Replace the whole file with:

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
  disabled,
  style,
  onFocus,
  onBlur,
  ...rest
}: TextFieldProps) {
  const generatedId = useId();
  const fid = id ?? generatedId;
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const hintId = `${fid}-hint`;
  const describedBy = error || hint ? hintId : undefined;

  const borderColor = error
    ? 'var(--color-danger)'
    : focused
      ? 'var(--color-accent)'
      : hovered
        ? 'var(--color-divider-strong)'
        : 'var(--color-divider)';

  const fieldStyle: CSSProperties = {
    width: '100%',
    minHeight: multiline ? 104 : 'var(--control-h)',
    padding: multiline ? 'var(--space-2) var(--space-3)' : '0 var(--space-3)',
    font: 'inherit',
    fontSize: 15,
    color: 'var(--color-text)',
    caretColor: 'var(--color-accent)',
    background: 'var(--color-surface)',
    border: `1px solid ${borderColor}`,
    borderRadius: 0,
    resize: multiline ? 'vertical' : undefined,
    opacity: disabled ? 0.45 : 1,
    cursor: disabled ? 'not-allowed' : undefined,
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
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={fieldStyle}
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={fid}
          disabled={disabled}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={fieldStyle}
          {...rest}
        />
      )}
      {error ? (
        <span id={hintId} style={{ fontSize: 12, color: 'var(--color-danger-300)' }}>
          {error}
        </span>
      ) : hint ? (
        <span
          id={hintId}
          style={{ fontSize: 12, color: 'color-mix(in srgb, var(--color-text) 50%, transparent)' }}
        >
          {hint}
        </span>
      ) : null}
    </div>
  );
}
```

Note the precedence: `error` beats `focused` beats `hovered` beats the resting `divider` color — this matches the source's cascade order (`:disabled`/`[aria-invalid]` are independent of `:hover`/`:focus-visible` in the source, but visually error should never be masked by a hover border, and focus should still win over a lingering hover from before the field was focused).

- [ ] **Step 2: Add hover + disabled to `SearchField`**

Open `packages/design-system/industry-web/src/components/core/SearchField.tsx`. Replace the whole file with:

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
  disabled,
  style,
  onFocus,
  onBlur,
  ...rest
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const borderColor = focused
    ? 'var(--color-accent)'
    : hovered
      ? 'var(--color-divider-strong)'
      : 'var(--color-divider)';

  return (
    <div style={{ position: 'relative', ...style }}>
      <input
        type="search"
        placeholder={placeholder}
        disabled={disabled}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width: '100%',
          minHeight: 'var(--control-h)',
          padding: '0 var(--space-3) 0 var(--space-8)',
          font: 'inherit',
          fontSize: 15,
          color: 'var(--color-text)',
          caretColor: 'var(--color-accent)',
          background: 'var(--color-surface)',
          border: `1px solid ${borderColor}`,
          borderRadius: 0,
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? 'not-allowed' : undefined,
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

- [ ] **Step 3: Manual verification in Storybook**

Run: `yarn workspace @industry/web storybook`
Open `Core/TextField` and `Core/SearchField` (existing stories, unchanged by this task). Hover the field: border should lighten to `--color-divider-strong` when not focused. Tab into it: border should turn accent-colored (focus wins over hover). Type text with the field empty first: placeholder should render at ~38% text opacity, not full white.

- [ ] **Step 4: Run lint + typecheck**

Run: `yarn workspace @industry/web lint && yarn workspace @industry/web check-types`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/industry-web/src/components/core/TextField.tsx packages/design-system/industry-web/src/components/core/SearchField.tsx
git commit -m "fix(industry-web): add hover and disabled treatment to TextField/SearchField"
```

---

### Task 3: `@industry/web` — `Switch`

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/Switch.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Switch.stories.tsx`

**Interfaces:**

- Consumes: nothing from other tasks in this plan.
- Produces: `Switch` component + `SwitchProps` type, wired into `index.ts` in Task 6.

Source: `~/Documents/ds/components/react/controls/Switch.{jsx,d.ts}` + `~/Documents/ds/styles.css:230–243`:

```css
.switch {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--tap);
  cursor: pointer;
  font-size: 15px;
}
.switch .track {
  position: relative;
  width: 44px;
  height: 24px;
  flex: none;
  border: 1px solid var(--color-divider-strong);
  background: var(--color-surface);
}
.switch .track::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: var(--color-neutral-400);
}
.switch input:checked + .track {
  background: color-mix(in srgb, var(--color-accent) 28%, transparent);
  border-color: var(--color-accent);
}
.switch input:checked + .track::after {
  transform: translateX(20px);
  background: var(--color-accent);
}
.switch input:disabled + .track {
  opacity: 0.45;
}
.switch input:focus-visible + .track {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

- [ ] **Step 1: Write `Switch.tsx`**

```tsx
import { useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'style'> {
  label?: ReactNode;
  style?: CSSProperties;
}

export function Switch({
  label,
  checked,
  defaultChecked,
  disabled,
  style,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const [focused, setFocused] = useState(false);
  const isChecked = checked ?? internalChecked;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalChecked(e.target.checked);
    onChange?.(e);
  };
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 'var(--tap)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 15,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked !== undefined ? checked : undefined}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        {...rest}
      />
      <span
        style={{
          position: 'relative',
          width: 44,
          height: 24,
          flex: 'none',
          border: `1px solid ${isChecked ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
          background: isChecked
            ? 'color-mix(in srgb, var(--color-accent) 28%, transparent)'
            : 'var(--color-surface)',
          opacity: disabled ? 0.45 : 1,
          outline: focused ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: 2,
          transition: 'background 140ms ease, border-color 140ms ease',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 3,
            left: isChecked ? 23 : 3,
            width: 16,
            height: 16,
            background: isChecked ? 'var(--color-accent)' : 'var(--color-neutral-400)',
            transition: 'left 140ms ease, background 140ms ease',
          }}
        />
      </span>
      {label}
    </label>
  );
}
```

Notes:

- `left: 23` for the checked thumb position is `44 (track width) - 1 (border) - 3 (inset) - 16 (thumb) - 1 (border) = 23`, reproducing the source's `transform: translateX(20px)` from a `left: 3px` base (`3 + 20 = 23`) — using `left` instead of `transform: translateX` because this codebase's inline-style pattern elsewhere (`Button`, `TextField`) never reaches for `transform` for layout, only `Frame`'s corner marks do, and those are fixed offsets, not animated ones. Either is visually correct; `left` was chosen for consistency with how the rest of this file already positions the thumb (`top: 3, left: 3`).
- `outline-offset: 2px` on the track (not `-2px` like `SegmentedControl` in Task 6) — matches the source's shared rule `outline: 2px solid var(--color-accent); outline-offset: 2px;` for `.radio`/`.check`/`.switch` (`~/Documents/ds/styles.css:230`), which is a different rule from `.seg-opt`'s inward `-2px` (`~/Documents/ds/styles.css:252`).

- [ ] **Step 2: Write `Switch.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Switch label="Notificações" defaultChecked />
      <Switch label="Modo escuro" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledSwitch() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch
          label="Sincronização automática"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    }
    return <ControlledSwitch />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Switch label="Desabilitado, desligado" disabled />
      <Switch label="Desabilitado, ligado" disabled defaultChecked />
    </div>
  ),
};
```

- [ ] **Step 3: Manual verification**

Run: `yarn workspace @industry/web storybook`
Open `Core/Switch`. Click the uncontrolled switches — thumb should slide and track should tint accent. Tab to a switch with the keyboard — outline ring should appear. Confirm the two disabled stories render dimmed and don't toggle on click.

- [ ] **Step 4: Run lint + typecheck**

Run: `yarn workspace @industry/web lint && yarn workspace @industry/web check-types`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/industry-web/src/components/core/Switch.tsx packages/design-system/industry-web/src/components/core/Switch.stories.tsx
git commit -m "feat(industry-web): add Switch"
```

---

### Task 4: `@industry/web` — `Checkbox`

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/Checkbox.tsx`
- Create: `packages/design-system/industry-web/src/components/core/Checkbox.stories.tsx`

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: `Checkbox` component + `CheckboxProps` type, wired into `index.ts` in Task 6.

Source: `~/Documents/ds/components/react/controls/Checkbox.{jsx,d.ts}` + `~/Documents/ds/styles.css:212–230`:

```css
.check {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--tap);
  cursor: pointer;
  font-size: 15px;
}
.check:hover .box {
  border-color: var(--color-accent);
}
.check .box {
  width: 18px;
  height: 18px;
  flex: none;
  border: 1.5px solid var(--color-divider-strong);
  display: grid;
  place-items: center;
}
.check .box::after {
  content: '';
  width: 10px;
  height: 6px;
  border-left: 2px solid var(--color-bg);
  border-bottom: 2px solid var(--color-bg);
  transform: rotate(-45deg) translateY(-1px);
  opacity: 0;
}
.check input:checked + .box {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.check input:checked + .box::after {
  opacity: 1;
}
.check input:focus-visible + .box {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Recall the Global Constraints ruling: no `:disabled` opacity for `Checkbox` — the source doesn't define one, so this component doesn't dim on `disabled` (only `cursor` and interactivity change).

- [ ] **Step 1: Write `Checkbox.tsx`**

```tsx
import { useState } from 'react';
import type { ChangeEvent, CSSProperties, FocusEvent, InputHTMLAttributes, ReactNode } from 'react';

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'style'
> {
  label?: ReactNode;
  style?: CSSProperties;
}

export function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled,
  style,
  onChange,
  onFocus,
  onBlur,
  ...rest
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const isChecked = checked ?? internalChecked;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInternalChecked(e.target.checked);
    onChange?.(e);
  };
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 'var(--tap)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 15,
        ...style,
      }}
    >
      <input
        type="checkbox"
        checked={checked !== undefined ? checked : undefined}
        defaultChecked={checked === undefined ? defaultChecked : undefined}
        disabled={disabled}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
        {...rest}
      />
      <span
        style={{
          width: 18,
          height: 18,
          flex: 'none',
          border: `1.5px solid ${isChecked || hovered ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
          background: isChecked ? 'var(--color-accent)' : 'transparent',
          display: 'grid',
          placeItems: 'center',
          outline: focused ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: 2,
        }}
      >
        <span
          style={{
            width: 10,
            height: 6,
            borderLeft: '2px solid var(--color-bg)',
            borderBottom: '2px solid var(--color-bg)',
            transform: 'rotate(-45deg) translateY(-1px)',
            opacity: isChecked ? 1 : 0,
          }}
        />
      </span>
      {label}
    </label>
  );
}
```

- [ ] **Step 2: Write `Checkbox.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox label="Aceito os termos" defaultChecked />
      <Checkbox label="Receber novidades por email" />
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    function ControlledCheckbox() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          label="Lembrar minha escolha"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
    }
    return <ControlledCheckbox />;
  },
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <Checkbox label="Desabilitado, desmarcado" disabled />
      <Checkbox label="Desabilitado, marcado" disabled defaultChecked />
    </div>
  ),
};
```

- [ ] **Step 3: Manual verification**

Run: `yarn workspace @industry/web storybook`
Open `Core/Checkbox`. Hover an unchecked box — border should turn accent-colored even without clicking. Click to check — box fills accent and the check-mark fades in. Tab to it — outline ring appears. Confirm disabled stories don't respond to hover/click but are NOT dimmed (per the deliberate faithfulness gap above).

- [ ] **Step 4: Run lint + typecheck**

Run: `yarn workspace @industry/web lint && yarn workspace @industry/web check-types`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/industry-web/src/components/core/Checkbox.tsx packages/design-system/industry-web/src/components/core/Checkbox.stories.tsx
git commit -m "feat(industry-web): add Checkbox"
```

---

### Task 5: `@industry/web` — `RadioGroup`

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/RadioGroup.tsx`
- Create: `packages/design-system/industry-web/src/components/core/RadioGroup.stories.tsx`

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: `RadioGroup` component + `RadioGroupProps`/`RadioOption` types, wired into `index.ts` in Task 6.

Source: `~/Documents/ds/components/react/controls/RadioGroup.{jsx,d.ts}` + `~/Documents/ds/styles.css:212–230`:

```css
.radio {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
  min-height: var(--tap);
  cursor: pointer;
  font-size: 15px;
}
.radio:hover .dot {
  border-color: var(--color-accent);
}
.radio .dot {
  width: 18px;
  height: 18px;
  flex: none;
  border-radius: 50%;
  border: 1.5px solid var(--color-divider-strong);
}
.radio input:checked + .dot {
  border-color: var(--color-accent);
  background: var(--color-accent);
  box-shadow: inset 0 0 0 4px var(--color-bg);
}
.radio input:focus-visible + .dot {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

Same faithfulness ruling as `Checkbox`: no `:disabled` opacity is defined in the source for `.radio`, so none is added here. `RadioGroupProps` also has no `disabled` prop at all in the source `.d.ts` (`~/Documents/ds/components/react/controls/RadioGroup.d.ts`) — port that as-is, don't invent one.

- [ ] **Step 1: Write `RadioGroup.tsx`**

```tsx
import { useState } from 'react';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface RadioOption {
  value: string;
  label: ReactNode;
}

export interface RadioGroupProps {
  label?: ReactNode;
  name: string;
  options?: (string | RadioOption)[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

function resolveOption(option: string | RadioOption): RadioOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function RadioGroup({ label, name, options = [], value, onChange, style }: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      aria-label={typeof label === 'string' ? label : undefined}
      style={{ display: 'grid', gap: 'var(--space-2)', ...style }}
    >
      {label ? (
        <span
          style={{ fontSize: 13, color: 'color-mix(in srgb, var(--color-text) 70%, transparent)' }}
        >
          {label}
        </span>
      ) : null}
      {options.map((option) => {
        const opt = resolveOption(option);
        return (
          <RadioOptionItem
            key={opt.value}
            name={name}
            option={opt}
            checked={value === opt.value}
            onChange={onChange}
          />
        );
      })}
    </div>
  );
}

function RadioOptionItem({
  name,
  option,
  checked,
  onChange,
}: {
  name: string;
  option: RadioOption;
  checked: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        minHeight: 'var(--tap)',
        cursor: 'pointer',
        fontSize: 15,
      }}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      <span
        style={{
          width: 18,
          height: 18,
          flex: 'none',
          borderRadius: '50%',
          border: `1.5px solid ${checked || hovered ? 'var(--color-accent)' : 'var(--color-divider-strong)'}`,
          background: checked ? 'var(--color-accent)' : 'transparent',
          boxShadow: checked ? 'inset 0 0 0 4px var(--color-bg)' : 'none',
          outline: focused ? '2px solid var(--color-accent)' : 'none',
          outlineOffset: 2,
        }}
      />
      {option.label}
    </label>
  );
}
```

`RadioOptionItem` is an internal (non-exported) helper component, same precedent as `BlueprintMarks` — each radio option needs its own independent `hovered`/`focused` state, which can't live on the parent `RadioGroup` (hovering one option must not highlight another).

- [ ] **Step 2: Write `RadioGroup.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Core/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const StringOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('mensal');
      return (
        <RadioGroup
          label="Periodicidade"
          name="periodicidade"
          options={['mensal', 'anual']}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};

export const ObjectOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('br');
      return (
        <RadioGroup
          label="Região"
          name="regiao"
          options={[
            { value: 'br', label: 'Brasil' },
            { value: 'us', label: 'Estados Unidos' },
            { value: 'eu', label: 'Europa' },
          ]}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};
```

- [ ] **Step 3: Manual verification**

Run: `yarn workspace @industry/web storybook`
Open `Core/RadioGroup`. Click between options — selection should move, previous option should visually deselect. Hover an unselected dot — border turns accent. Confirm the checked dot shows the "donut" ring (accent fill with a background-colored inner circle), not a solid disc.

- [ ] **Step 4: Run lint + typecheck**

Run: `yarn workspace @industry/web lint && yarn workspace @industry/web check-types`
Expected: both exit 0.

- [ ] **Step 5: Commit**

```bash
git add packages/design-system/industry-web/src/components/core/RadioGroup.tsx packages/design-system/industry-web/src/components/core/RadioGroup.stories.tsx
git commit -m "feat(industry-web): add RadioGroup"
```

---

### Task 6: `@industry/web` — `SegmentedControl` + export wiring + README

**Files:**

- Create: `packages/design-system/industry-web/src/components/core/SegmentedControl.tsx`
- Create: `packages/design-system/industry-web/src/components/core/SegmentedControl.stories.tsx`
- Modify: `packages/design-system/industry-web/src/components/core/index.ts`
- Modify: `packages/design-system/industry-web/README.md`

**Interfaces:**

- Consumes: `Switch`, `Checkbox`, `RadioGroup` from Tasks 3–5 (re-exported here, not imported by `SegmentedControl` itself).
- Produces: `SegmentedControl` component + `SegmentOption`/`SegmentedControlProps` types; the full `Core` barrel export for this plan's 4 components.

Source: `~/Documents/ds/components/react/controls/SegmentedControl.{jsx,d.ts}` + `~/Documents/ds/styles.css:244–252`:

```css
.seg {
  display: inline-flex;
  border: 1px solid var(--color-divider);
  border-radius: 0;
}
.seg-opt {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--control-h);
  padding: 0 var(--space-4);
  font-size: 14px;
  cursor: pointer;
}
.seg-opt + .seg-opt {
  border-left: 1px solid var(--color-divider);
}
.seg-opt:has(input:checked) {
  background: var(--color-accent);
  color: var(--color-bg);
}
.seg-opt:not(:has(input:checked)):hover {
  background: color-mix(in srgb, var(--color-text) 8%, transparent);
}
.seg-opt:has(input:focus-visible) {
  outline: 2px solid var(--color-accent);
  outline-offset: -2px;
}
```

- [ ] **Step 1: Write `SegmentedControl.tsx`**

```tsx
import { useState } from 'react';
import type { ChangeEvent, CSSProperties, ReactNode } from 'react';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  name: string;
  options?: (string | SegmentOption)[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  style?: CSSProperties;
}

function resolveOption(option: string | SegmentOption): SegmentOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function SegmentedControl({
  name,
  options = [],
  value,
  onChange,
  style,
}: SegmentedControlProps) {
  return (
    <div
      role="radiogroup"
      style={{ display: 'inline-flex', border: '1px solid var(--color-divider)', ...style }}
    >
      {options.map((option, index) => {
        const opt = resolveOption(option);
        return (
          <SegmentItem
            key={opt.value}
            name={name}
            option={opt}
            checked={value === opt.value}
            onChange={onChange}
            withDivider={index > 0}
          />
        );
      })}
    </div>
  );
}

function SegmentItem({
  name,
  option,
  checked,
  onChange,
  withDivider,
}: {
  name: string;
  option: SegmentOption;
  checked: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  withDivider: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <label
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        minHeight: 'var(--control-h)',
        padding: '0 var(--space-4)',
        fontSize: 14,
        cursor: 'pointer',
        borderLeft: withDivider ? '1px solid var(--color-divider)' : undefined,
        background: checked
          ? 'var(--color-accent)'
          : hovered
            ? 'color-mix(in srgb, var(--color-text) 8%, transparent)'
            : 'transparent',
        color: checked ? 'var(--color-bg)' : 'inherit',
        outline: focused ? '2px solid var(--color-accent)' : 'none',
        outlineOffset: -2,
      }}
    >
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
      />
      {option.icon}
      {option.label}
    </label>
  );
}
```

- [ ] **Step 2: Write `SegmentedControl.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from './Icon';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Core/SegmentedControl',
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const TextOnly: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('dia');
      return (
        <SegmentedControl
          name="periodo"
          options={['dia', 'semana', 'mes']}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};

export const WithIcons: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('grid');
      return (
        <SegmentedControl
          name="visualizacao"
          options={[
            { value: 'grid', label: 'Grade', icon: <Icon name="grid-2x2" size="sm" /> },
            { value: 'list', label: 'Lista', icon: <Icon name="list" size="sm" /> },
          ]}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    }
    return <Demo />;
  },
};
```

- [ ] **Step 3: Wire up `index.ts`**

Open `packages/design-system/industry-web/src/components/core/index.ts`. Replace the whole file with:

```ts
export { Frame } from './Frame';
export type { FrameProps } from './Frame';

export { Icon } from './Icon';
export type { IconProps, IconSize } from './Icon';

export { Duotone } from './Duotone';
export type { DuotoneProps } from './Duotone';

export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';

export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';
export { SearchField } from './SearchField';
export type { SearchFieldProps } from './SearchField';

export { Switch } from './Switch';
export type { SwitchProps } from './Switch';
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
export { RadioGroup } from './RadioGroup';
export type { RadioGroupProps, RadioOption } from './RadioGroup';
export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl';
```

- [ ] **Step 4: Update `README.md`**

Open `packages/design-system/industry-web/README.md`. In the `## Componentes` section, after the `SearchField` line, add:

```markdown
**`Switch`** — `label`, mais os atributos de `<input type="checkbox">`. Aceita uso controlado (`checked`/`onChange`) ou não controlado (`defaultChecked`) — o estado de `checked` é espelhado em `useState` internamente porque este pacote não usa folha de estilo, então não há seletor `:checked` de CSS de graça para o track reagir; o `<input>` real continua existindo (escondido visualmente) por trás, então semântica de formulário e teclado funcionam normalmente.

**`Checkbox`** — mesma lógica de `Switch` (controlado ou não controlado), `label`, mais os atributos de `<input type="checkbox">`. Sem tratamento visual de `disabled` — fiel à fonte, que não define um para `.check` (só para `.switch` e campos de texto).

**`RadioGroup`** — `label`, `name` (obrigatório), `options` (strings ou `{value, label}`), `value`, `onChange`, `role="radiogroup"`. Cada opção é sempre controlada pelo `value` do grupo — sem estado interno próprio.

**`SegmentedControl`** — `name`, `options` (com `icon` opcional), `value`, `onChange`, para 2–4 escolhas mutuamente exclusivas. Anel de foco para dentro (`outline-offset: -2px`), diferente dos outros três controles (`outline-offset: 2px`) — mesma assimetria da fonte.
```

Then find the sentence in the `## Escopo` section that reads:

```
Este pacote tem seis componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField` e `SearchField` (parte do REB-67). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. A taxonomia de pastas (`src/components/{core,data,feedback,forms,navigation}`) já espelha `@vuotto/web` para receber esses componentes sem reestruturação. Os outros 5 controles (`Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`) e os componentes de layout/navegação/feedback/dados (REB-68 a REB-71) chegam em PRs seguintes.
```

Replace it with:

```
Este pacote tem dez componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField`, `SearchField`, `Switch`, `Checkbox`, `RadioGroup` e `SegmentedControl` (parte do REB-67). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. A taxonomia de pastas (`src/components/{core,data,feedback,forms,navigation}`) já espelha `@vuotto/web` para receber esses componentes sem reestruturação. `Select` (o único controle restante do REB-67) chega em um PR próprio — precisa de uma decisão de arquitetura diferente dos outros. Os componentes de layout/navegação/feedback/dados (REB-68 a REB-71) chegam em PRs seguintes.
```

- [ ] **Step 5: Run full verification**

Run: `yarn workspace @industry/web lint && yarn workspace @industry/web check-types && yarn workspace @industry/web build`
Expected: all three exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/industry-web/src/components/core/SegmentedControl.tsx packages/design-system/industry-web/src/components/core/SegmentedControl.stories.tsx packages/design-system/industry-web/src/components/core/index.ts packages/design-system/industry-web/README.md
git commit -m "feat(industry-web): add SegmentedControl, wire up choice controls exports"
```

---

### Task 7: `@industry/mobile` — `Switch`

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/Switch.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Switch.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Switch.test.tsx`

**Interfaces:**

- Consumes: `color`, `neutral`, `alpha`, `space`, `control` from `@industry/tokens`.
- Produces: `Switch` component + `SwitchProps` type, wired into `index.ts` in Task 10.

Mirrors Task 3's web `Switch`, rebuilt on `Pressable` (no native `<input>` to lean on) per the Global Constraints divergence: `onCheckedChange(checked: boolean)` instead of a synthetic `onChange`. Dims on `disabled` (matches the source's `.switch input:disabled + .track` rule — the one choice control where disabled dimming IS defined).

- [ ] **Step 1: Write `Switch.tsx`**

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, neutral, alpha, space, control } from '@industry/tokens';

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Switch({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  style,
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      testID="switch-root"
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: space[3],
          minHeight: control.tap,
          opacity: disabled ? 0.45 : 1,
        },
        style,
      ]}
    >
      <Pressable
        testID="switch-track"
        onPress={toggle}
        disabled={disabled}
        style={{
          width: 44,
          height: 24,
          borderWidth: 1,
          borderColor: isChecked ? color.accent : color.dividerStrong,
          backgroundColor: isChecked ? alpha(color.accent, 28) : color.surface,
        }}
      >
        <Pressable
          testID="switch-thumb"
          onPress={toggle}
          disabled={disabled}
          style={{
            position: 'absolute',
            top: 3,
            left: isChecked ? 23 : 3,
            width: 16,
            height: 16,
            backgroundColor: isChecked ? color.accent : neutral['400'],
          }}
        />
      </Pressable>
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
}
```

Note: the track and thumb are also wrapped in `Pressable` (not plain `View`) purely so `testID="switch-track"`/`testID="switch-thumb"` are reachable by their own `fireEvent(..., 'press')` in tests without bubbling ambiguity — they all call the same `toggle`, so tapping anywhere on the control behaves identically to tapping the outer root, matching a real switch's full-width tap target.

- [ ] **Step 2: Write `Switch.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
  title: 'Core/Switch',
  component: Switch,
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Uncontrolled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Switch label="Notificações" defaultChecked />
      <Switch label="Modo escuro" />
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(true);
      return (
        <Switch label="Sincronização automática" checked={checked} onCheckedChange={setChecked} />
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Switch label="Desabilitado, desligado" disabled />
      <Switch label="Desabilitado, ligado" disabled defaultChecked />
    </View>
  ),
};
```

- [ ] **Step 3: Write `Switch.test.tsx`**

```tsx
import { fireEvent, render } from '@testing-library/react-native';
import { color, neutral } from '@industry/tokens';
import { Switch } from './Switch';

describe('Switch', () => {
  it('toggles from unchecked to checked on press when uncontrolled', () => {
    const { getByTestId } = render(<Switch label="Wifi" />);
    const thumb = getByTestId('switch-thumb');

    expect(thumb.props.style).toMatchObject({ backgroundColor: neutral['400'] });

    fireEvent(getByTestId('switch-root'), 'press');

    expect(getByTestId('switch-thumb').props.style).toMatchObject({
      backgroundColor: color.accent,
    });
  });

  it('calls onCheckedChange with the next value', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Switch label="Wifi" checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('switch-root'), 'press');

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Switch label="Wifi" disabled checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('switch-root'), 'press');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('sets accessibilityState from checked and disabled', () => {
    const { getByTestId } = render(<Switch label="Wifi" checked disabled />);
    expect(getByTestId('switch-root').props.accessibilityState).toMatchObject({
      checked: true,
      disabled: true,
    });
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `yarn workspace @industry/mobile test Switch.test.tsx`
Expected: 4 tests pass.

- [ ] **Step 5: Run lint + typecheck**

Run: `yarn workspace @industry/mobile lint && yarn workspace @industry/mobile check-types`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/industry-mobile/src/components/core/Switch.tsx packages/design-system/industry-mobile/src/components/core/Switch.stories.tsx packages/design-system/industry-mobile/src/components/core/Switch.test.tsx
git commit -m "feat(industry-mobile): add Switch"
```

---

### Task 8: `@industry/mobile` — `Checkbox`

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/Checkbox.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Checkbox.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/Checkbox.test.tsx`

**Interfaces:**

- Consumes: `color`, `space`, `control` from `@industry/tokens`.
- Produces: `Checkbox` component + `CheckboxProps` type, wired into `index.ts` in Task 10.

Mirrors Task 4's web `Checkbox`. No hover (touch), no disabled dimming (faithfulness gap, same ruling as web).

- [ ] **Step 1: Write `Checkbox.tsx`**

```tsx
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Checkbox({
  checked,
  defaultChecked,
  onCheckedChange,
  label,
  disabled,
  style,
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(Boolean(defaultChecked));
  const isChecked = checked ?? internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <Pressable
      testID="checkbox-root"
      onPress={toggle}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isChecked, disabled: Boolean(disabled) }}
      style={[
        { flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: control.tap },
        style,
      ]}
    >
      <View
        testID="checkbox-box"
        style={{
          width: 18,
          height: 18,
          borderWidth: 1.5,
          borderColor: isChecked ? color.accent : color.dividerStrong,
          backgroundColor: isChecked ? color.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChecked ? (
          <View
            testID="checkbox-mark"
            style={{
              width: 10,
              height: 6,
              borderLeftWidth: 2,
              borderBottomWidth: 2,
              borderColor: color.bg,
              transform: [{ rotate: '-45deg' }, { translateY: -1 }],
            }}
          />
        ) : null}
      </View>
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
    </Pressable>
  );
}
```

- [ ] **Step 2: Write `Checkbox.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { View } from 'react-native';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Core/Checkbox',
  component: Checkbox,
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Uncontrolled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox label="Aceito os termos" defaultChecked />
      <Checkbox label="Receber novidades por email" />
    </View>
  ),
};

export const Controlled: Story = {
  render: () => {
    function Demo() {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox label="Lembrar minha escolha" checked={checked} onCheckedChange={setChecked} />
      );
    }
    return <Demo />;
  },
};

export const Disabled: Story = {
  render: () => (
    <View style={{ gap: 12 }}>
      <Checkbox label="Desabilitado, desmarcado" disabled />
      <Checkbox label="Desabilitado, marcado" disabled defaultChecked />
    </View>
  ),
};
```

- [ ] **Step 3: Write `Checkbox.test.tsx`**

```tsx
import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('renders no check mark when unchecked', () => {
    const { queryByTestId } = render(<Checkbox label="Termos" />);
    expect(queryByTestId('checkbox-mark')).toBeNull();
  });

  it('toggles to checked on press when uncontrolled', () => {
    const { getByTestId, queryByTestId } = render(<Checkbox label="Termos" />);

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(queryByTestId('checkbox-mark')).toBeTruthy();
    expect(getByTestId('checkbox-box').props.style).toMatchObject({
      backgroundColor: color.accent,
    });
  });

  it('calls onCheckedChange with the next value', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox label="Termos" checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not toggle when disabled', () => {
    const onCheckedChange = jest.fn();
    const { getByTestId } = render(
      <Checkbox label="Termos" disabled checked={false} onCheckedChange={onCheckedChange} />,
    );

    fireEvent(getByTestId('checkbox-root'), 'press');

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `yarn workspace @industry/mobile test Checkbox.test.tsx`
Expected: 4 tests pass.

- [ ] **Step 5: Run lint + typecheck**

Run: `yarn workspace @industry/mobile lint && yarn workspace @industry/mobile check-types`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/industry-mobile/src/components/core/Checkbox.tsx packages/design-system/industry-mobile/src/components/core/Checkbox.stories.tsx packages/design-system/industry-mobile/src/components/core/Checkbox.test.tsx
git commit -m "feat(industry-mobile): add Checkbox"
```

---

### Task 9: `@industry/mobile` — `RadioGroup`

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/RadioGroup.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/RadioGroup.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/RadioGroup.test.tsx`

**Interfaces:**

- Consumes: `color`, `space`, `control` from `@industry/tokens`.
- Produces: `RadioGroup` component + `RadioGroupProps`/`RadioOption` types, wired into `index.ts` in Task 10.

Mirrors Task 5's web `RadioGroup`, minus the `name` prop (no RN equivalent — see Global Constraints), using `onValueChange(value: string)`. The "donut" checked-dot look (`box-shadow: inset 0 0 0 4px var(--color-bg)` on web) has no RN equivalent — `View` doesn't support inset shadows — so it's approximated with a nested solid `color.bg`-colored circle centered inside the accent-filled outer circle, same category of documented approximation as `Duotone`'s flat-tint fallback.

- [ ] **Step 1: Write `RadioGroup.tsx`**

```tsx
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface RadioOption {
  value: string;
  label: ReactNode;
}

export interface RadioGroupProps {
  label?: ReactNode;
  options?: (string | RadioOption)[];
  value?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

function resolveOption(option: string | RadioOption): RadioOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function RadioGroup({ label, options = [], value, onValueChange, style }: RadioGroupProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={typeof label === 'string' ? label : undefined}
      style={[{ gap: space[2] }, style]}
    >
      {typeof label === 'string' ? (
        <Text style={{ fontSize: 13, color: color.text }}>{label}</Text>
      ) : (
        label
      )}
      {options.map((option) => {
        const opt = resolveOption(option);
        return (
          <RadioOptionItem
            key={opt.value}
            option={opt}
            checked={value === opt.value}
            onSelect={() => onValueChange?.(opt.value)}
          />
        );
      })}
    </View>
  );
}

function RadioOptionItem({
  option,
  checked,
  onSelect,
}: {
  option: RadioOption;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      testID={`radio-option-${option.value}`}
      onPress={onSelect}
      accessibilityRole="radio"
      accessibilityState={{ checked }}
      style={{ flexDirection: 'row', alignItems: 'center', gap: space[3], minHeight: control.tap }}
    >
      <View
        testID={`radio-dot-${option.value}`}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 1.5,
          borderColor: checked ? color.accent : color.dividerStrong,
          backgroundColor: checked ? color.accent : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? (
          <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color.bg }} />
        ) : null}
      </View>
      {typeof option.label === 'string' ? (
        <Text style={{ fontSize: 15, color: color.text }}>{option.label}</Text>
      ) : (
        option.label
      )}
    </Pressable>
  );
}
```

- [ ] **Step 2: Write `RadioGroup.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { RadioGroup } from './RadioGroup';

const meta: Meta<typeof RadioGroup> = {
  title: 'Core/RadioGroup',
  component: RadioGroup,
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const StringOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('mensal');
      return (
        <RadioGroup
          label="Periodicidade"
          options={['mensal', 'anual']}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};

export const ObjectOptions: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('br');
      return (
        <RadioGroup
          label="Região"
          options={[
            { value: 'br', label: 'Brasil' },
            { value: 'us', label: 'Estados Unidos' },
            { value: 'eu', label: 'Europa' },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};
```

- [ ] **Step 3: Write `RadioGroup.test.tsx`**

```tsx
import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { RadioGroup } from './RadioGroup';

describe('RadioGroup', () => {
  it('marks the option matching value as checked', () => {
    const { getByTestId } = render(
      <RadioGroup options={['a', 'b']} value="b" onValueChange={jest.fn()} />,
    );

    expect(getByTestId('radio-option-a').props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(getByTestId('radio-option-b').props.accessibilityState).toMatchObject({ checked: true });
    expect(getByTestId('radio-dot-b').props.style).toMatchObject({ backgroundColor: color.accent });
  });

  it('calls onValueChange with the pressed option value', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <RadioGroup options={['a', 'b']} value="a" onValueChange={onValueChange} />,
    );

    fireEvent(getByTestId('radio-option-b'), 'press');

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders object options by their label', () => {
    const { getByText } = render(
      <RadioGroup
        options={[{ value: 'br', label: 'Brasil' }]}
        value="br"
        onValueChange={jest.fn()}
      />,
    );

    expect(getByText('Brasil')).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `yarn workspace @industry/mobile test RadioGroup.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Run lint + typecheck**

Run: `yarn workspace @industry/mobile lint && yarn workspace @industry/mobile check-types`
Expected: both exit 0.

- [ ] **Step 6: Commit**

```bash
git add packages/design-system/industry-mobile/src/components/core/RadioGroup.tsx packages/design-system/industry-mobile/src/components/core/RadioGroup.stories.tsx packages/design-system/industry-mobile/src/components/core/RadioGroup.test.tsx
git commit -m "feat(industry-mobile): add RadioGroup"
```

---

### Task 10: `@industry/mobile` — `SegmentedControl` + export wiring + README

**Files:**

- Create: `packages/design-system/industry-mobile/src/components/core/SegmentedControl.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/SegmentedControl.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/components/core/SegmentedControl.test.tsx`
- Modify: `packages/design-system/industry-mobile/src/components/core/index.ts`
- Modify: `packages/design-system/industry-mobile/README.md`

**Interfaces:**

- Consumes: `color`, `space`, `control` from `@industry/tokens`.
- Produces: `SegmentedControl` component + `SegmentOption`/`SegmentedControlProps` types; the full `Core` barrel export for this plan's 4 mobile components.

Mirrors Task 6's web `SegmentedControl`, minus `name` and hover (touch has none). No focus-ring tracking either — mobile `Button` never tracks focus (only `pressed`), and this plan doesn't introduce a first RN focus-visible pattern without a concrete need driving it; that stays a parked, explicitly-noted gap, not a silent omission.

- [ ] **Step 1: Write `SegmentedControl.tsx`**

```tsx
import { Pressable, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { color, space, control } from '@industry/tokens';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  icon?: ReactNode;
}

export interface SegmentedControlProps {
  options?: (string | SegmentOption)[];
  value?: string;
  onValueChange?: (value: string) => void;
  style?: StyleProp<ViewStyle>;
}

function resolveOption(option: string | SegmentOption): SegmentOption {
  return typeof option === 'string' ? { value: option, label: option } : option;
}

export function SegmentedControl({
  options = [],
  value,
  onValueChange,
  style,
}: SegmentedControlProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={[{ flexDirection: 'row', borderWidth: 1, borderColor: color.divider }, style]}
    >
      {options.map((option, index) => {
        const opt = resolveOption(option);
        const checked = value === opt.value;
        return (
          <Pressable
            key={opt.value}
            testID={`segment-option-${opt.value}`}
            onPress={() => onValueChange?.(opt.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: space[2],
              minHeight: control.height,
              paddingHorizontal: space[4],
              borderLeftWidth: index > 0 ? 1 : 0,
              borderLeftColor: color.divider,
              backgroundColor: checked ? color.accent : 'transparent',
            }}
          >
            {opt.icon}
            {typeof opt.label === 'string' ? (
              <Text style={{ fontSize: 14, color: checked ? color.bg : color.text }}>
                {opt.label}
              </Text>
            ) : (
              opt.label
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
```

- [ ] **Step 2: Write `SegmentedControl.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Icon } from './Icon';
import { color } from '@industry/tokens';

const meta: Meta<typeof SegmentedControl> = {
  title: 'Core/SegmentedControl',
  component: SegmentedControl,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const TextOnly: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('dia');
      return (
        <SegmentedControl
          options={['dia', 'semana', 'mes']}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};

export const WithIcons: Story = {
  render: () => {
    function Demo() {
      const [value, setValue] = useState('grid');
      return (
        <SegmentedControl
          options={[
            {
              value: 'grid',
              label: 'Grade',
              icon: <Icon name="Grid2x2" size="sm" color={color.text} />,
            },
            {
              value: 'list',
              label: 'Lista',
              icon: <Icon name="List" size="sm" color={color.text} />,
            },
          ]}
          value={value}
          onValueChange={setValue}
        />
      );
    }
    return <Demo />;
  },
};
```

- [ ] **Step 3: Write `SegmentedControl.test.tsx`**

```tsx
import { fireEvent, render } from '@testing-library/react-native';
import { color } from '@industry/tokens';
import { SegmentedControl } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('marks the option matching value as checked', () => {
    const { getByTestId } = render(
      <SegmentedControl options={['a', 'b']} value="b" onValueChange={jest.fn()} />,
    );

    expect(getByTestId('segment-option-a').props.accessibilityState).toMatchObject({
      checked: false,
    });
    expect(getByTestId('segment-option-b').props.accessibilityState).toMatchObject({
      checked: true,
    });
    expect(getByTestId('segment-option-b').props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: color.accent }),
    );
  });

  it('calls onValueChange with the pressed option value', () => {
    const onValueChange = jest.fn();
    const { getByTestId } = render(
      <SegmentedControl options={['a', 'b']} value="a" onValueChange={onValueChange} />,
    );

    fireEvent(getByTestId('segment-option-b'), 'press');

    expect(onValueChange).toHaveBeenCalledWith('b');
  });

  it('renders object options by their label', () => {
    const { getByText } = render(
      <SegmentedControl
        options={[{ value: 'grid', label: 'Grade' }]}
        value="grid"
        onValueChange={jest.fn()}
      />,
    );

    expect(getByText('Grade')).toBeTruthy();
  });
});
```

- [ ] **Step 4: Run the tests**

Run: `yarn workspace @industry/mobile test SegmentedControl.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Wire up `index.ts`**

Open `packages/design-system/industry-mobile/src/components/core/index.ts`. Replace the whole file with:

```ts
export { Frame } from './Frame';
export type { FrameProps } from './Frame';
export { Icon } from './Icon';
export type { IconProps, IconSize, IconName } from './Icon';
export { Duotone } from './Duotone';
export type { DuotoneProps } from './Duotone';
export { Button } from './Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './Button';
export { TextField } from './TextField';
export type { TextFieldProps } from './TextField';
export { SearchField } from './SearchField';
export type { SearchFieldProps } from './SearchField';
export { Switch } from './Switch';
export type { SwitchProps } from './Switch';
export { Checkbox } from './Checkbox';
export type { CheckboxProps } from './Checkbox';
export { RadioGroup } from './RadioGroup';
export type { RadioGroupProps, RadioOption } from './RadioGroup';
export { SegmentedControl } from './SegmentedControl';
export type { SegmentedControlProps, SegmentOption } from './SegmentedControl';
```

- [ ] **Step 6: Update `README.md`**

Open `packages/design-system/industry-mobile/README.md`. In the `## Componentes` section, after the `SearchField` line, add:

```markdown
**`Switch`** — `checked`/`defaultChecked`/`onCheckedChange` (não `value`/`onValueChange` do `Switch` nativo do RN — nome escolhido para não colidir com o `value` de string de `RadioGroup`/`SegmentedControl` abaixo), `label`, `disabled`. Sem componente nativo do RN por baixo (o `Switch` do RN não dá controle sobre as dimensões quadradas deste sistema) — é `Pressable` com o track e o thumb desenhados à mão, mesma abordagem do `Button`.

**`Checkbox`** — mesma lógica de estado controlado/não controlado de `Switch` (`checked`/`defaultChecked`/`onCheckedChange`), `label`, `disabled`. Sem tratamento visual de `disabled` — fiel à fonte web, que só define esse tratamento para `Switch`.

**`RadioGroup`** — `label`, `options` (strings ou `{value, label}`), `value`, `onValueChange`. Sem prop `name` — é uma amarração de formulário HTML sem equivalente em RN; o agrupamento aqui é implícito (uma instância do componente, um conjunto de opções). O anel "donut" do estado marcado (`box-shadow: inset` na web) não existe em RN — aproximado com um círculo sólido `color.bg` centralizado dentro do círculo de acento.

**`SegmentedControl`** — `options` (com `icon` opcional), `value`, `onValueChange`. Sem `name` (mesma razão do `RadioGroup`) nem `:hover` (não existe em toque).
```

Then find the sentence in the `## Escopo` section that reads:

```
Este pacote tem seis componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField` e `SearchField` (parte do REB-73). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. Os outros 5 controles (`Select`, `Switch`, `Checkbox`, `RadioGroup`, `SegmentedControl`) e os componentes de layout/navegação/feedback/dados (REB-74 a REB-77) chegam em PRs seguintes.
```

Replace it with:

```
Este pacote tem dez componentes prontos: `Frame` (REB-62), `Icon` (REB-64), `Duotone` (REB-63), `Button`, `TextField`, `SearchField`, `Switch`, `Checkbox`, `RadioGroup` e `SegmentedControl` (parte do REB-73). As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. `Select` (o único controle restante do REB-73) chega em um PR próprio — precisa de bottom sheet/action sheet nativo, não um `<select>` HTML equivalente. Os componentes de layout/navegação/feedback/dados (REB-74 a REB-77) chegam em PRs seguintes.
```

Also add one line to the `## O que não traduz 1:1 pra mobile` section, after the existing `mix-blend-mode` bullet:

```markdown
- **O anel "donut" do `RadioGroup` marcado** (`box-shadow: inset 0 0 0 4px` na web) não existe em RN — `View` não suporta sombra interna. Aproximado com um círculo sólido centralizado, ver "Componentes" acima.
- **`:hover` em `Checkbox`/`RadioGroup`/`SegmentedControl`** não existe — toque não tem estado de passar o mouse.
```

- [ ] **Step 7: Run full verification**

Run: `yarn workspace @industry/mobile lint && yarn workspace @industry/mobile check-types && yarn workspace @industry/mobile test && yarn workspace @industry/mobile build`
Expected: all four exit 0.

- [ ] **Step 8: Commit**

```bash
git add packages/design-system/industry-mobile/src/components/core/SegmentedControl.tsx packages/design-system/industry-mobile/src/components/core/SegmentedControl.stories.tsx packages/design-system/industry-mobile/src/components/core/SegmentedControl.test.tsx packages/design-system/industry-mobile/src/components/core/index.ts packages/design-system/industry-mobile/README.md
git commit -m "feat(industry-mobile): add SegmentedControl, wire up choice controls exports"
```
