import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  type SelectChangeEvent,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
}

export function Select({
  label,
  value,
  onChange,
  options,
  disabled = false,
  error = false,
  helperText,
  fullWidth = false,
  sx,
}: SelectProps) {
  const labelId = `select-label-${label.replace(/\s+/g, "-").toLowerCase()}`;

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} disabled={disabled} error={error} sx={sx}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <MuiSelect labelId={labelId} value={value} label={label} onChange={handleChange}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
