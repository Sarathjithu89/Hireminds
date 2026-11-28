import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
    env: {
      NODE_ENV: "test",
      MONGODB_URI: "mongodb://localhost:27017/hireminds-test",
      JWT_ACCESS_SECRET: "test-access-secret-minimum-32-characters-long",
      JWT_REFRESH_SECRET: "test-refresh-secret-minimum-32-characters-long",
    },
  },
});
