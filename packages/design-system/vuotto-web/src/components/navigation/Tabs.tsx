import { forwardRef, useRef } from 'react';
import type { HTMLAttributes, CSSProperties, KeyboardEvent } from 'react';
import { Icon } from '../core/Icon';

export interface TabItem {
  value: string;
  label: string;
  icon?: string;
  count?: number | string;
  /** id of the tab panel this tab controls, wiring `aria-controls`. Omit if the consumer isn't rendering a matching panel. */
  panelId?: string;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'onChange'> {
  tabs?: (string | TabItem)[];
  value?: string;
  onChange?: (value: string) => void;
  style?: CSSProperties;
}

/**
 * Underlined section switcher. `role="tablist"` + roving tabindex, same
 * pattern as `SegmentedControl` — plain `<button>`s don't get arrow-key
 * behaviour for free. Overflows with horizontal scroll instead of wrapping,
 * so a long tab strip stays one line on narrow screens.
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs = [], value, onChange, style, ...rest },
  ref,
) {
  const normalized = tabs.map((t) => (typeof t === 'string' ? { value: t, label: t } : t));
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const select = (index: number) => {
    const tab = normalized[index];
    if (!tab) return;
    onChange?.(tab.value);
    buttonRefs.current[index]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = normalized.findIndex((t) => t.value === value);
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      select((currentIndex + 1 + normalized.length) % normalized.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      select((currentIndex - 1 + normalized.length) % normalized.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      select(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      select(normalized.length - 1);
    }
  };

  return (
    <div
      ref={ref}
      role="tablist"
      data-vt-scroll-x
      onKeyDown={onKeyDown}
      style={{
        display: 'flex',
        gap: 'var(--space-6)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        borderBottom: '1px solid var(--line-hairline)',
        ...style,
      }}
      {...rest}
    >
      {normalized.map((tab, index) => {
        const on = value === tab.value;
        return (
          <button
            key={tab.value}
            ref={(node) => {
              buttonRefs.current[index] = node;
            }}
            id={`tab-${tab.value}`}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={tab.panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => select(index)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              flex: '0 0 auto',
              padding: '0 0 12px',
              background: 'none',
              border: 'none',
              borderBottom: '1px solid ' + (on ? 'var(--vt-white)' : 'transparent'),
              marginBottom: -1,
              color: on ? 'var(--text-heading)' : 'var(--text-secondary)',
              font: 'var(--weight-medium) var(--text-md)/1 var(--font-sans)',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'color var(--motion-hover), border-color var(--motion-hover)',
            }}
          >
            {tab.icon && <Icon name={tab.icon} size="sm" />}
            {tab.label}
            {tab.count != null && (
              <span style={{ font: 'var(--label-mono)', color: 'var(--text-tertiary)' }}>
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
});
