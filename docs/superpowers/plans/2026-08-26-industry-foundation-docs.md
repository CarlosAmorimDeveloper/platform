# @industry/web + @industry/mobile Foundation Docs Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the six static foundation reference pages from the source prototype (`~/Documents/ds/foundations/*.html`) into live Storybook documentation for `@industry/web` and `@industry/mobile` — the final piece of REB-49 (Industry DS visual signature). Closes the epic.

**Architecture:** No MDX — this repo's design-system packages have no MDX precedent (`vuotto-web`/`vuotto-mobile` use only `.stories.tsx`), so foundation pages are plain Storybook stories under a new `Foundations/*` title group, following the same `title`/`render` shape every other story in these packages already uses. Each page renders the **real** tokens (CSS custom properties on web, the actual JS exports from `@industry/tokens` on mobile) — never a hardcoded hex or px value — so a foundation page can never drift from the token source of truth, per REB-65's own explicit requirement. Two of the six pages (Icons, Image) consume the `Icon` and `Duotone` components built in the prior REB-64/REB-63 plan; the other four (Color, Typography, Semantics & data-viz, Spacing & elevation) need only the tokens from REB-48. Files live in a new `src/foundations/` directory in each package (sibling to `src/components/`), not under `components/core/`, since these are documentation demonstrations, not reusable components.

One naming note carried over from the source: `~/Documents/ds/foundations/layout.html`'s actual page title and content are "Spacing & elevation" (spacing scale, touch targets, radius, elevation) — despite the filename, it is not a modular-grid-layout page. This plan titles the corresponding story group `Foundations/Spacing & Elevation`, matching the page's real content and its own `<title>`/`@dsCard name` metadata, not the source filename.

**Tech Stack:** Storybook 8 (`@storybook/react-vite`), React 19, TypeScript strict, `@industry/tokens`, `@industry/web`'s/`@industry/mobile`'s own already-built `Icon`/`Duotone`/`Frame` components.

**Spec:** `~/Documents/ds/foundations/color.html`, `type.html`, `semantics.html`, `layout.html` (spacing/elevation), `icons.html`, `image.html` — the exact demonstration content, copy, and token references to port. `~/Documents/ds/DESIGN-SYSTEM.md` §2 (color, ramp-reading rule), §3 (typography scale), §4 (spacing/radius/density), §2.6 (elevation), §2.4 (data-viz) for cross-reference. Jira REB-65 (subtask of epic REB-49, the last one — REB-62/63/64 are already merged).

## Global Constraints

- **Yarn only** — never `npm`/`pnpm`.
- **Every value must come from a real token, never a literal.** Web stories read CSS custom properties (`var(--color-accent)`, `var(--space-4)`, etc.) exactly as the source HTML pages do. Mobile stories import and use the actual JS exports from `@industry/tokens` (`color`, `neutral`, `accentRamp`, `success`, `warning`, `danger`, `viz`, `space`, `control`, `radii`, `shadow`, `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `resolveLineHeight`) — never a hardcoded hex string or px number standing in for one. This is REB-65's own explicit requirement ("nunca valores fixos, para nunca dessincronizar da fonte de verdade").
- **No MDX.** Plain `.stories.tsx` files with multiple named story exports per file, matching every existing story file in both packages. Do not introduce `@storybook/addon-docs` MDX authoring as a new pattern in this plan.
- **Files live in `src/foundations/`, not `src/components/`.** These are documentation pages, not components with a public API — they don't get a barrel export from `core/index.ts` or `src/index.ts`.
- **Avoid `noUncheckedIndexedAccess` traps when iterating ramp objects.** `@industry/tokens`'s color-ramp exports (`neutral`, `accentRamp`, `success`, etc.) are precise mapped types over a finite literal-key union — direct literal access (`accentRamp['400']`) is always safe. But if a value is ever passed through a parameter typed as a looser `Record<string, string>`, indexing into it _does_ trigger the flag (verified in a prior plan's final review). Avoid this entirely by iterating with `Object.entries(ramp)` (which always returns `[string, string][]` regardless of the source object's key precision) rather than looping over a separate steps array and indexing — this plan's code samples already do this everywhere a ramp needs iterating.
- **`Icon` names**: kebab-case on web (`"arrow-right"`), PascalCase on mobile (`"ArrowRight"`) — same platform convention already established for REB-64.
- **Mobile Storybook's known SVG-invisibility limitation applies to the Icons foundation page.** The page will register and build successfully; the icons will not be visible in the browser preview (same pre-documented `react-native-web`/React 19 gap as `Icon.stories.tsx` itself). Do not attempt to fix this — it's out of scope and not fixable from this package.
- **`Duotone`'s web demo image must be deterministic** — this package publishes to Chromatic on every push/PR (a prior plan already had to fix a `picsum.photos` nondeterministic-image regression in `Duotone.stories.tsx` for exactly this reason). Reuse the same deterministic gradient technique here, not a remote image.
- **TypeScript strict** — do not weaken this locally. **ESLint `--max-warnings 0`** — every warning is build-breaking.
- **No comments that restate the code.** Only comment a non-obvious invariant. This user's standing preference is stricter than usual — when in doubt, don't write the comment.
- **This closes REB-49.** After this plan merges, REB-49's four subtasks (REB-62, 63, 64, 65) are all done — transition both REB-65 and the REB-49 epic itself to Feito (the prior three plans only closed their own subtask, correctly leaving the epic open since REB-65 remained outstanding).

---

## File Structure

```
packages/design-system/industry-web/src/foundations/
├── Color.stories.tsx
├── Typography.stories.tsx
├── Semantics.stories.tsx
├── SpacingElevation.stories.tsx
├── Icons.stories.tsx
└── Image.stories.tsx

packages/design-system/industry-mobile/src/foundations/
├── Color.stories.tsx
├── Typography.stories.tsx
├── Semantics.stories.tsx
├── SpacingElevation.stories.tsx
├── Icons.stories.tsx
└── Image.stories.tsx

packages/design-system/industry-web/README.md      (modify)
packages/design-system/industry-mobile/README.md   (modify)
```

---

### Task 1: Web foundation docs — Color + Typography

**Files:**

- Create: `packages/design-system/industry-web/src/foundations/Color.stories.tsx`
- Create: `packages/design-system/industry-web/src/foundations/Typography.stories.tsx`

**Interfaces:**

- Consumes: nothing from other tasks — pure CSS custom properties, already globally available via `@industry/tokens/styles.css` (already imported in this package's `.storybook/preview.tsx`).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Color foundation page**

Source: `~/Documents/ds/foundations/color.html`.

`packages/design-system/industry-web/src/foundations/Color.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Color',
};

export default meta;
type Story = StoryObj;

const ROLES = [
  { label: 'bg', value: 'var(--color-bg)' },
  { label: 'surface', value: 'var(--color-surface)' },
  { label: 'text', value: 'var(--color-text)' },
  { label: 'accent', value: 'var(--color-accent)' },
];

const RAMP_STEPS = ['100', '200', '300', '400', '500', '600', '700', '800', '900'];

export const Roles: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
      {ROLES.map((role) => (
        <div key={role.label} style={{ flex: 1 }}>
          <div
            style={{
              height: 32,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid color-mix(in srgb, var(--color-text) 18%, transparent)',
              background: role.value,
            }}
          />
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 4, color: 'var(--color-text)' }}>
            {role.label}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const TonalRamps: Story = {
  render: () => (
    <div>
      {(['neutral', 'accent'] as const).map((prefix) => (
        <div
          key={prefix}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            margin: 'var(--space-2) 0',
          }}
        >
          <span
            style={{
              flex: 'none',
              width: 64,
              fontSize: 10,
              letterSpacing: '0.08em',
              opacity: 0.45,
              color: 'var(--color-text)',
              textTransform: 'capitalize',
            }}
          >
            {prefix}
          </span>
          <div style={{ display: 'flex', gap: 6, flex: 1 }}>
            {RAMP_STEPS.map((step) => (
              <div
                key={step}
                title={step}
                style={{
                  flex: 1,
                  height: 22,
                  borderRadius: 'var(--radius-sm)',
                  background: `var(--color-${prefix}-${step})`,
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Usage: Story = {
  render: () => (
    <p style={{ fontSize: 12, opacity: 0.6, maxWidth: '60ch', color: 'var(--color-text)' }}>
      Nesta base a leitura inverte em relação a um tema claro:{' '}
      <strong>300 é o passo legível</strong> para tipo e ícones sobre o grafite, <code>400</code> é
      o preenchimento (botões, barras, pontos), <code>900</code> tinge uma superfície e 100–200 são
      para tipo sobre esses preenchimentos. 500–700 são os passos de hover e pressed. Prefira um
      passo da rampa a montar um <code>color-mix()</code> improvisado. As três rampas semânticas —
      success, warning e danger — estão em Foundations/Semantics.
    </p>
  ),
};
```

- [ ] **Step 2: Write the Typography foundation page**

Source: `~/Documents/ds/foundations/type.html`.

`packages/design-system/industry-web/src/foundations/Typography.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;
type Story = StoryObj;

const HEADINGS = [
  { tag: 'h1' as const, label: 'H1 · 46' },
  { tag: 'h2' as const, label: 'H2 · 34' },
  { tag: 'h3' as const, label: 'H3 · 26' },
  { tag: 'h4' as const, label: 'H4 · 21' },
  { tag: 'h5' as const, label: 'H5 · 17' },
  { tag: 'h6' as const, label: 'H6 · 13' },
];

export const Headings: Story = {
  render: () => (
    <div>
      {HEADINGS.map(({ tag: Tag, label }) => (
        <div
          key={label}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 'var(--space-3)',
            margin: '4px 0',
          }}
        >
          <span
            style={{
              flex: 'none',
              width: 64,
              fontSize: 10,
              opacity: 0.45,
              color: 'var(--color-text)',
            }}
          >
            {label}
          </span>
          <Tag style={{ margin: 0 }}>Um design system em Barlow Condensed</Tag>
        </div>
      ))}
    </div>
  ),
};

export const Body: Story = {
  render: () => (
    <div style={{ color: 'var(--color-text)' }}>
      <p style={{ fontSize: 17, margin: '6px 0' }}>
        Tokens de design descrevem uma aparência uma vez e deixam cada página herdar.
      </p>
      <p style={{ fontSize: 15, margin: '6px 0' }}>
        The quick brown fox jumps over the lazy dog — corpo de texto no tamanho de leitura.
      </p>
      <p className="text-muted" style={{ fontSize: 13, margin: '6px 0' }}>
        Legendas, metadados e notas de rodapé vivem aqui, um degrau mais quietas que o corpo.
      </p>
    </div>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check both new story groups registered:

```sh
grep -o '"title":"Foundations/Color"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Color" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Typography"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Typography" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/src/foundations/Color.stories.tsx packages/design-system/industry-web/src/foundations/Typography.stories.tsx
git commit -m "docs(industry-web): add Color and Typography foundation pages"
```

---

### Task 2: Web foundation docs — Semantics & data-viz + Spacing & Elevation

**Files:**

- Create: `packages/design-system/industry-web/src/foundations/Semantics.stories.tsx`
- Create: `packages/design-system/industry-web/src/foundations/SpacingElevation.stories.tsx`

**Interfaces:**

- Consumes: nothing from other tasks.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Semantics & data-viz foundation page**

Source: `~/Documents/ds/foundations/semantics.html`.

`packages/design-system/industry-web/src/foundations/Semantics.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Semantics',
};

export default meta;
type Story = StoryObj;

const STEPS = ['200', '300', '400', '700', '900'];
const ROLES = ['success', 'warning', 'danger', 'accent'];

export const SemanticRamps: Story = {
  render: () => (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '92px repeat(5, 1fr)',
          gap: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          opacity: 0.45,
          marginBottom: 'var(--space-2)',
          color: 'var(--color-text)',
        }}
      >
        <span />
        {STEPS.map((step) => (
          <span key={step} style={{ textAlign: 'center' }}>
            {step}
          </span>
        ))}
      </div>
      {ROLES.map((role) => (
        <div
          key={role}
          style={{
            display: 'grid',
            gridTemplateColumns: '92px repeat(5, 1fr)',
            gap: 1,
            marginBottom: 1,
          }}
        >
          <span
            style={{
              fontSize: 12,
              opacity: 0.7,
              color: 'var(--color-text)',
              display: 'flex',
              alignItems: 'center',
              textTransform: 'capitalize',
            }}
          >
            {role}
          </span>
          {STEPS.map((step) => (
            <i
              key={step}
              style={{ height: 40, display: 'block', background: `var(--color-${role}-${step})` }}
            />
          ))}
        </div>
      ))}
    </div>
  ),
};

const BADGES = [
  { label: 'Draft', tone: 'neutral' },
  { label: 'In review', tone: 'accent' },
  { label: 'Resolved', tone: 'success' },
  { label: 'Waiting', tone: 'warning' },
  { label: 'Overdue', tone: 'danger' },
];

export const InUse: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
      {BADGES.map(({ label, tone }) => (
        <span
          key={label}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 10px',
            fontSize: 12,
            border: '1px solid var(--color-divider)',
            color: tone === 'neutral' ? 'var(--color-text)' : `var(--color-${tone}-300)`,
          }}
        >
          {label}
        </span>
      ))}
    </div>
  ),
};

export const DataVizSeries: Story = {
  render: () => (
    <div>
      <div style={{ display: 'flex', gap: 1 }}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <i
            key={n}
            style={{ flex: 1, height: 56, display: 'block', background: `var(--viz-${n})` }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          gap: 1,
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          opacity: 0.45,
          marginTop: 5,
          color: 'var(--color-text)',
        }}
      >
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <span key={n} style={{ flex: 1, textAlign: 'center' }}>
            {n}
          </span>
        ))}
      </div>
    </div>
  ),
};
```

- [ ] **Step 2: Write the Spacing & Elevation foundation page**

Source: `~/Documents/ds/foundations/layout.html` (its real content is spacing/touch/radius/elevation, not a grid-layout demo — see this plan's Architecture note).

`packages/design-system/industry-web/src/foundations/SpacingElevation.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta = {
  title: 'Foundations/Spacing & Elevation',
};

export default meta;
type Story = StoryObj;

const SPACE_STEPS = ['1', '2', '3', '4', '6', '8', '12'];

export const Spacing: Story = {
  render: () => (
    <div>
      {SPACE_STEPS.map((step) => (
        <div
          key={step}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', margin: '6px 0' }}
        >
          <span
            style={{
              flex: 'none',
              width: 84,
              fontSize: 10,
              opacity: 0.45,
              color: 'var(--color-text)',
            }}
          >
            --space-{step}
          </span>
          <div
            style={{
              height: 12,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--color-accent)',
              width: `var(--space-${step})`,
            }}
          />
        </div>
      ))}
    </div>
  ),
};

export const TouchTargets: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'stretch' }}>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 'var(--control-h)',
            border: '1px solid var(--color-divider)',
            background: 'var(--color-surface)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            color: 'var(--color-text)',
          }}
        >
          44px
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: 'var(--color-text)' }}>
          --control-h · --tap
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 'var(--control-h-sm)',
            border: '1px solid var(--color-divider)',
            background: 'var(--color-surface)',
            display: 'grid',
            placeItems: 'center',
            fontSize: 12,
            color: 'var(--color-text)',
          }}
        >
          36px
        </div>
        <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: 'var(--color-text)' }}>
          --control-h-sm · chrome de tabela
        </div>
      </div>
    </div>
  ),
};

export const Radius: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} style={{ flex: 1 }}>
          <div
            style={{
              height: 56,
              border: '1px solid var(--color-divider)',
              background: 'var(--color-surface)',
              borderRadius: `var(--radius-${size})`,
            }}
          />
          <div style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: 'var(--color-text)' }}>
            --radius-{size}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const Elevation: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div
          key={size}
          style={{
            height: 72,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface)',
            boxShadow: `var(--shadow-${size})`,
          }}
        />
      ))}
    </div>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check both story groups registered:

```sh
grep -o '"title":"Foundations/Semantics"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Semantics" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Spacing & Elevation"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Spacing & Elevation" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/src/foundations/Semantics.stories.tsx packages/design-system/industry-web/src/foundations/SpacingElevation.stories.tsx
git commit -m "docs(industry-web): add Semantics and Spacing & Elevation foundation pages"
```

---

### Task 3: Web foundation docs — Icons + Image

**Files:**

- Create: `packages/design-system/industry-web/src/foundations/Icons.stories.tsx`
- Create: `packages/design-system/industry-web/src/foundations/Image.stories.tsx`

**Interfaces:**

- Consumes: `Icon` and `Frame`/`Duotone` from `packages/design-system/industry-web/src/components/core` (already built and merged).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Icons foundation page**

Source: `~/Documents/ds/foundations/icons.html`.

`packages/design-system/industry-web/src/foundations/Icons.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../components/core';

const meta: Meta = {
  title: 'Foundations/Icons',
};

export default meta;
type Story = StoryObj;

const NAMES = [
  'sparkle',
  'layers',
  'circle',
  'arrow-right',
  'search',
  'settings',
  'user',
  'heart',
  'bell',
  'calendar',
  'image',
  'folder',
];

export const LucideSet: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
        gap: 'var(--space-2)',
      }}
    >
      {NAMES.map((name) => (
        <div
          key={name}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 7,
            padding: 'var(--space-2) 0',
            color: 'var(--color-text)',
          }}
        >
          <Icon name={name} size="md" />
          <i style={{ fontStyle: 'normal', fontSize: 10, opacity: 0.55 }}>{name}</i>
        </div>
      ))}
    </div>
  ),
};

export const Usage: Story = {
  render: () => (
    <p style={{ fontSize: 12, opacity: 0.6, maxWidth: '60ch', color: 'var(--color-text)' }}>
      Use Lucide (https://lucide.dev) em <code>stroke-width</code> 1.5 para uma leitura mais fina e
      técnica em todo o sistema — nunca traço grosso.
    </p>
  ),
};
```

- [ ] **Step 2: Write the Image foundation page**

Source: `~/Documents/ds/foundations/image.html`.

`packages/design-system/industry-web/src/foundations/Image.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Frame, Duotone } from '../components/core';

const meta: Meta = {
  title: 'Foundations/Image',
};

export default meta;
type Story = StoryObj;

export const DuotoneTreatment: Story = {
  render: () => (
    <figure style={{ margin: 0, maxWidth: 320 }}>
      <Frame>
        <Duotone>
          <div
            style={{
              width: '100%',
              height: 220,
              background: 'linear-gradient(135deg, #4a6fa5 0%, #e8b04b 50%, #a53f3f 100%)',
            }}
          />
        </Duotone>
      </Frame>
      <figcaption
        style={{
          fontSize: 12,
          marginTop: 'var(--space-1)',
          color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
        }}
      >
        Duotone — fotografias são lavadas no acento, como uma serigrafia.
      </figcaption>
    </figure>
  ),
};

export const Usage: Story = {
  render: () => (
    <p style={{ fontSize: 12, opacity: 0.6, maxWidth: '60ch', color: 'var(--color-text)' }}>
      Toda fotografia de conteúdo passa pelo wrapper <code>Duotone</code> — nunca use uma imagem
      crua, sem tratamento.
    </p>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
yarn workspace @industry/web check-types
yarn workspace @industry/web lint
yarn workspace @industry/web build-storybook
```

Expected: all exit 0. Check both story groups registered:

```sh
grep -o '"title":"Foundations/Icons"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Icons" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Image"' packages/design-system/industry-web/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Image" packages/design-system/industry-web/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each. Visually, `Frame`'s corner marks should render on top of the `Duotone` gradient (not clipped) — this is the exact `<Frame><Duotone>` composition a prior plan fixed a z-index bug for; if the marks look cut off, the running tree is missing that fix (it should already be on `main`).

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/src/foundations/Icons.stories.tsx packages/design-system/industry-web/src/foundations/Image.stories.tsx
git commit -m "docs(industry-web): add Icons and Image foundation pages"
```

---

### Task 4: Mobile foundation docs — Color + Typography

**Files:**

- Create: `packages/design-system/industry-mobile/src/foundations/Color.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/foundations/Typography.stories.tsx`

**Interfaces:**

- Consumes: `color`, `neutral`, `accentRamp`, `fontSize`, `fontWeight`, `fontFamily`, `lineHeight`, `resolveLineHeight` from `@industry/tokens`.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Color foundation page**

`packages/design-system/industry-mobile/src/foundations/Color.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { color, neutral, accentRamp } from '@industry/tokens';

const meta: Meta = {
  title: 'Foundations/Color',
};

export default meta;
type Story = StoryObj;

const ROLES = [
  { label: 'bg', value: color.bg },
  { label: 'surface', value: color.surface },
  { label: 'text', value: color.text },
  { label: 'accent', value: color.accent },
];

export const Roles: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {ROLES.map((role) => (
        <View key={role.label} style={{ flex: 1 }}>
          <View
            style={{
              height: 32,
              borderRadius: 2,
              borderWidth: 1,
              borderColor: color.divider,
              backgroundColor: role.value,
            }}
          />
          <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 4, color: color.text }}>
            {role.label}
          </Text>
        </View>
      ))}
    </View>
  ),
};

function Ramp({ label, ramp }: { label: string; ramp: typeof neutral | typeof accentRamp }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 }}>
      <Text style={{ width: 64, fontSize: 10, opacity: 0.45, color: color.text }}>{label}</Text>
      <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
        {Object.entries(ramp).map(([step, hex]) => (
          <View key={step} style={{ flex: 1, height: 22, borderRadius: 2, backgroundColor: hex }} />
        ))}
      </View>
    </View>
  );
}

export const TonalRamps: Story = {
  render: () => (
    <View>
      <Ramp label="Neutral" ramp={neutral} />
      <Ramp label="Accent" ramp={accentRamp} />
    </View>
  ),
};
```

- [ ] **Step 2: Write the Typography foundation page**

`packages/design-system/industry-mobile/src/foundations/Typography.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import {
  color,
  fontSize,
  fontWeight,
  fontFamily,
  lineHeight,
  resolveLineHeight,
} from '@industry/tokens';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;
type Story = StoryObj;

const HEADINGS: { key: keyof typeof fontSize; label: string }[] = [
  { key: 'h1', label: 'H1 · 46' },
  { key: 'h2', label: 'H2 · 34' },
  { key: 'h3', label: 'H3 · 26' },
  { key: 'h4', label: 'H4 · 21' },
  { key: 'h5', label: 'H5 · 17' },
  { key: 'h6', label: 'H6 · 13' },
];

export const Headings: Story = {
  render: () => (
    <View>
      {HEADINGS.map(({ key, label }) => (
        <View
          key={key}
          style={{ flexDirection: 'row', alignItems: 'baseline', gap: 12, marginVertical: 4 }}
        >
          <Text style={{ width: 64, fontSize: 10, opacity: 0.45, color: color.text }}>{label}</Text>
          <Text
            style={{
              fontFamily: fontFamily.heading,
              fontWeight: fontWeight.heading,
              fontSize: fontSize[key],
              lineHeight: resolveLineHeight(fontSize[key], lineHeight.heading),
              color: color.text,
            }}
          >
            Um design system em Barlow Condensed
          </Text>
        </View>
      ))}
    </View>
  ),
};

export const Body: Story = {
  render: () => (
    <View>
      <Text
        style={{
          fontFamily: fontFamily.body,
          fontWeight: fontWeight.body,
          fontSize: 17,
          color: color.text,
          marginVertical: 6,
        }}
      >
        Tokens de design descrevem uma aparência uma vez e deixam cada página herdar.
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.body,
          fontWeight: fontWeight.body,
          fontSize: 15,
          color: color.text,
          marginVertical: 6,
        }}
      >
        The quick brown fox jumps over the lazy dog — corpo de texto no tamanho de leitura.
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.body,
          fontWeight: fontWeight.body,
          fontSize: 13,
          color: color.text,
          opacity: 0.55,
          marginVertical: 6,
        }}
      >
        Legendas, metadados e notas de rodapé vivem aqui, um degrau mais quietas que o corpo.
      </Text>
    </View>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0. Check both story groups registered:

```sh
grep -o '"title":"Foundations/Color"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Color" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Typography"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Typography" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-mobile/src/foundations/Color.stories.tsx packages/design-system/industry-mobile/src/foundations/Typography.stories.tsx
git commit -m "docs(industry-mobile): add Color and Typography foundation pages"
```

---

### Task 5: Mobile foundation docs — Semantics & data-viz + Spacing & Elevation

**Files:**

- Create: `packages/design-system/industry-mobile/src/foundations/Semantics.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/foundations/SpacingElevation.stories.tsx`

**Interfaces:**

- Consumes: `color`, `success`, `warning`, `danger`, `accentRamp`, `viz`, `space`, `control`, `radii`, `shadow` from `@industry/tokens`.
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Semantics & data-viz foundation page**

`packages/design-system/industry-mobile/src/foundations/Semantics.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { color, success, warning, danger, accentRamp, viz } from '@industry/tokens';

const meta: Meta = {
  title: 'Foundations/Semantics',
};

export default meta;
type Story = StoryObj;

const accentSubset: [string, string][] = [
  ['200', accentRamp['200']],
  ['300', accentRamp['300']],
  ['400', accentRamp['400']],
  ['700', accentRamp['700']],
  ['900', accentRamp['900']],
];

function RampRow({ label, entries }: { label: string; entries: [string, string][] }) {
  return (
    <View style={{ flexDirection: 'row', gap: 1, marginBottom: 1 }}>
      <Text style={{ width: 92, fontSize: 12, opacity: 0.7, color: color.text }}>{label}</Text>
      {entries.map(([step, hex]) => (
        <View key={step} style={{ flex: 1, height: 40, backgroundColor: hex }} />
      ))}
    </View>
  );
}

export const SemanticRamps: Story = {
  render: () => (
    <View>
      <RampRow label="Success" entries={Object.entries(success)} />
      <RampRow label="Warning" entries={Object.entries(warning)} />
      <RampRow label="Danger" entries={Object.entries(danger)} />
      <RampRow label="Accent" entries={accentSubset} />
    </View>
  ),
};

const BADGES: { label: string; hex: string }[] = [
  { label: 'Draft', hex: color.text },
  { label: 'In review', hex: accentRamp['300'] },
  { label: 'Resolved', hex: success['300'] },
  { label: 'Waiting', hex: warning['300'] },
  { label: 'Overdue', hex: danger['300'] },
];

export const InUse: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      {BADGES.map(({ label, hex }) => (
        <View
          key={label}
          style={{
            borderWidth: 1,
            borderColor: color.divider,
            paddingVertical: 4,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ fontSize: 12, color: hex }}>{label}</Text>
        </View>
      ))}
    </View>
  ),
};

export const DataVizSeries: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {Object.entries(viz)
        .filter(([key]) => key !== 'grid')
        .map(([key, hex]) => (
          <View key={key} style={{ flex: 1, height: 56, backgroundColor: hex }} />
        ))}
    </View>
  ),
};
```

- [ ] **Step 2: Write the Spacing & Elevation foundation page**

`packages/design-system/industry-mobile/src/foundations/SpacingElevation.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { color, space, control, radii, shadow } from '@industry/tokens';

const meta: Meta = {
  title: 'Foundations/Spacing & Elevation',
};

export default meta;
type Story = StoryObj;

export const Spacing: Story = {
  render: () => (
    <View>
      {Object.entries(space).map(([step, px]) => (
        <View
          key={step}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 3 }}
        >
          <Text style={{ width: 84, fontSize: 10, opacity: 0.45, color: color.text }}>
            space.{step}
          </Text>
          <View style={{ height: 12, borderRadius: 2, backgroundColor: color.accent, width: px }} />
        </View>
      ))}
    </View>
  ),
};

export const TouchTargets: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: control.height,
            borderWidth: 1,
            borderColor: color.divider,
            backgroundColor: color.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: color.text }}>44px</Text>
        </View>
        <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: color.text }}>
          control.height · control.tap
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            height: control.heightSm,
            borderWidth: 1,
            borderColor: color.divider,
            backgroundColor: color.surface,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 12, color: color.text }}>36px</Text>
        </View>
        <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: color.text }}>
          control.heightSm · chrome de tabela
        </Text>
      </View>
    </View>
  ),
};

export const Radius: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {Object.entries(radii).map(([key, value]) => (
        <View key={key} style={{ flex: 1 }}>
          <View
            style={{
              height: 56,
              borderWidth: 1,
              borderColor: color.divider,
              backgroundColor: color.surface,
              borderRadius: value,
            }}
          />
          <Text style={{ fontSize: 10, opacity: 0.5, marginTop: 6, color: color.text }}>
            radii.{key}
          </Text>
        </View>
      ))}
    </View>
  ),
};

export const Elevation: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <View
          key={size}
          style={{
            flex: 1,
            height: 72,
            borderRadius: radii.md,
            backgroundColor: color.surface,
            ...shadow[size],
          }}
        />
      ))}
    </View>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0. Check both story groups registered:

```sh
grep -o '"title":"Foundations/Semantics"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Semantics" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Spacing & Elevation"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Spacing & Elevation" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-mobile/src/foundations/Semantics.stories.tsx packages/design-system/industry-mobile/src/foundations/SpacingElevation.stories.tsx
git commit -m "docs(industry-mobile): add Semantics and Spacing & Elevation foundation pages"
```

---

### Task 6: Mobile foundation docs — Icons + Image

**Files:**

- Create: `packages/design-system/industry-mobile/src/foundations/Icons.stories.tsx`
- Create: `packages/design-system/industry-mobile/src/foundations/Image.stories.tsx`

**Interfaces:**

- Consumes: `color` from `@industry/tokens`; `Icon`/`IconName` and `Frame`/`Duotone` from `packages/design-system/industry-mobile/src/components/core` (already built and merged).
- Produces: nothing consumed by other tasks.

- [ ] **Step 1: Write the Icons foundation page**

`packages/design-system/industry-mobile/src/foundations/Icons.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { color } from '@industry/tokens';
import { Icon, type IconName } from '../components/core';

const meta: Meta = {
  title: 'Foundations/Icons',
};

export default meta;
type Story = StoryObj;

const NAMES: IconName[] = [
  'Sparkle',
  'Layers',
  'Circle',
  'ArrowRight',
  'Search',
  'Settings',
  'User',
  'Heart',
  'Bell',
  'Calendar',
  'Image',
  'Folder',
];

export const LucideSet: Story = {
  render: () => (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {NAMES.map((name) => (
        <View key={name} style={{ width: 72, alignItems: 'center', gap: 7, paddingVertical: 8 }}>
          <Icon name={name} size="md" color={color.text} />
          <Text style={{ fontSize: 10, opacity: 0.55, color: color.text }}>{name}</Text>
        </View>
      ))}
    </View>
  ),
};
```

- [ ] **Step 2: Write the Image foundation page**

`packages/design-system/industry-mobile/src/foundations/Image.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { View, Text } from 'react-native';
import { color } from '@industry/tokens';
import { Frame, Duotone } from '../components/core';

const meta: Meta = {
  title: 'Foundations/Image',
};

export default meta;
type Story = StoryObj;

export const DuotoneTreatment: Story = {
  render: () => (
    <View style={{ maxWidth: 320 }}>
      <Frame>
        <Duotone>
          <View style={{ width: '100%', height: 220, backgroundColor: color.surface }} />
        </Duotone>
      </Frame>
      <Text style={{ fontSize: 12, marginTop: 4, color: color.text, opacity: 0.55 }}>
        Duotone — fotografias são lavadas no acento, como uma serigrafia.
      </Text>
    </View>
  ),
};
```

- [ ] **Step 3: Build and verify**

Run:

```sh
yarn workspace @industry/mobile check-types
yarn workspace @industry/mobile lint
yarn workspace @industry/mobile build-storybook
```

Expected: all exit 0. Icons will not be visually verifiable in the browser preview (pre-documented limitation) — check only that the page registers:

```sh
grep -o '"title":"Foundations/Icons"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Icons" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
grep -o '"title":"Foundations/Image"' packages/design-system/industry-mobile/storybook-static/index.json 2>/dev/null || grep -rl "Foundations/Image" packages/design-system/industry-mobile/storybook-static/*.js 2>/dev/null | head -1
```

Expected: a match for each.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-mobile/src/foundations/Icons.stories.tsx packages/design-system/industry-mobile/src/foundations/Image.stories.tsx
git commit -m "docs(industry-mobile): add Icons and Image foundation pages"
```

---

### Task 7: Update package READMEs (REB-65 documentation, closes REB-49)

**Files:**

- Modify: `packages/design-system/industry-web/README.md`
- Modify: `packages/design-system/industry-mobile/README.md`

**Interfaces:**

- Consumes: the 6 new story groups from Tasks 1–6 (documents them — must reference real titles).
- Produces: nothing consumed by code — terminal task.

- [ ] **Step 1: Update the web README**

`packages/design-system/industry-web/README.md` — after the "Componentes" section, add a new section:

```markdown
## Documentação de fundação (Storybook)

Seis páginas em `Foundations/*` no Storybook, cada uma renderizando os tokens reais de `@industry/tokens` (nunca um valor fixo): `Foundations/Color` (papéis de cor + rampas tonais), `Foundations/Typography` (escala h1-h6 e corpo), `Foundations/Semantics` (rampas semânticas + data-viz), `Foundations/Spacing & Elevation` (escala de 4px, alvos de toque, raio, sombras), `Foundations/Icons` (o conjunto Lucide via `Icon`), `Foundations/Image` (o tratamento `Duotone`).
```

Update the "Escopo" section's closing sentence to reflect REB-65 being done — replace the sentence naming REB-65 as future work with:

```markdown
As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. Os controles/layout/navegação/feedback/dados (REB-67 a REB-71) chegam em PRs seguintes.
```

- [ ] **Step 2: Update the mobile README**

`packages/design-system/industry-mobile/README.md` — same addition, adapted:

```markdown
## Documentação de fundação (Storybook)

Seis páginas em `Foundations/*` no Storybook, cada uma renderizando os tokens reais de `@industry/tokens` (nunca um valor fixo): `Foundations/Color`, `Foundations/Typography`, `Foundations/Semantics`, `Foundations/Spacing & Elevation`, `Foundations/Icons` (sujeita à mesma limitação de SVG invisível no preview já documentada acima), `Foundations/Image` (o tratamento `Duotone`, aproximação documentada).
```

Update the "Escopo" section's closing sentence the same way:

```markdown
As páginas de fundação no Storybook (REB-65) estão prontas — fecha o épico REB-49. Os controles/layout/navegação/feedback/dados (REB-73 a REB-77) chegam em PRs seguintes.
```

- [ ] **Step 3: Verify no reference drift**

Run:

```sh
cd /Users/kadu/Documents/GitHub/platform
grep -r "title:" packages/design-system/industry-web/src/foundations/*.stories.tsx
grep -r "title:" packages/design-system/industry-mobile/src/foundations/*.stories.tsx
```

Confirm exactly 6 titles per package (`Foundations/Color`, `Foundations/Typography`, `Foundations/Semantics`, `Foundations/Spacing & Elevation`, `Foundations/Icons`, `Foundations/Image`) and that both READMEs' new sections name exactly these 6, no more, no fewer.

- [ ] **Step 4: Commit**

```sh
git add packages/design-system/industry-web/README.md packages/design-system/industry-mobile/README.md
git commit -m "docs(industry): document foundation pages, closes REB-65/REB-49"
```

---

## Self-Review Notes

- **Spec coverage:** all 6 source foundation pages (`color.html`, `type.html`, `semantics.html`, `layout.html`, `icons.html`, `image.html`) ported to both platforms across Tasks 1-6 (3 web tasks, 3 mobile tasks, paired by content). Task 7 documents them and closes out REB-65/REB-49 in the READMEs (Jira transition itself happens after merge, per this session's established pattern).
- **Placeholder scan:** no TBD/TODO; every story has literal, complete render content sourced from the real source HTML pages' copy and structure.
- **Type consistency:** mobile's `Ramp` component (Task 4) types its `ramp` param as `typeof neutral | typeof accentRamp` rather than a loose `Record<string,string>`, specifically to avoid the `noUncheckedIndexedAccess` trap called out in Global Constraints — verified this pattern is used consistently in every mobile story that iterates a ramp (`Object.entries(...)`, never a separate steps array + index). `IconName`/`Icon` imports in Task 6 match `@industry/mobile`'s actual barrel exports (already verified in the prior REB-64 plan's final review). `Frame`/`Duotone` composition in both Task 3 and Task 6's Image page relies on the corner-mark z-index fix already merged in the prior REB-63/64 branch — noted explicitly in Task 3's verification step so an implementer knows what "correct" looks like.
