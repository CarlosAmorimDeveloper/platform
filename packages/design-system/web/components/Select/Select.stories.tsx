import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Select } from "./Select";

const OPTIONS = [
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
  { value: "pendente", label: "Pendente" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    error: { control: "boolean" },
    fullWidth: { control: "boolean" },
    helperText: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function SelectWithState(args: any) {
  const [value, setValue] = useState(args.value || "ativo");
  return <Select {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: { label: "Status", options: OPTIONS, value: "ativo" },
};

export const WithError: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: { label: "Status", options: OPTIONS, value: "", error: true, helperText: "Campo obrigatório" },
};

export const Disabled: Story = {
  render: (args) => <SelectWithState {...args} />,
  args: { label: "Status", options: OPTIONS, value: "ativo", disabled: true },
};
