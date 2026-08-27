import { render } from '@testing-library/react';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a single block by default', () => {
    const { container } = render(<Skeleton />);

    expect(container.children).toHaveLength(1);
  });

  it('applies the given height and width to the block', () => {
    const { container } = render(<Skeleton height={80} width={200} />);

    expect(container.firstChild).toHaveStyle({ height: '80px', width: '200px' });
  });

  it('renders N lines when lines is set', () => {
    const { container } = render(<Skeleton lines={3} />);

    expect(container.firstChild?.childNodes).toHaveLength(3);
  });

  it('makes the last line shorter than the others', () => {
    const { container } = render(<Skeleton lines={2} />);
    const lines = container.firstChild?.childNodes as NodeListOf<HTMLElement>;

    expect(lines[0]).toHaveStyle({ width: '100%' });
    expect(lines[1]).toHaveStyle({ width: '62%' });
  });
});
