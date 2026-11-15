export default {
  preset: "ts-jest/presets/js-with-ts-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { useESM: true, diagnostics: false }],
  },
  transformIgnorePatterns: ["node_modules/(?!(.*)\\.mjs$)"],
  testMatch: ["**/tests/**/*.test.ts"],
};
