const { defaults } = require("jest-config");

module.exports = {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "node",
  sandboxInjectedGlobals: ["Math"],
  moduleFileExtensions: [...defaults.moduleFileExtensions, "ts", "tsx"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],

  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  reporters: [
    "default",
    [
      "jest-junit",
      {
        suiteName: "jest tests",
        outputDirectory: "tests/test-reports",
        outputName: "report.xml",
        includeShortConsoleOutput: true,
        suiteNameTemplate: "{filename}",
        reportTestSuiteErrors: true,
      },
    ],
  ],
};
