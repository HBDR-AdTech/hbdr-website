import { defineConfig } from "vitest/config";

// mirrors the @shared/* path in tsconfig.json
export default defineConfig({
  resolve: { alias: { "@shared": new URL("./shared", import.meta.url).pathname } },
});
