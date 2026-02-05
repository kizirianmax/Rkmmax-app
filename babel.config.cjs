/**
 * BABEL CONFIGURATION
 * Configuração para transformação de código nos testes
 */

module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current',
      },
      modules: 'auto', // Auto-detect module system
    }],
    ['@babel/preset-react', {
      runtime: 'automatic',
    }],
  ],
};
