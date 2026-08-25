import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

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
      style={{
        position: 'absolute',
        width: 11,
        height: 11,
        color: 'color-mix(in srgb, var(--color-text) 55%, transparent)',
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
      {marks ? (
        <>
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
        </>
      ) : null}
      {children}
    </Tag>
  );
}
