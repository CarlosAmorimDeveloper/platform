type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'sm';

const VARIANT_CONTAINER: Record<Variant, string> = {
  primary:
    'bg-primary-500 border-2 border-primary-500 active:bg-primary-600 active:border-primary-600',
  secondary: 'bg-transparent border-2 border-primary-500 active:bg-primary-50',
  ghost: 'bg-transparent active:bg-primary-50',
  danger: 'bg-transparent active:bg-error-50',
};

const VARIANT_TEXT: Record<Variant, string> = {
  primary: 'text-neutral-0',
  secondary: 'text-primary-500',
  ghost: 'text-primary-500',
  danger: 'text-error-500',
};

const SIZE_CONTAINER: Record<Size, string> = {
  md: 'px-4 py-2 rounded-md',
  sm: 'px-3 py-1 rounded-sm',
};

const SIZE_TEXT: Record<Size, string> = {
  md: 'text-base',
  sm: 'text-sm',
};

export function getContainerClasses(
  variant: Variant,
  size: Size,
  disabled: boolean,
  className: string,
): string {
  return [
    'items-center justify-center flex-row',
    VARIANT_CONTAINER[variant],
    SIZE_CONTAINER[size],
    disabled && 'opacity-50',
    className,
  ]
    .filter(Boolean)
    .join(' ');
}

export function getTextClasses(variant: Variant, size: Size): string {
  return ['font-medium', VARIANT_TEXT[variant], SIZE_TEXT[size]].join(' ');
}
