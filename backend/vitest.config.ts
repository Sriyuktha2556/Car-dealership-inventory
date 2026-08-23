import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["src/server.ts", "src/db/migrate.ts", "src/db/seed.ts"]
    },
    testTimeout: 15000,
    // Run test files sequentially: they share one Postgres test database
    // and inventory/purchase tests depend on deterministic row state.
    fileParallelism: false
  }
});
