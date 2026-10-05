import { defineConfig, configDefaults } from "vitest/config";

// mirrors the @shared/* path in tsconfig.json; agent worktrees live under .claude/ and carry their own tests
export default defineConfig({
  resolve: { alias: { "@shared": new URL("./shared", import.meta.url).pathname } },
  test: { exclude: [...configDefaults.exclude, ".claude/**"] },
});
