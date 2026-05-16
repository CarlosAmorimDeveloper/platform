/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  // Use apenas o preset de ambiente Node — evita que babel.config.js
  // (que referencia metro-react-native-babel-preset) seja carregado
  transform: {
    '^.+\\.js$': [
      'babel-jest',
      {
        configFile: false,
        presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
      },
    ],
  },
};
