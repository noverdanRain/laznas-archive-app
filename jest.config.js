import { createDefaultPreset } from "ts-jest";

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
export const testEnvironment = "node";
export const setupFiles = ["<rootDir>/.jest/setEnvVars.js"];
export const globalTeardown = "<rootDir>/.jest/teardown.js";
export const testTimeout = 10000; // 10 seconds timeout for all tests
export const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};
export const transform = {
  ...tsJestTransformCfg,
};
