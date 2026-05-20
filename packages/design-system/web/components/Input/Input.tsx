import type { InputHTMLAttributes } from "react";
import MuiCheckbox from "@mui/material/Checkbox";
import MuiOutlinedInput from "@mui/material/OutlinedInput";

type Variant = "default" | "inline";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  variant?: Variant;
}

const sizeByVariant: Record<Variant, "medium" | "small"> = {
  default: "medium",
  inline: "small",
};

export function Input({
  type = "text",
  variant = "default",
  className,
  value,
  onChange,
  onBlur,
  onKeyDown,
  disabled,
  placeholder,
  autoFocus,
  checked,
  "aria-label": ariaLabel,
  ..._props
}: InputProps) {
  if (type === "checkbox") {
    return (
      <MuiCheckbox
        checked={checked}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        disabled={disabled}
        inputProps={{ "aria-label": ariaLabel }}
        size="small"
        sx={{ padding: 0 }}
      />
    );
  }

  return (
    <MuiOutlinedInput
      type={type}
      size={sizeByVariant[variant]}
      className={className}
      value={value}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
      onBlur={onBlur as React.FocusEventHandler<HTMLInputElement>}
      onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLInputElement>}
      disabled={disabled}
      placeholder={placeholder}
      autoFocus={autoFocus}
      inputProps={{ "aria-label": ariaLabel }}
      sx={{ fontSize: "0.875rem" }}
    />
  );
}
