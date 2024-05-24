import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "@/env";
import * as schema from "./schema";

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN,
});

const localClient = createClient({
  url: "http://127.0.0.1:8080",
});

export const db = drizzle(
  env.NODE_ENV === "production" ? client : localClient,
  { schema },
);
