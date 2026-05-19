'use strict';

const React = require('react');

const Pressable = jest.fn(function Pressable({
  children,
  onPress,
  disabled,
  testID,
  className,
  accessibilityRole,
  accessibilityState,
}) {
  return React.createElement(
    'div',
    {
      'data-testid': testID,
      'data-classname': className,
      'data-disabled': String(disabled),
      onClick: !disabled ? onPress : undefined,
      role: accessibilityRole,
      'aria-disabled': accessibilityState?.disabled,
    },
    children,
  );
});

const Text = jest.fn(function Text({ children, className }) {
  return React.createElement('span', { 'data-classname': className }, children);
});

module.exports = { Pressable, Text };
