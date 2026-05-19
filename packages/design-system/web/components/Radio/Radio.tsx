import { useId } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio as MuiRadio,
  RadioGroup,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

interface RadioOption {
  value: string;
  label: string;
}

interface RadioProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  disabled?: boolean;
  row?: boolean;
  sx?: SxProps<Theme>;
}

export function Radio({
  label,
  value,
  onChange,
  options,
  disabled = false,
  row = false,
  sx,
}: RadioProps) {
  const groupId = useId();
  return (
    <FormControl disabled={disabled} sx={sx}>
      <FormLabel id={groupId}>{label}</FormLabel>
      <RadioGroup
        aria-labelledby={groupId}
        value={value}
        row={row}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            label={option.label}
            control={<MuiRadio />}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
}
