import { InputHTMLAttributes } from "react";

type Variant = "default" | "inline";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
}

const variants: Record<Variant, string> = {
  default:
    "rounded-lg border border-gray-300 py-2 px-3 text-sm leading-5 text-gray-800 outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-gray-400 focus:border-black focus:ring-2 focus:ring-black/10 disabled:cursor-not-allowed disabled:opacity-50",
  inline:
    "rounded border border-black py-0.5 px-2 text-sm leading-5 text-gray-800 outline-none transition-shadow duration-150 focus:ring-2 focus:ring-black/15 disabled:cursor-not-allowed disabled:opacity-50",
};

const checkboxClasses = "w-4 h-4 cursor-pointer accent-black";

export function Input({
  type = "text",
  variant = "default",
  className,
  ...props
}: InputProps) {
  const base = type === "checkbox" ? checkboxClasses : variants[variant];

  return (
    <input
      type={type}
      className={[base, className].filter(Boolean).join(" ")}
      {...props}
    />
  );
}
