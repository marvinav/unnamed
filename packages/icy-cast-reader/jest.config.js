module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/*.stories.tsx', '!**/{node_modules,.next}/**'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    transformIgnorePatterns: ['/node_modules/'],
    errorOnDeprecated: true,
};
