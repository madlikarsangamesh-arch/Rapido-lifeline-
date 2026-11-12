import { defineConfig } from "vitest/config";
import swc from "unplugin-swc";

export default defineConfig({
  test: {
    globals: true,
    root: "./",
    // Sequential to avoid NestJS app conflicts between test files
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true },
    },
    setupFiles: ["./vitest.setup.ts"],
    // Increase timeout for NestJS app bootstrap
    testTimeout: 30000,
    hookTimeout: 30000,
  },
  plugins: [
    // SWC plugin handles emitDecoratorMetadata and experimentalDecorators
    swc.vite({
      module: { type: "es6" },
      jsc: {
        parser: {
          syntax: "typescript",
          decorators: true,
          dynamicImport: true,
        },
        transform: {
          decoratorMetadata: true,
          legacyDecorator: true,
        },
        target: "es2022",
      },
    }),
  ],
});
