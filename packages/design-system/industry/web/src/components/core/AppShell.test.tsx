import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('renders the sidebar, header and page body', () => {
    render(
      <AppShell sidebar={<nav>Sidebar</nav>} header={<span>Header</span>}>
        <p>Body</p>
      </AppShell>,
    );

    expect(screen.getByText('Sidebar')).toBeInTheDocument();
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('omits the header row when none is given', () => {
    render(<AppShell>Body only</AppShell>);

    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
  });
});
