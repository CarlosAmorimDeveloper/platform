import { fireEvent, render, screen } from '@testing-library/react';
import { Select } from './Select';

const OPTIONS = ['a', 'b'];

describe('Select', () => {
  it('renders every option', async () => {
    render(<Select label="Status" options={OPTIONS} />);

    expect(await screen.findByRole('option', { name: 'a' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'b' })).toBeInTheDocument();
  });

  it('renders object options by their label', async () => {
    render(<Select options={[{ value: 'grid', label: 'Grade' }]} />);

    expect(await screen.findByRole('option', { name: 'Grade' })).toBeInTheDocument();
  });

  it('associates the label with the select via htmlFor/id', async () => {
    render(<Select label="Status" options={OPTIONS} />);

    expect(await screen.findByLabelText('Status')).toBeInTheDocument();
  });

  it('calls onChange when a new option is picked', async () => {
    const onChange = jest.fn();
    render(<Select label="Status" options={OPTIONS} onChange={onChange} />);

    fireEvent.change(await screen.findByLabelText('Status'), { target: { value: 'b' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('renders the error message and marks the field as invalid', async () => {
    render(<Select label="Status" options={OPTIONS} error="Campo obrigatório" />);

    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
    expect(await screen.findByLabelText('Status')).toHaveAttribute('aria-invalid', 'true');
  });

  it('renders the hint when there is no error', async () => {
    render(<Select label="Status" options={OPTIONS} hint="Escolha um status" />);

    expect(await screen.findByText('Escolha um status')).toBeInTheDocument();
  });

  it('disables the select when disabled is set', async () => {
    render(<Select label="Status" options={OPTIONS} disabled />);

    expect(await screen.findByLabelText('Status')).toBeDisabled();
  });
});
