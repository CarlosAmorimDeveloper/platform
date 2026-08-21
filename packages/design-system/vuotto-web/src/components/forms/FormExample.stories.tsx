import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Meta, StoryObj } from '@storybook/react';
import { Field } from './Field';
import { Input } from './Input';
import { Checkbox } from './Checkbox';
import { Button } from '../core/Button';

const meta: Meta = {
  title: 'Forms/React Hook Form',
};

export default meta;
type Story = StoryObj;

// Schema-driven validation (REB-23): every message shown in the UI comes
// from this schema, not from hand-rolled onChange checks in the component.
const schema = z.object({
  name: z.string().min(1, 'Informe seu nome'),
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  agreed: z.literal(true, { error: 'Você precisa aceitar os termos' }),
});

type FormValues = z.infer<typeof schema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', agreed: false as unknown as true },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));
  });

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}
    >
      {/* Input is a real forwardRef control, so register() wires straight
          onto the native <input> — no Controller needed here. */}
      <Field label="Nome" error={errors.name?.message}>
        <Input placeholder="Seu nome" {...register('name')} />
      </Field>

      <Field label="E-mail" error={errors.email?.message}>
        <Input type="email" placeholder="voce@empresa.com" {...register('email')} />
      </Field>

      {/* Checkbox is controlled (`checked` prop), so it needs Controller —
          register() alone doesn't feed a `checked` value back in. */}
      <Controller
        control={control}
        name="agreed"
        render={({ field }) => (
          <Checkbox
            label="Aceito os termos de uso"
            checked={field.value === true}
            onChange={(e) => field.onChange(e.target.checked)}
          />
        )}
      />
      {errors.agreed && (
        <span
          style={{
            font: 'var(--weight-regular) var(--text-xs)/1.45 var(--font-mono)',
            color: 'var(--vt-danger)',
          }}
        >
          {errors.agreed.message}
        </span>
      )}

      <Button type="submit" loading={isSubmitting}>
        {isSubmitSuccessful ? 'Enviado' : 'Criar conta'}
      </Button>
    </form>
  );
}

export const SignUp: Story = {
  render: () => <SignupForm />,
};
