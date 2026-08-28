import type { CSSProperties, HTMLAttributes } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

export interface BreadcrumbsProps extends Omit<HTMLAttributes<HTMLElement>, 'style'> {
  items?: Crumb[];
  style?: CSSProperties;
}

export function Breadcrumbs({ items = [], style, ...rest }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        flexWrap: 'wrap',
        ...style,
      }}
      {...rest}
    >
      {items.map((item, index) => {
        const last = index === items.length - 1;
        const textStyle: CSSProperties = {
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          color: last
            ? 'var(--color-text)'
            : 'color-mix(in srgb, var(--color-text) 60%, transparent)',
        };
        return (
          <span
            key={item.label}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {last ? (
              <span aria-current="page" style={textStyle}>
                {item.label}
              </span>
            ) : (
              <a href={item.href ?? '#'} style={{ ...textStyle, textDecoration: 'none' }}>
                {item.label}
              </a>
            )}
            {!last ? (
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  color: 'color-mix(in srgb, var(--color-text) 40%, transparent)',
                }}
              >
                /
              </span>
            ) : null}
          </span>
        );
      })}
    </nav>
  );
}
