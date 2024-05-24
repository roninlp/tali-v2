import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url:
      env.NODE_ENV === "production"
        ? env.DATABASE_URL
        : "http://127.0.0.1:8080",
    authToken: env.DATABASE_AUTH_TOKEN,
  },
  tablesFilter: ["t3li_*"],
} satisfies Config;
