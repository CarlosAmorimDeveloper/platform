import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "md" | "sm";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit" | "reset";
}

const base =
  "inline-flex items-center justify-center font-medium cursor-pointer outline-none transition-colors duration-150 focus-visible:outline-2 focus-visible:outline focus-visible:outline-black focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-40";

const sizes: Record<Size, string> = {
  md: "rounded-lg py-2 px-4 text-sm",
  sm: "rounded py-1 px-2 text-xs",
};

const variants: Record<Variant, string> = {
  primary: "bg-black text-white enabled:hover:bg-gray-800",
  secondary:
    "bg-transparent text-gray-600 border border-gray-300 enabled:hover:bg-gray-50",
  ghost:
    "bg-transparent text-gray-700 border border-transparent enabled:hover:bg-gray-100",
  danger:
    "bg-transparent text-rose-600 border border-transparent enabled:hover:bg-rose-50",
};

export function Button({
  type = "button",
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = [base, sizes[size], variants[variant], className]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
