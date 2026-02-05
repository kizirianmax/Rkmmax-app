/**
 * BABEL CONFIGURATION FOR JEST
 * Permite que Jest entenda módulos ES6
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    '@babel/preset-react',
  ],
};
