import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./app/src/test/setup.ts"],
    include: ["app/src/**/*.test.ts", "app/src/**/*.test.tsx"]
  }
});
