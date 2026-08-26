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
