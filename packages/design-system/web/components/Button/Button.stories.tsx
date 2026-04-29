import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary", "ghost", "danger"],
      description: "Estilo visual do botão",
      table: { defaultValue: { summary: "primary" } },
    },
    size: {
      control: "radio",
      options: ["md", "sm"],
      description: "Tamanho do botão",
      table: { defaultValue: { summary: "md" } },
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary", children: "Adicionar" },
};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Cancelar" },
};

export const Ghost: Story = {
  args: { variant: "ghost", size: "sm", children: "Editar" },
};

export const Danger: Story = {
  args: { variant: "danger", size: "sm", children: "Remover" },
};

export const Disabled: Story = {
  args: { variant: "primary", children: "Adicionar", disabled: true },
};
