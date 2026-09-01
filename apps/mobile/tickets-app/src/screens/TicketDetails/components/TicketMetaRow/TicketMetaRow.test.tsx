import { render, screen } from '../../../../test-utils';
import { TicketMetaRow } from './TicketMetaRow';

describe('TicketMetaRow', () => {
  it('renders creator name under a "Criador" label', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName={null} editing={false} />,
    );
    expect(screen.getByText('Criador')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
  });

  it('renders formatted date under an "Abertura" label when createdAt is provided', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    render(
      <TicketMetaRow creatorName="Alice" createdAt={date} assigneeName={null} editing={false} />,
    );
    expect(screen.getByText('Abertura')).toBeTruthy();
    const dateEl = screen.getByText(/15\/01\/2024/);
    expect(dateEl).toBeTruthy();
  });

  it('does not render the "Abertura" cell when createdAt is null', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName={null} editing={false} />,
    );
    expect(screen.queryByText('Abertura')).toBeNull();
  });

  it('renders assigneeName under a "Responsável" label when not editing', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName="Bob" editing={false} />,
    );
    expect(screen.getByText('Responsável')).toBeTruthy();
    expect(screen.getByText('Bob')).toBeTruthy();
  });

  it('hides the "Responsável" cell when editing=true', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName="Bob" editing={true} />,
    );
    expect(screen.queryByText('Responsável')).toBeNull();
  });
});
