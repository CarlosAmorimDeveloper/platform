import React from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input';

export interface TextareaProps extends Omit<
  InputProps,
  'multiline' | 'secureTextEntry' | 'showPasswordToggle' | 'keyboardType'
> {
  numberOfLines?: number;
}

export function Textarea({ numberOfLines = 4, ...props }: TextareaProps) {
  return <Input {...props} multiline numberOfLines={numberOfLines} />;
}
