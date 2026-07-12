import { drizzle } from "drizzle-orm/postgres-js";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import { env } from "../../shared/env";
import { relations } from "./relations";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  relations,
  logger: env.LOGGER ? new EnhancedQueryLogger() : undefined,
});
