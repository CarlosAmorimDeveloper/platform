import { InputHTMLAttributes } from "react";
import styles from "./Input.module.scss";

type Variant = "default" | "inline";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
}

export function Input({
  type = "text",
  variant = "default",
  className,
  ...props
}: InputProps) {
  const base =
    type === "checkbox"
      ? styles.checkbox
      : styles[variant];

  return (
    <input
      type={type}
      className={`${base}${className ? ` ${className}` : ""}`}
      {...props}
    />
  );
}
