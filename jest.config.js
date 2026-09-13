const expoPreset = require("jest-expo/jest-preset");

/** @type {import('jest').Config} */
module.exports = {
  ...expoPreset,
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  moduleNameMapper: {
    ...(expoPreset.moduleNameMapper ?? {}),
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  clearMocks: true,
};
