module.exports = {
    testEnvironment: 'jsdom',
    collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}', '!**/*.d.ts', '!**/*.stories.tsx', '!**/{node_modules,.next}/**'],
    setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
    testPathIgnorePatterns: ['<rootDir>/node_modules/'],
    transformIgnorePatterns: ['/node_modules/', '^.+\\.module\\.(css|sass|scss)$'],
    errorOnDeprecated: true,
    // A map from regular expressions to module names that allow to stub out resources with a single module
    moduleNameMapper: {
        '\\.(css|less|scss)$': 'identity-obj-proxy',
    },
};
