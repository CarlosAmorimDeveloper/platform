import React from "react";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
} from "@mui/material";
import type { SxProps, Theme } from "@mui/material/styles";
import type { ReactNode } from "react";

interface MenuItemConfig {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  dividerAfter?: boolean;
}

interface MenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItemConfig[];
  sx?: SxProps<Theme>;
}

export function Menu({ anchorEl, open, onClose, items, sx }: MenuProps) {
  return (
    <MuiMenu anchorEl={anchorEl} open={open} onClose={onClose} sx={sx}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <MuiMenuItem
            disabled={item.disabled}
            onClick={() => {
              item.onClick();
              onClose();
            }}
          >
            {item.icon && <ListItemIcon>{item.icon}</ListItemIcon>}
            <ListItemText>{item.label}</ListItemText>
          </MuiMenuItem>
          {item.dividerAfter && <Divider />}
        </React.Fragment>
      ))}
    </MuiMenu>
  );
}
