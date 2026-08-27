import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Frame } from './Frame';

describe('Frame', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Frame>
        <Text>content</Text>
      </Frame>,
    );
    expect(getByText('content')).toBeTruthy();
  });

  it('renders four corner marks by default', () => {
    const { getByTestId } = render(<Frame />);
    expect(getByTestId('frame-corner-tl')).toBeTruthy();
    expect(getByTestId('frame-corner-tr')).toBeTruthy();
    expect(getByTestId('frame-corner-bl')).toBeTruthy();
    expect(getByTestId('frame-corner-br')).toBeTruthy();
  });

  it('omits corner marks when marks is false', () => {
    const { queryByTestId } = render(<Frame marks={false} />);
    expect(queryByTestId('frame-corner-tl')).toBeNull();
    expect(queryByTestId('frame-corner-tr')).toBeNull();
    expect(queryByTestId('frame-corner-bl')).toBeNull();
    expect(queryByTestId('frame-corner-br')).toBeNull();
  });
});
