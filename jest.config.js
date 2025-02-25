module.exports = {
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { configFile: "./babel.config.jest.js" }],
  },
  transformIgnorePatterns: ["/node_modules/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
