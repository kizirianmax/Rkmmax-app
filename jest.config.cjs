/**
 * JEST CONFIGURATION - COM SUPORTE A ES MODULES
 * 
 * Configuração com projetos separados:
 * - jsdom: Para componentes React (testes em src/)
 * - node: Para testes de automação (testes em src/automation/)
 */

module.exports = {
  // ============================================
  // PROJETOS SEPARADOS POR AMBIENTE
  // ============================================
  projects: [
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/src/**/*.test.{js,jsx}',
        '<rootDir>/src/**/__tests__/**/*.{js,jsx}',
      ],
      testPathIgnorePatterns: [
        '/node_modules/',
        '/build/',
        '/.vercel/',
        '<rootDir>/src/automation/', // Excluir automation do jsdom
      ],
      transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: './babel.config.cjs' }]
      },
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
      transformIgnorePatterns: [
        'node_modules/(?!(recharts|victory|d3-.*|internmap|delaunay-triangulate|robust-predicates)/)',
      ],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
    },
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/src/automation/**/*.test.js',
        '<rootDir>/src/automation/**/__tests__/**/*.js',
      ],
      transform: {
        '^.+\\.(js|jsx|mjs)$': ['babel-jest', { configFile: './babel.config.cjs' }]
      },
      setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
      clearMocks: true,
      resetMocks: true,
      restoreMocks: true,
    }
  ],
  
  // ============================================
  // TIMEOUT E PERFORMANCE
  // ============================================
  testTimeout: 10000, // 10 segundos
  maxWorkers: '50%', // Usar 50% dos CPUs
  forceExit: true, // Sair após testes (evita hang)
  detectOpenHandles: true, // Detectar handles abertos
  
  // ============================================
  // COBERTURA
  // ============================================
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**'
  ],
  coverageThreshold: {
    global: {
      statements: 5,
      branches: 5,
      functions: 5,
      lines: 5
    }
  },
  
  // ============================================
  // CACHE
  // ============================================
  cache: true,
  cacheDirectory: '<rootDir>/.jest-cache',
  
  // ============================================
  // REPORTERS
  // ============================================
  reporters: ['default'],
  
  // ============================================
  // VERBOSE
  // ============================================
  verbose: true,
};

