import { fireEvent, render } from '@testing-library/react-native';
import { Text } from 'react-native';
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
    const { getByText } = render(<DataTable columns={COLUMNS} rows={ROWS} />);

    expect(getByText('Nome')).toBeTruthy();
    expect(getByText('Ana')).toBeTruthy();
    expect(getByText('Bruno')).toBeTruthy();
  });

  it('defaults to no columns and no rows', () => {
    const { queryByText } = render(<DataTable />);

    expect(queryByText('Nome')).toBeNull();
  });

  it('applies a fixed column width instead of flexing', () => {
    const { getByText } = render(
      <DataTable columns={[{ key: 'name', label: 'Nome', width: 120 }]} rows={ROWS} />,
    );

    expect(getByText('Nome')).toBeTruthy();
    expect(getByText('Ana')).toBeTruthy();
  });

  it('falls back to the row index as a key when id is missing', () => {
    const { getByText } = render(
      <DataTable columns={COLUMNS} rows={[{ name: 'Sem id', role: 'Convidado' }]} />,
    );

    expect(getByText('Sem id')).toBeTruthy();
  });

  it('uses a custom cell renderer that returns a plain string', () => {
    const { getByText } = render(
      <DataTable
        columns={[{ key: 'name', label: 'Nome', render: (row) => `→ ${row.name}` }]}
        rows={ROWS}
      />,
    );

    expect(getByText('→ Ana')).toBeTruthy();
  });

  it('uses a custom cell renderer that returns a React element as-is', () => {
    const { getByText } = render(
      <DataTable
        columns={[{ key: 'name', label: 'Nome', render: (row) => <Text>el:{row.name}</Text> }]}
        rows={ROWS}
      />,
    );

    expect(getByText('el:Ana')).toBeTruthy();
  });

  it('renders a non-sortable column as plain text with no button role', () => {
    const { getByText, queryByTestId } = render(
      <DataTable columns={[{ key: 'name', label: 'Nome', sortable: false }]} rows={ROWS} />,
    );

    expect(queryByTestId('sort-header-name')).toBeNull();
    expect(getByText('Nome')).toBeTruthy();
  });

  it('calls onSort with the column key and reflects the selected state', () => {
    const onSort = jest.fn();
    const { getByTestId } = render(
      <DataTable
        columns={COLUMNS}
        rows={ROWS}
        sort={{ key: 'name', dir: 'asc' }}
        onSort={onSort}
      />,
    );

    const header = getByTestId('sort-header-name');
    expect(header.props.accessibilityState).toMatchObject({ selected: true });

    fireEvent.press(header);
    expect(onSort).toHaveBeenCalledWith('name');
  });

  it('shows the descending sort indicator when dir is desc', () => {
    const { getByTestId } = render(
      <DataTable columns={COLUMNS} rows={ROWS} sort={{ key: 'name', dir: 'desc' }} />,
    );

    expect(getByTestId('sort-header-name').props.accessibilityState).toMatchObject({
      selected: true,
    });
  });

  it('renders the toolbar when given', () => {
    const { getByText } = render(
      <DataTable columns={COLUMNS} rows={ROWS} toolbar={<Text>Buscar</Text>} />,
    );

    expect(getByText('Buscar')).toBeTruthy();
  });

  it('omits pagination when there is only one page', () => {
    const { queryByText } = render(<DataTable columns={COLUMNS} rows={ROWS} pageCount={1} />);

    expect(queryByText('Anterior')).toBeNull();
  });

  it('renders pagination, marks the current page and disables the edges', () => {
    const { getByTestId } = render(
      <DataTable columns={COLUMNS} rows={ROWS} page={1} pageCount={3} />,
    );

    expect(getByTestId('pager-btn-Anterior').props.accessibilityState).toMatchObject({
      disabled: true,
    });
    expect(getByTestId('pager-btn-Próxima').props.accessibilityState).toMatchObject({
      disabled: false,
    });
    expect(getByTestId('pager-btn-1').props.accessibilityState).toMatchObject({ selected: true });
  });

  it('shows the total record count when given', () => {
    const { getByText } = render(
      <DataTable columns={COLUMNS} rows={ROWS} pageCount={2} total={48} />,
    );

    expect(getByText('48 registros')).toBeTruthy();
  });

  it('shows the page count when total is not given', () => {
    const { getByText } = render(
      <DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={5} />,
    );

    expect(getByText('Página 2 de 5')).toBeTruthy();
  });

  it('calls onPage with the requested page', () => {
    const onPage = jest.fn();
    const { getByTestId } = render(
      <DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={3} onPage={onPage} />,
    );

    fireEvent.press(getByTestId('pager-btn-3'));

    expect(onPage).toHaveBeenCalledWith(3);
  });

  it('calls onPage with the previous page when Anterior is pressed', () => {
    const onPage = jest.fn();
    const { getByTestId } = render(
      <DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={3} onPage={onPage} />,
    );

    fireEvent.press(getByTestId('pager-btn-Anterior'));

    expect(onPage).toHaveBeenCalledWith(1);
  });

  it('calls onPage with the next page when Próxima is pressed', () => {
    const onPage = jest.fn();
    const { getByTestId } = render(
      <DataTable columns={COLUMNS} rows={ROWS} page={2} pageCount={3} onPage={onPage} />,
    );

    fireEvent.press(getByTestId('pager-btn-Próxima'));

    expect(onPage).toHaveBeenCalledWith(3);
  });
});
