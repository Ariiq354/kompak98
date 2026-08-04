import { defineRelations } from "drizzle-orm";
import * as auth from "./schema/auth";
import * as galeri from "./schema/galeri";
import * as iuran from "./schema/iuran";
import * as jabatan from "./schema/jabatan";
import * as pengeluaran from "./schema/pengeluaran";
import * as survey from "./schema/survey";
import * as user from "./schema/user";
import * as wilayah from "./schema/wilayah";

export const relations = defineRelations({
  ...auth,
  ...galeri,
  ...iuran,
  ...jabatan,
  ...pengeluaran,
  ...survey,
  ...user,
  ...wilayah,
}, r => ({
  userTable: {
    profile: r.one.userProfileTable({
      from: r.userTable.id,
      to: r.userProfileTable.userId,
    }),
    sessions: r.many.session({
      from: r.userTable.id,
      to: r.session.userId,
    }),
    accounts: r.many.account({
      from: r.userTable.id,
      to: r.account.userId,
    }),
  },
  session: {
    user: r.one.userTable({
      from: r.session.userId,
      to: r.userTable.id,
    }),
  },
  account: {
    user: r.one.userTable({
      from: r.account.userId,
      to: r.userTable.id,
    }),
  },
}));
