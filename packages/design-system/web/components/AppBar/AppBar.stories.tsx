import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@mui/material";
import { AppBar } from "./AppBar";

const meta: Meta<typeof AppBar> = {
  title: "Components/AppBar",
  component: AppBar,
  tags: ["autodocs"],
  argTypes: {
    position: {
      control: "radio",
      options: ["static", "sticky", "fixed"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { title: "Minha Aplicação" },
};

export const WithMenuButton: Story = {
  args: {
    title: "Dashboard",
    onMenuClick: () => alert("Menu clicado"),
  },
};

export const WithActions: Story = {
  args: {
    title: "Dashboard",
    onMenuClick: () => alert("Menu clicado"),
    actions: (
      <Button color="inherit" variant="outlined" size="small" sx={{ borderColor: "rgba(255,255,255,0.5)" }}>
        Login
      </Button>
    ),
  },
};
