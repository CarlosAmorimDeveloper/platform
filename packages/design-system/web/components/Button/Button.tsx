import type { ButtonHTMLAttributes } from 'react';
import MuiButton from '@mui/material/Button';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  type?: 'button' | 'submit' | 'reset';
}

const muiVariant: Record<Variant, 'contained' | 'outlined' | 'text'> = {
  primary: 'contained',
  secondary: 'outlined',
  ghost: 'text',
  danger: 'text',
};

const muiSize: Record<Size, 'medium' | 'small'> = {
  md: 'medium',
  sm: 'small',
};

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <MuiButton
      type={type}
      variant={muiVariant[variant]}
      size={muiSize[size]}
      className={className}
      disabled={disabled}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      color={variant === 'danger' ? 'error' : 'primary'}
      {...(props as object)}
    >
      {children}
    </MuiButton>
  );
}
