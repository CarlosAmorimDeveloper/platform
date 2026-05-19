import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Menu } from "./Menu";

const meta: Meta<typeof Menu> = {
  title: "Components/Menu",
  component: Menu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

function MenuWithState(args: Partial<React.ComponentProps<typeof Menu>>) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  return (
    <>
      <Button variant="outlined" onClick={(e) => setAnchorEl(e.currentTarget)}>
        Abrir menu
      </Button>
      <Menu
        items={args.items ?? []}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        sx={args.sx}
      />
    </>
  );
}

export const Default: Story = {
  render: (args) => <MenuWithState {...args} />,
  args: {
    items: [
      { label: "Editar", onClick: () => alert("Editar"), icon: <EditIcon fontSize="small" /> },
      { label: "Copiar", onClick: () => alert("Copiar"), icon: <ContentCopyIcon fontSize="small" />, dividerAfter: true },
      { label: "Excluir", onClick: () => alert("Excluir"), icon: <DeleteIcon fontSize="small" /> },
    ],
  },
};

export const WithDisabledItem: Story = {
  render: (args) => <MenuWithState {...args} />,
  args: {
    items: [
      { label: "Editar", onClick: () => alert("Editar"), icon: <EditIcon fontSize="small" /> },
      { label: "Publicar", onClick: () => alert("Publicar"), disabled: true },
      { label: "Excluir", onClick: () => alert("Excluir"), icon: <DeleteIcon fontSize="small" /> },
    ],
  },
};
