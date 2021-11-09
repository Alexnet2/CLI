const { compilerOptions } = require("./tsconfig.json");
const { pathsToModuleNameMapper } = require("ts-jest/utils");
import path from "path";

export default {
  clearMocks: true,
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve("src"),
  }),
  preset: "ts-jest",
  // verbose: true,
  setupFiles:[`./src/test/setupFile.ts`]
};
