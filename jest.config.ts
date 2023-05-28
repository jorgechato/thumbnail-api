export default {
    clearMocks: true,
    collectCoverageFrom: ['**/*.(t|j)s'],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    moduleDirectories: ['node_modules', '<rootDir>'],
    moduleFileExtensions: ['js', 'json', 'ts'],
    roots: ['src'],
    setupFiles: ['dotenv/config'],
    testRegex: ['.*\\.spec\\.ts$'],
    transform: {
      '^.+\\.(t|j)s$': 'ts-jest',
    },
  };