import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { color, alpha } from '@industry/tokens';
import { Duotone } from './Duotone';

describe('Duotone', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <Duotone>
        <Text>photo</Text>
      </Duotone>,
    );
    expect(getByText('photo')).toBeTruthy();
  });

  it('renders an accent-tinted overlay', () => {
    const { getByTestId } = render(<Duotone />);
    const overlay = getByTestId('duotone-overlay');
    expect(overlay.props.style).toMatchObject({ backgroundColor: alpha(color.accent, 55) });
  });
});
