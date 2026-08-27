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
