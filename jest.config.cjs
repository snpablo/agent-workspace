const common = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.base.json' }],
  },
  moduleNameMapper: {
    '^@awp/types$': '<rootDir>/packages/types/src',
    '^@awp/loader$': '<rootDir>/packages/loader/src',
    '^@awp/tools$': '<rootDir>/packages/tools/src',
    '^@awp/runtime$': '<rootDir>/packages/runtime/src',
    '^@awp/schemas$': '<rootDir>/packages/schemas',
  },
};

module.exports = {
  projects: [
    {
      ...common,
      displayName: 'loader',
      testMatch: ['<rootDir>/packages/loader/__tests__/**/*.test.ts'],
    },
    {
      ...common,
      displayName: 'runtime',
      testMatch: ['<rootDir>/packages/runtime/__tests__/**/*.test.ts'],
    },
    {
      ...common,
      displayName: 'tools',
      testMatch: ['<rootDir>/packages/tools/__tests__/**/*.test.ts'],
    },
  ],
};
