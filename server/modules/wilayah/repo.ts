import type { GetRegenciesSchema } from "./model";
import { asc, eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { kotaTable, provinsiTable } from "~~/server/database/schema/wilayah";

export abstract class WilayahRepo {
  static async findProvincies() {
    const data = await db
      .select()
      .from(provinsiTable)
      .orderBy(asc(provinsiTable.provinsi));

    return data;
  }

  static async findRegencies(query: GetRegenciesSchema) {
    if (!query.provinsiId)
      return [];

    return await db
      .select()
      .from(kotaTable)
      .where(eq(kotaTable.idProvinsi, query.provinsiId))
      .orderBy(asc(kotaTable.kota));
  }
}
