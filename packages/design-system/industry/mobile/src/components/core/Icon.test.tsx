import type { ReactElement } from 'react';
import { render } from '@testing-library/react-native';
import { Svg } from 'react-native-svg';
import { Icon } from './Icon';

function renderedSvg(element: ReactElement) {
  const { UNSAFE_getByType } = render(element);
  return UNSAFE_getByType(Svg);
}

describe('Icon', () => {
  it('renders without crashing for a known icon name', () => {
    expect(renderedSvg(<Icon name="Check" color="#000000" />)).toBeTruthy();
  });

  it('is accessible with the given accessibilityLabel', () => {
    const svg = renderedSvg(<Icon name="Check" color="#000000" accessibilityLabel="check icon" />);
    expect(svg.props.accessible).toBe(true);
    expect(svg.props.accessibilityLabel).toBe('check icon');
  });

  it('is not accessible when no accessibilityLabel is given', () => {
    const svg = renderedSvg(<Icon name="Check" color="#000000" />);
    expect(svg.props.accessible).toBe(false);
  });

  it('maps named sizes to pixel values', () => {
    const svg = renderedSvg(<Icon name="Check" color="#000000" size="lg" />);
    expect(svg.props.width).toBe(24);
    expect(svg.props.height).toBe(24);
  });

  it('accepts a numeric size directly', () => {
    const svg = renderedSvg(<Icon name="Check" color="#000000" size={32} />);
    expect(svg.props.width).toBe(32);
  });

  it('passes color and strokeWidth through to the underlying icon', () => {
    const svg = renderedSvg(<Icon name="Check" color="#123456" strokeWidth={2} />);
    expect(svg.props.stroke).toBe('#123456');
    expect(svg.props.strokeWidth).toBe(2);
  });
});
