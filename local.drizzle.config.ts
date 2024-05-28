import { type Config } from "drizzle-kit";

export default {
  dialect: "sqlite",
  schema: "./src/server/db/schema.ts",
  out: "./drizzle/migrations",
  driver: "turso",
  dbCredentials: {
    url: "http://127.0.0.1:8080",
  },
  tablesFilter: ["t3li_*"],
} satisfies Config;
