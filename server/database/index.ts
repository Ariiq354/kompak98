import { drizzle } from "drizzle-orm/postgres-js";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import { env } from "../../shared/env";
import * as auth from "./schema/auth";
import * as iuran from "./schema/iuran";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema: {
    ...auth,
    ...iuran,
  },
  casing: "snake_case",
  logger: env.LOGGER ? new EnhancedQueryLogger() : undefined,
});
