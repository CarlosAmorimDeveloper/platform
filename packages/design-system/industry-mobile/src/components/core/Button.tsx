import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import {
  color,
  accentRamp,
  danger,
  alpha,
  control,
  fontFamily,
  fontWeight,
} from '@industry/tokens';
import { BlueprintMarks } from './BlueprintMarks';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'md' | 'sm';

export interface ButtonProps extends Omit<PressableProps, 'style' | 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  framed?: boolean;
  iconOnly?: boolean;
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

function skin(variant: ButtonVariant, pressed: boolean): { container: ViewStyle; text: TextStyle } {
  if (variant === 'primary') {
    return {
      container: {
        backgroundColor: pressed ? accentRamp['500'] : color.accent,
        borderColor: pressed ? accentRamp['500'] : color.accent,
      },
      text: { color: color.bg },
    };
  }
  if (variant === 'ghost') {
    return {
      container: {
        backgroundColor: pressed ? alpha(color.accent, 22) : 'transparent',
        borderColor: 'transparent',
      },
      text: { color: accentRamp['300'] },
    };
  }
  if (variant === 'danger') {
    return {
      container: {
        backgroundColor: pressed ? alpha(danger['400'], 16) : 'transparent',
        borderColor: alpha(danger['400'], 45),
      },
      text: { color: danger['300'] },
    };
  }
  return {
    container: {
      backgroundColor: pressed ? alpha(color.text, 14) : 'transparent',
      borderColor: color.divider,
    },
    text: { color: color.text },
  };
}

export function Button({
  variant = 'secondary',
  size = 'md',
  block,
  framed,
  iconOnly,
  disabled,
  onPressIn,
  onPressOut,
  children,
  style,
  ...rest
}: ButtonProps) {
  const [pressed, setPressed] = useState(false);
  const height = size === 'sm' ? control.heightSm : control.height;
  const { container, text } = skin(variant, pressed && !disabled);

  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e: GestureResponderEvent) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e: GestureResponderEvent) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[
        {
          position: framed ? 'relative' : undefined,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: height,
          width: iconOnly ? height : block ? '100%' : undefined,
          paddingHorizontal: iconOnly ? 0 : size === 'sm' ? 12 : 16,
          borderWidth: 1,
          borderRadius: 0,
          opacity: disabled ? 0.45 : 1,
        },
        container,
        style,
      ]}
      {...rest}
    >
      {framed ? <BlueprintMarks /> : null}
      {typeof children === 'string' ? (
        <Text
          style={[
            {
              fontFamily: fontFamily.heading,
              fontWeight: fontWeight.heading,
              fontSize: size === 'sm' ? 14 : 15,
            },
            text,
          ]}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
