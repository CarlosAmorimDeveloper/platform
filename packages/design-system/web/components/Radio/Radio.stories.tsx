import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { Radio } from "./Radio";

const OPTIONS = [
  { value: "email", label: "E-mail" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
];

const meta: Meta<typeof Radio> = {
  title: "Components/Radio",
  component: Radio,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    row: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

function RadioWithState(args: Partial<React.ComponentProps<typeof Radio>>) {
  const [value, setValue] = useState(args.value ?? "");
  return (
    <Radio
      label={args.label ?? ""}
      value={value}
      onChange={setValue}
      options={args.options ?? []}
      disabled={args.disabled}
      row={args.row}
      sx={args.sx}
    />
  );
}

export const Default: Story = {
  render: (args) => <RadioWithState {...args} />,
  args: { label: "Notificações", options: OPTIONS, value: "email" },
};

export const Row: Story = {
  render: (args) => <RadioWithState {...args} />,
  args: { label: "Notificações", options: OPTIONS, value: "email", row: true },
};

export const Disabled: Story = {
  render: (args) => <RadioWithState {...args} />,
  args: { label: "Notificações", options: OPTIONS, value: "email", disabled: true },
};
