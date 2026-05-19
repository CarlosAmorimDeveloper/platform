import {
  Checkbox as MuiCheckbox,
  FormControlLabel,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  sx?: SxProps<Theme>;
}

export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  sx,
}: CheckboxProps) {
  return (
    <FormControlLabel
      sx={sx}
      label={label}
      control={
        <MuiCheckbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={(e) => onChange(e.target.checked)}
        />
      }
    />
  );
}
