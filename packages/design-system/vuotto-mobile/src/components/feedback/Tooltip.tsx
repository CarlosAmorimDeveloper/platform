import { useEffect, useRef, useState } from 'react';
import { Dimensions, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { fontFamily, fontSize, radii, shadow } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export type TooltipSide = 'top' | 'bottom' | 'left' | 'right';

const OPPOSITE: Record<TooltipSide, TooltipSide> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
};

// RN's `transform` only accepts numeric translate values, not CSS-style
// percentage strings — there's no equivalent to `translate(-50%, -50%)` for
// centering an absolutely-positioned element of unknown size against its
// anchor. The tooltip aligns to the trigger's near edge instead of centering
// on the cross-axis, which is close enough for the short, single-line labels
// this component is meant for.
function positionFor(resolvedSide: TooltipSide): ViewStyle {
  switch (resolvedSide) {
    case 'top':
      return { bottom: '100%', left: 0, marginBottom: 8 };
    case 'bottom':
      return { top: '100%', left: 0, marginTop: 8 };
    case 'left':
      return { right: '100%', top: 0, marginRight: 8 };
    case 'right':
      return { left: '100%', top: 0, marginLeft: 8 };
  }
}

export interface TooltipProps {
  /** Mono text, one short line. Never information required to complete the task. */
  label: string;
  side?: TooltipSide;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

/**
 * RN has no hover or Escape key — long-press substitutes for hover (the
 * touch equivalent of "reveal on sustained contact"), and releasing the
 * press closes it immediately, which already covers the dismiss behavior
 * Escape provides on web. Repositioning is approximate: it measures the
 * *trigger's* position (the tooltip itself hasn't rendered yet at that
 * point) against the window edges with a fixed margin, rather than a true
 * two-pass measure-then-flip like the web version does.
 */
export function Tooltip({ label, side = 'top', children, style }: TooltipProps) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [resolvedSide, setResolvedSide] = useState<TooltipSide>(side);
  const triggerRef = useRef<View>(null);

  useEffect(() => {
    if (!open) {
      setResolvedSide(side);
      return;
    }
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      const { width: winW, height: winH } = Dimensions.get('window');
      let next = side;
      if (side === 'top' && y < 40) next = OPPOSITE.top;
      else if (side === 'bottom' && y + height > winH - 40) next = OPPOSITE.bottom;
      else if (side === 'left' && x < 60) next = OPPOSITE.left;
      else if (side === 'right' && x + width > winW - 60) next = OPPOSITE.right;
      setResolvedSide(next);
    });
  }, [open, side]);

  return (
    <Pressable
      ref={triggerRef}
      onLongPress={() => setOpen(true)}
      onPressOut={() => setOpen(false)}
      delayLongPress={400}
      style={[{ position: 'relative', alignSelf: 'flex-start' }, style]}
    >
      {children}
      {open && (
        <View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: radii.xs,
              backgroundColor: colors.surfaceSolid,
              borderWidth: 1,
              borderColor: colors.lineStrong,
              ...shadow.md,
            },
            positionFor(resolvedSide),
          ]}
        >
          <Text
            style={{
              fontFamily: fontFamily.mono,
              fontSize: fontSize.xs,
              color: colors.textPrimary,
            }}
          >
            {label}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
