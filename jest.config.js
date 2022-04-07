module.exports = {
  moduleFileExtensions: ['js', 'ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tests/tsconfig.json',
    },
  },
  testMatch: ['**/tests/**/*.test.ts'],
  preset: 'ts-jest',
  moduleDirectories: ['node_modules', 'src'],
};
