import { asc } from "drizzle-orm";
import { db } from "~~/server/database";
import { jabatanTable } from "~~/server/database/schema/jabatan";

export abstract class JabatanRepo {
  static async getJabatanOption() {
    return db.select({
      id: jabatanTable.id,
      jabatan: jabatanTable.jabatan,
    })
      .from(jabatanTable)
      .orderBy(asc(jabatanTable.jabatan));
  }
}
