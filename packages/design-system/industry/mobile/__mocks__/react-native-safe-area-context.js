'use strict';

const React = require('react');

const SafeAreaProvider = ({ children }) => children;
SafeAreaProvider.displayName = 'SafeAreaProvider';

const SafeAreaView = ({ children }) => children;
SafeAreaView.displayName = 'SafeAreaView';

module.exports = {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  SafeAreaInsetsContext: React.createContext({ top: 0, bottom: 0, left: 0, right: 0 }),
  useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
};
