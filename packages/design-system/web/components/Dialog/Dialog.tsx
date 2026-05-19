import {
  Button,
  Dialog as MuiDialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  sx?: SxProps<Theme>;
}

export function Dialog({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  destructive = false,
  sx,
}: DialogProps) {
  return (
    <MuiDialog open={open} onClose={onClose} sx={sx}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{children}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{cancelLabel}</Button>
        {onConfirm && (
          <Button
            onClick={onConfirm}
            color={destructive ? "error" : "primary"}
            variant="contained"
          >
            {confirmLabel}
          </Button>
        )}
      </DialogActions>
    </MuiDialog>
  );
}
