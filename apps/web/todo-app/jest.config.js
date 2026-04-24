const path = require("path");

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: { jsx: "react-jsx" } }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^react$": path.resolve(__dirname, "../../../node_modules/react"),
    "^react-dom$": path.resolve(__dirname, "../../../node_modules/react-dom"),
    "^react-dom/(.*)$": path.resolve(__dirname, "../../../node_modules/react-dom/$1"),
    "^react/(.*)$": path.resolve(__dirname, "../../../node_modules/react/$1"),
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};

module.exports = config;
