import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { Button } from "@mui/material";
import { Snackbar } from "./Snackbar";

const meta: Meta<typeof Snackbar> = {
  title: "Components/Snackbar",
  component: Snackbar,
  tags: ["autodocs"],
  argTypes: {
    severity: {
      control: "radio",
      options: ["success", "error", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SnackbarWithState(args: Partial<React.ComponentProps<typeof Snackbar>>) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>Mostrar notificação</Button>
      <Snackbar
        message={args.message ?? ""}
        open={open}
        onClose={() => setOpen(false)}
        severity={args.severity}
        duration={args.duration}
        sx={args.sx}
      />
    </>
  );
}

export const Success: Story = {
  render: (args) => <SnackbarWithState {...args} />,
  args: { message: "Operação realizada com sucesso!", severity: "success" },
};

export const Error: Story = {
  render: (args) => <SnackbarWithState {...args} />,
  args: { message: "Ocorreu um erro. Tente novamente.", severity: "error" },
};

export const Warning: Story = {
  render: (args) => <SnackbarWithState {...args} />,
  args: { message: "Atenção: esta ação afeta outros registros.", severity: "warning" },
};

export const Info: Story = {
  render: (args) => <SnackbarWithState {...args} />,
  args: { message: "Atualização disponível. Recarregue a página.", severity: "info" },
};
