import type { SQL } from "drizzle-orm";
import type { CreateAcaraSchema, GetAcaraSchema, UpdateAcaraSchema } from "./model";
import { and, asc, desc, eq, gt, ilike, inArray, lt, or, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { acaraTable } from "~~/server/database/schema/acara";

export abstract class AcaraRepo {
  static async create(data: Omit<CreateAcaraSchema, "file">, fileKey: string) {
    const [result] = await db
      .insert(acaraTable)
      .values({ ...data, foto: fileKey })
      .returning();
    return result;
  }

  static async update(id: number, data: Omit<UpdateAcaraSchema, "file">, fileKey?: string) {
    const [result] = await db
      .update(acaraTable)
      .set({ ...data, foto: fileKey })
      .where(eq(acaraTable.id, id))
      .returning();
    return result;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(acaraTable)
      .where(eq(acaraTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findByIds(ids: number[]) {
    return await db
      .select()
      .from(acaraTable)
      .where(inArray(acaraTable.id, ids));
  }

  static async findAll(query: GetAcaraSchema) {
    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(
        or(
          ilike(acaraTable.judul, searchCondition),
          ilike(acaraTable.tempat, searchCondition),
        ),
      );
    }

    if (query.tahun) {
      conditions.push(
        sql`extract(year from ${acaraTable.tanggal}) = ${query.tahun}`,
      );
    }

    if (query.bulan) {
      conditions.push(
        sql`extract(month from ${acaraTable.tanggal}) = ${query.bulan}`,
      );
    }

    const qb = db
      .select()
      .from(acaraTable)
      .orderBy(desc(acaraTable.id))
      .where(and(...conditions));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(ids: number[]) {
    return await db
      .delete(acaraTable)
      .where(inArray(acaraTable.id, ids));
  }

  static async findSudah() {
    return db.select({
      judul: acaraTable.judul,
      deskripsi: acaraTable.deskripsi,
      tanggal: acaraTable.tanggal,
      foto: acaraTable.foto,
    })
      .from(acaraTable)
      .where(lt(acaraTable.tanggal, sql`current_date`))
      .orderBy(desc(acaraTable.tanggal))
      .limit(3);
  }

  static async findBelum() {
    return db.select({
      judul: acaraTable.judul,
      tanggal: acaraTable.tanggal,
      tempat: acaraTable.tempat,
      foto: acaraTable.foto,
    })
      .from(acaraTable)
      .where(gt(acaraTable.tanggal, sql`current_date`))
      .orderBy(asc(acaraTable.tanggal))
      .limit(3);
  }
}
