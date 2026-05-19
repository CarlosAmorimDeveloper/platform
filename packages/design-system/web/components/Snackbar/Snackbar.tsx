import { Alert, Snackbar as MuiSnackbar } from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";

type Severity = "success" | "error" | "warning" | "info";

interface SnackbarProps {
  open: boolean;
  message: string;
  severity?: Severity;
  onClose: () => void;
  duration?: number;
  sx?: SxProps<Theme>;
}

export function Snackbar({
  open,
  message,
  severity = "info",
  onClose,
  duration = 6000,
  sx,
}: SnackbarProps) {
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={duration}
      onClose={(_e, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={sx}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: "100%" }}>
        {message}
      </Alert>
    </MuiSnackbar>
  );
}
