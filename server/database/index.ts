import { drizzle } from "drizzle-orm/postgres-js";
import { EnhancedQueryLogger } from "drizzle-query-logger";
import { env } from "../../shared/env";
import * as auth from "./schema/auth";
import * as galeri from "./schema/galeri";
import * as iuran from "./schema/iuran";
import * as jabatan from "./schema/jabatan";
import * as pengeluaran from "./schema/pengeluaran";
import * as survey from "./schema/survey";
import * as user from "./schema/user";

export const db = drizzle({
  connection: {
    url: env.DATABASE_URL,
  },
  schema: {
    ...auth,
    ...user,
    ...iuran,
    ...pengeluaran,
    ...jabatan,
    ...galeri,
    ...survey,
  },
  casing: "snake_case",
  logger: env.LOGGER ? new EnhancedQueryLogger() : undefined,
});
