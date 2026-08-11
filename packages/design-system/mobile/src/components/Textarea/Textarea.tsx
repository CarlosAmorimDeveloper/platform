import React from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input';

export interface TextareaProps extends Omit<
  InputProps,
  'multiline' | 'secureTextEntry' | 'showPasswordToggle' | 'keyboardType'
> {
  numberOfLines?: number;
}

export function Textarea({ numberOfLines = 4, contentStyle, ...props }: TextareaProps) {
  // `numberOfLines` on TextInput only affects layout on Android — iOS treats it
  // as a no-op. Setting an explicit `minHeight` on the native input (via
  // `contentStyle`) keeps the field visually taller on both platforms; Android
  // still benefits from `numberOfLines` too.
  return (
    <Input
      {...props}
      multiline
      numberOfLines={numberOfLines}
      contentStyle={[{ minHeight: numberOfLines * 24 }, contentStyle]}
    />
  );
}
