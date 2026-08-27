import { fireEvent, render, screen } from '@testing-library/react';
import { DataTable } from './DataTable';

const COLUMNS = [
  { key: 'name', label: 'Nome' },
  { key: 'role', label: 'Cargo' },
];
const ROWS = [
  { id: 1, name: 'Ana', role: 'Engenheira' },
  { id: 2, name: 'Bruno', role: 'Designer' },
];

describe('DataTable', () => {
  it('renders column headers and row cells', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} />);

    expect(screen.getByRole('columnheader', { name: 'Nome' })).toBeInTheDocument();
    expect(screen.getByText('Ana')).toBeInTheDocument();
    expect(screen.getByText('Bruno')).toBeInTheDocument();
  });

  it('uses a custom cell renderer when given', () => {
    render(
      <DataTable
        columns={[{ key: 'name', label: 'Nome', render: (row) => `→ ${row.name}` }]}
        rows={ROWS}
      />,
    );

    expect(screen.getByText('→ Ana')).toBeInTheDocument();
  });

  it('renders a non-sortable column as plain text', () => {
    render(<DataTable columns={[{ key: 'name', label: 'Nome', sortable: false }]} rows={ROWS} />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Nome')).toBeInTheDocument();
  });

  it('calls onSort with the column key and reflects aria-sort', () => {
    const onSort = jest.fn();
    render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        sort={{ key: 'name', dir: 'asc' }}
        onSort={onSort}
      />,
    );

    const button = screen.getByRole('button', { name: 'Nome' });
    expect(button).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(button);
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('renders the toolbar when given', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} toolbar={<span>Buscar</span>} />);

    expect(screen.getByText('Buscar')).toBeInTheDocument();
  });

  it('omits pagination when there is only one page', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} pageCount={1} />);

    expect(screen.queryByText('Anterior')).not.toBeInTheDocument();
  });

  it('renders pagination, marks the current page and disables the edges', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} page={1} pageCount={3} />);

    expect(screen.getByRole('button', { name: 'Anterior' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Próxima' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: '1' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows the total record count when given', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} pageCount={2} total={48} />);

    expect(screen.getByText('48 registros')).toBeInTheDocument();
  });

  it('shows the page count when total is not given', () => {
    render(<DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={5} />);

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument();
  });

  it('calls onPage with the requested page', () => {
    const onPage = jest.fn();
    render(<DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={3} onPage={onPage} />);

    fireEvent.click(screen.getByRole('button', { name: '3' }));

    expect(onPage).toHaveBeenCalledWith(3);
  });
});
