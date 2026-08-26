import { render, screen } from '../../../../test-utils';
import { TicketMetaRow } from './TicketMetaRow';

describe('TicketMetaRow', () => {
  it('renders creator name', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName={null} editing={false} />,
    );
    expect(screen.getByText('Criado por: Alice')).toBeTruthy();
  });

  it('renders formatted date when createdAt is provided', () => {
    const date = new Date(2024, 0, 15, 14, 30);
    render(
      <TicketMetaRow creatorName="Alice" createdAt={date} assigneeName={null} editing={false} />,
    );
    const dateEl = screen.getByText(/Em:/);
    expect(dateEl).toBeTruthy();
    expect(dateEl.props.children.join('')).toContain('15');
  });

  it('does not render date when createdAt is null', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName={null} editing={false} />,
    );
    expect(screen.queryByText(/Em:/)).toBeNull();
  });

  it('renders assigneeName when not editing', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName="Bob" editing={false} />,
    );
    expect(screen.getByText('Responsável: Bob')).toBeTruthy();
  });

  it('hides assigneeName when editing=true', () => {
    render(
      <TicketMetaRow creatorName="Alice" createdAt={null} assigneeName="Bob" editing={true} />,
    );
    expect(screen.queryByText('Responsável: Bob')).toBeNull();
  });
});
