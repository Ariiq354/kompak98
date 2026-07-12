import { defineRelations } from "drizzle-orm";
import * as auth from "./schema/auth";
import * as galeri from "./schema/galeri";
import * as iuran from "./schema/iuran";
import * as jabatan from "./schema/jabatan";
import * as pengeluaran from "./schema/pengeluaran";
import * as survey from "./schema/survey";
import * as user from "./schema/user";

export const relations = defineRelations({
  ...auth,
  ...galeri,
  ...iuran,
  ...jabatan,
  ...pengeluaran,
  ...survey,
  ...user,
}, r => ({
  userTable: {
    profile: r.one.userProfileTable({
      from: r.userTable.id,
      to: r.userProfileTable.userId,
    }),
  },
}));
