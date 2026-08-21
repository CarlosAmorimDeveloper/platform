import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { fontSize, fontWeight, space, vtColors } from '@vuotto/tokens';
import { useTheme } from '../../theme';

export interface FieldProps {
  label?: string;
  /** Mono helper text below the control. */
  hint?: string;
  /** Replaces the hint and turns it red. */
  error?: string;
  required?: boolean;
  children?: ReactNode;
}

export function Field({ label, hint, error, required = false, children }: FieldProps) {
  const { colors } = useTheme();
  const hasMessage = Boolean(error || hint);

  const wiredChild =
    isValidElement(children) && label
      ? cloneElement(children as ReactElement<Record<string, unknown>>, {
          accessibilityLabel:
            (children.props as { accessibilityLabel?: string }).accessibilityLabel ?? label,
        })
      : children;

  return (
    <View style={{ gap: space[2] }}>
      {label && (
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'baseline' }}>
          <Text
            style={{
              fontSize: fontSize.sm,
              fontWeight: fontWeight.medium,
              color: colors.textHeading,
            }}
          >
            {label}
          </Text>
          {required && <Text style={{ fontSize: fontSize.xs, color: vtColors.danger }}>*</Text>}
        </View>
      )}
      {wiredChild}
      {hasMessage && (
        <Text
          style={{ fontSize: fontSize.xs, color: error ? vtColors.danger : colors.textTertiary }}
        >
          {error || hint}
        </Text>
      )}
    </View>
  );
}
