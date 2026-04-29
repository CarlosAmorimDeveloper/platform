import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "inline"],
      description: "Define o estilo do input, onde 'default' é o estilo padrão e 'inline' é um estilo mais compacto, ideal para edição de títulos ou textos curtos.",
      table: { defaultValue: { summary: "default" } },
    },
    type: {
      control: "select",
      options: ["text", "checkbox", "password", "email", "number"],
    },
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    type: "text",
    variant: "default",
    placeholder: "Digite algo...",
  },
};

export const Inline: Story = {
  args: {
    type: "text",
    variant: "inline",
    placeholder: "Editar título",
    defaultValue: "Título do Design System",
  },
};

export const Checkbox: Story = {
  args: {
    type: "checkbox",
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    type: "text",
    variant: "default",
    placeholder: "Desativado",
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    type: "text",
    variant: "default",
    defaultValue: "Olá, Design System!",
  },
};
