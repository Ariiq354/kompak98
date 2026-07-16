import type { CreateSurveiSchema, GetSurveiSchema, SubmitResponSchema, UpdateSurveiSchema } from "./model";
import { and, desc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { jawabanTable, pertanyaanTable, responTable, surveiTable } from "~~/server/database/schema/survey";

export abstract class SurveiRepo {
  static async create(userId: number, data: CreateSurveiSchema) {
    return await db.transaction(async (tx) => {
      const [newSurvei] = await tx
        .insert(surveiTable)
        .values({
          judul: data.judul,
          deskripsi: data.deskripsi,
          headerGambar: data.headerGambar,
          status: data.status,
          tanggalMulai: data.tanggalMulai,
          tanggalSelesai: data.tanggalSelesai,
          createdBy: userId,
        })
        .returning();

      if (!newSurvei) {
        throw new Error("Gagal membuat survei");
      }

      const pertanyaanValues = data.pertanyaan.map(p => ({
        surveiId: newSurvei.id,
        tipe: p.tipe,
        pertanyaan: p.pertanyaan,
        wajib: p.wajib,
        nomorUrut: p.nomorUrut,
        pilihan: p.pilihan,
      }));

      if (pertanyaanValues.length > 0) {
        await tx.insert(pertanyaanTable).values(pertanyaanValues);
      }

      return newSurvei;
    });
  }

  static async update(id: number, data: UpdateSurveiSchema) {
    const [result] = await db
      .update(surveiTable)
      .set({
        judul: data.judul,
        deskripsi: data.deskripsi,
        headerGambar: data.headerGambar,
        status: data.status,
        tanggalMulai: data.tanggalMulai,
        tanggalSelesai: data.tanggalSelesai,
      })
      .where(eq(surveiTable.id, id))
      .returning();
    return result || null;
  }

  static async hasRespon(surveiId: number): Promise<boolean> {
    const [firstRespon] = await db
      .select({ id: responTable.id })
      .from(responTable)
      .where(eq(responTable.surveiId, surveiId))
      .limit(1);
    return !!firstRespon;
  }

  static async hasUserResponded(surveiId: number, userId: number): Promise<boolean> {
    const [existing] = await db
      .select({ id: responTable.id })
      .from(responTable)
      .where(and(eq(responTable.surveiId, surveiId), eq(responTable.userId, userId)))
      .limit(1);
    return !!existing;
  }

  static async findById(id: number) {
    const [survei] = await db
      .select()
      .from(surveiTable)
      .where(eq(surveiTable.id, id))
      .limit(1);

    if (!survei)
      return null;

    const pertanyaanList = await db
      .select()
      .from(pertanyaanTable)
      .where(eq(pertanyaanTable.surveiId, id))
      .orderBy(pertanyaanTable.nomorUrut);

    return {
      ...survei,
      pertanyaan: pertanyaanList,
    };
  }

  static async findByIds(ids: number[]) {
    if (ids.length === 0)
      return [];
    return await db
      .select()
      .from(surveiTable)
      .where(inArray(surveiTable.id, ids));
  }

  static async findAll(query: GetSurveiSchema, options?: { onlyPublished?: boolean }) {
    const conditions = [];

    if (query.search) {
      conditions.push(ilike(surveiTable.judul, `%${query.search}%`));
    }

    if (query.status) {
      conditions.push(eq(surveiTable.status, query.status));
    }

    if (options?.onlyPublished) {
      conditions.push(eq(surveiTable.status, "published"));
    }

    const qb = db
      .select()
      .from(surveiTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(surveiTable.id));

    const offset = (query.page - 1) * query.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(query.limit).offset(offset);

    return { total, data };
  }

  static async delete(ids: number[]) {
    return await db
      .delete(surveiTable)
      .where(inArray(surveiTable.id, ids));
  }

  static async submitRespon(surveiId: number, userId: number, data: SubmitResponSchema) {
    return await db.transaction(async (tx) => {
      const [newRespon] = await tx
        .insert(responTable)
        .values({
          surveiId,
          userId,
        })
        .returning();

      if (!newRespon) {
        throw new Error("Gagal membuat respon");
      }

      const jawabanValues = data.jawaban.map(j => ({
        responId: newRespon.id,
        pertanyaanId: j.pertanyaanId,
        jawaban: j.jawaban,
      }));

      if (jawabanValues.length > 0) {
        await tx.insert(jawabanTable).values(jawabanValues);
      }

      return newRespon;
    });
  }

  static async getHasilRespon(surveiId: number) {
    const responList = await db
      .select({
        id: responTable.id,
        userId: responTable.userId,
        userName: userTable.name,
        submittedAt: responTable.dikirimPada,
      })
      .from(responTable)
      .leftJoin(userTable, eq(responTable.userId, userTable.id))
      .where(eq(responTable.surveiId, surveiId))
      .orderBy(desc(responTable.dikirimPada));

    if (responList.length === 0) {
      return [];
    }

    const responIds = responList.map(r => r.id);

    const jawabanList = await db
      .select({
        responId: jawabanTable.responId,
        pertanyaanId: jawabanTable.pertanyaanId,
        pertanyaanText: pertanyaanTable.pertanyaan,
        jawaban: jawabanTable.jawaban,
      })
      .from(jawabanTable)
      .innerJoin(pertanyaanTable, eq(jawabanTable.pertanyaanId, pertanyaanTable.id))
      .where(inArray(jawabanTable.responId, responIds));

    const jawabanMap = new Map<number, any[]>();
    for (const j of jawabanList) {
      if (!jawabanMap.has(j.responId)) {
        jawabanMap.set(j.responId, []);
      }
      jawabanMap.get(j.responId)!.push({
        pertanyaanId: j.pertanyaanId,
        pertanyaanText: j.pertanyaanText,
        jawaban: j.jawaban,
      });
    }

    return responList.map(r => ({
      ...r,
      jawaban: jawabanMap.get(r.id) || [],
    }));
  }
}
