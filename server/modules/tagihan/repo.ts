import type { SQL } from "drizzle-orm";
import type { CreateTagihanKhususSchema, UpdateTagihanSchema } from "./model";
import { and, desc, eq, ilike, inArray, ne, or } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { tagihanAnggotaTable, tagihanTable } from "~~/server/database/schema/tagihan";
import { getUniqueNominal } from "~~/server/utils/generator";

export abstract class TagihanRepo {
  static async createKasBulanan() {
    await db.transaction(async (tx) => {
      const [tagihan] = await tx.insert(tagihanTable).values({
        judul: "Kas Bualan",
        deskripsi: `Kas Bulanan ${new Date().toLocaleString("id-ID", { month: "long", year: "numeric" })}`,
        nominal: 50000,
      }).returning({ id: tagihanTable.id });

      if (!tagihan) {
        throw new Error("Failed to create tagihan");
      }

      const users = await tx.select({ id: userTable.id }).from(userTable);

      if (users.length > 0) {
        const anggotaPayload = await Promise.all(
          users.map(async (u) => {
            const nominal = await getUniqueNominal(50000);

            return {
              tagihanId: tagihan.id,
              userId: u.id,
              nominal,
            };
          }),
        );

        await tx.insert(tagihanAnggotaTable).values(anggotaPayload);
      }
    });
  }

  static async createTagihanKhusus(payload: CreateTagihanKhususSchema) {
    return await db.transaction(async (tx) => {
      const [tagihan] = await tx.insert(tagihanTable).values({
        judul: payload.judul,
        deskripsi: payload.deskripsi,
        nominal: payload.nominal,
      }).returning();

      if (!tagihan) {
        throw new Error("Failed to create tagihan");
      }

      if (payload.userIds.length > 0) {
        const anggotaPayload = await Promise.all(
          payload.userIds.map(async (u) => {
            const nominal = await getUniqueNominal(payload.nominal);

            return {
              tagihanId: tagihan.id,
              userId: u,
              nominal,
            };
          }),
        );

        await tx.insert(tagihanAnggotaTable).values(anggotaPayload);
      }
      return tagihan;
    });
  }

  static async update(id: number, payload: UpdateTagihanSchema) {
    return await db.update(tagihanTable)
      .set(payload)
      .where(eq(tagihanTable.id, id))
      .returning();
  }

  static async delete(ids: number[]) {
    return await db.delete(tagihanTable)
      .where(inArray(tagihanTable.id, ids))
      .returning();
  }

  static async updateStatusAnggota(
    id: number,
    status: "pending" | "menunggu_verifikasi" | "lunas",
    tanggalBayar?: Date | null,
  ) {
    return await db.update(tagihanAnggotaTable)
      .set({ status, tanggalBayar })
      .where(eq(tagihanAnggotaTable.id, id))
      .returning();
  }

  static async findAll(query: PaginationSearchSchema) {
    const offset = (query.page - 1) * query.limit;
    const qb = db.select({
      id: tagihanTable.id,
      judul: tagihanTable.judul,
      deskripsi: tagihanTable.deskripsi,
      nominal: tagihanTable.nominal,
    })
      .from(tagihanTable)
      .orderBy(desc(tagihanTable.id));

    const conditions: (SQL<unknown> | undefined)[] = [];

    if (query.search) {
      const searchCondition = `%${query.search}%`;
      conditions.push(
        or(
          ilike(tagihanTable.judul, searchCondition),
          ilike(tagihanTable.deskripsi, searchCondition),
        ),
      );
    }

    qb.where(and(...conditions));

    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async findBelumDibayarByUser(
    query: PaginationSearchSchema,
  ) {
    const offset = (query.page - 1) * query.limit;

    const qb = db
      .select({
        id: tagihanAnggotaTable.id,
        judul: tagihanTable.judul,
        namaAnggota: userTable.name,
        status: tagihanAnggotaTable.status,
        nominal: tagihanAnggotaTable.nominal,
      })
      .from(tagihanAnggotaTable)
      .innerJoin(
        tagihanTable,
        eq(tagihanTable.id, tagihanAnggotaTable.tagihanId),
      )
      .innerJoin(userTable, eq(userTable.id, tagihanAnggotaTable.userId))
      .orderBy(desc(tagihanTable.id));

    const conditions: (SQL<unknown> | undefined)[] = [
      ne(tagihanAnggotaTable.status, "lunas"),
    ];

    if (query.search) {
      const searchCondition = `%${query.search}%`;

      conditions.push(
        or(
          ilike(tagihanTable.judul, searchCondition),
          ilike(tagihanTable.deskripsi, searchCondition),
        ),
      );
    }

    qb.where(and(...conditions));

    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async findAllByUser(userId: number, query: PaginationSearchSchema) {
    const offset = (query.page - 1) * query.limit;

    const qb = db.select({
      id: tagihanAnggotaTable.id,
      judul: tagihanTable.judul,
      deskripsi: tagihanTable.deskripsi,
      nominal: tagihanAnggotaTable.nominal,
      status: tagihanAnggotaTable.status,
      tanggalBayar: tagihanAnggotaTable.tanggalBayar,
    })
      .from(tagihanAnggotaTable)
      .innerJoin(tagihanTable, eq(tagihanTable.id, tagihanAnggotaTable.tagihanId))
      .orderBy(desc(tagihanTable.id));

    const conditions: (SQL<unknown> | undefined)[] = [eq(tagihanAnggotaTable.userId, userId)];

    if (query.search) {
      const searchCondition = `%${query.search}%`;

      conditions.push(
        or(
          ilike(tagihanTable.judul, searchCondition),
          ilike(tagihanTable.deskripsi, searchCondition),
        ),
      );
    }

    qb.where(and(...conditions));

    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }
}
