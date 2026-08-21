import type { HTMLAttributes, CSSProperties } from 'react';

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
      style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', ...style }}
      {...rest}
    >
      {items.map((it, i) => {
        const last = i === items.length - 1;
        const textStyle: CSSProperties = {
          font: 'var(--weight-regular) var(--text-sm)/1 var(--font-mono)',
          color: last ? 'var(--text-heading)' : 'var(--text-tertiary)',
        };
        return (
          <span key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {last ? (
              <span aria-current="page" style={textStyle}>
                {it.label}
              </span>
            ) : (
              <a href={it.href || '#'} style={textStyle}>
                {it.label}
              </a>
            )}
            {!last && (
              <span style={{ font: 'var(--label-mono)', color: 'var(--text-tertiary)' }}>/</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
