/**
 * BABEL CONFIGURATION FOR JEST
 * Suporte a ES modules e React com runtime automático
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
  ],
};
