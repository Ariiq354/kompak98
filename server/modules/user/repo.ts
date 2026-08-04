import type { GetMonitoringUserSchema, ImportUserRow, UpdateUserSchema } from "./model";
import { and, asc, eq, ilike, inArray, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { user } from "~~/server/database/schema/auth";
import { jabatanTable } from "~~/server/database/schema/jabatan";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class UserRepo {
  static async updateUser(userId: number, payload: Omit<UpdateUserSchema, "file">) {
    return db.transaction(async (tx) => {
      const result = await tx.insert(userProfileTable)
        .values({
          userId,
          ...payload,
        })
        .onConflictDoUpdate({
          target: userProfileTable.userId,
          set: payload,
        })
        .returning();

      if (result.length === 0) {
        throw new Error("User tidak ditemukan");
      }

      await tx.update(user)
        .set({
          image: payload.foto || null,
        })
        .where(eq(user.id, userId));
    });
  }

  static async getUserProfile(userId: number) {
    const data = await db.select({
      id: user.id,
      name: user.name,
      role: user.role,
      gender: userProfileTable.gender,
      nip9: user.username,
      foto: user.image,
      namaKantor: userProfileTable.namaKantor,
      provinsiKantorId: userProfileTable.provinsiKantorId,
      noHp: userProfileTable.noHp,
      nip18: userProfileTable.nip18,
      idJabatan: userProfileTable.idJabatan,
      namaJabatan: jabatanTable.jabatan,
      namaUnitEs4: userProfileTable.namaUnitEs4,
      namaPangkat: userProfileTable.namaPangkat,
      pendidikanFormal: userProfileTable.pendidikanFormal,
      alamat: userProfileTable.alamat,
      provinsiId: userProfileTable.provinsiId,
      kotaId: userProfileTable.kotaId,
    })
      .from(user)
      .leftJoin(userProfileTable, eq(user.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .where(eq(user.id, userId));

    if (data.length === 0)
      return null;

    return data[0];
  }

  static getMonitoringUserQuery(payload: Pick<GetMonitoringUserSchema, "search" | "kodeJabatan">) {
    const conditions = [];
    if (payload.search) {
      conditions.push(ilike(user.name, `%${payload.search}%`));
    }
    if (payload.kodeJabatan) {
      conditions.push(eq(jabatanTable.kodeJabatan, payload.kodeJabatan));
    }

    const qb = db.select({
      id: user.id,
      name: user.name,
      role: user.role,
      banned: user.banned,
      banReason: user.banReason,
      gender: userProfileTable.gender,
      nip9: user.username,
      foto: user.image,
      namaKantor: userProfileTable.namaKantor,
      provinsiKantorId: userProfileTable.provinsiKantorId,
      noHp: userProfileTable.noHp,
      nip18: userProfileTable.nip18,
      idJabatan: userProfileTable.idJabatan,
      kodeJabatan: jabatanTable.kodeJabatan,
      namaJabatan: jabatanTable.jabatan,
      namaUnitEs4: userProfileTable.namaUnitEs4,
      namaPangkat: userProfileTable.namaPangkat,
      pendidikanFormal: userProfileTable.pendidikanFormal,
      alamat: userProfileTable.alamat,
      provinsiId: userProfileTable.provinsiId,
      kotaId: userProfileTable.kotaId,
    })
      .from(user)
      .leftJoin(userProfileTable, eq(user.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .orderBy(asc(user.name));

    if (conditions.length > 0) {
      qb.where(and(...conditions));
    }

    return qb;
  }

  static async getMonitoringUser(payload: GetMonitoringUserSchema) {
    const query = this.getMonitoringUserQuery(payload);

    const offset = (payload.page - 1) * payload.limit;
    const total = await db.$count(query);
    const data = await query.limit(payload.limit).offset(offset);

    return {
      total,
      data,
    };
  }

  static async getMonitoringUserExport(payload: Pick<GetMonitoringUserSchema, "search" | "kodeJabatan">) {
    return await this.getMonitoringUserQuery(payload);
  }

  static async importMonitoringUsers(rows: ImportUserRow[]) {
    const ids = rows.map(row => row.id);

    return await db.transaction(async (tx) => {
      const existingUsers = await tx
        .select({ id: user.id })
        .from(user)
        .where(inArray(user.id, ids));
      const existingIds = new Set(existingUsers.map(user => user.id));
      const missingIds = ids.filter(id => !existingIds.has(id));

      if (missingIds.length > 0) {
        throw createError({
          statusCode: 400,
          statusMessage: `User dengan ID ${missingIds.join(", ")} tidak ditemukan`,
        });
      }

      const BATCH_SIZE = 100;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const chunk = rows.slice(i, i + BATCH_SIZE);

        // Perform user table updates inside the transaction
        for (const row of chunk) {
          await tx
            .update(user)
            .set({
              name: row.name,
              username: row.nip9,
            })
            .where(eq(user.id, row.id));
        }

        // Perform bulk upsert for profiles
        const profiles = chunk.map(row => ({
          userId: row.id,
          gender: row.gender,
          namaKantor: row.namaKantor,
          provinsiKantorId: row.provinsiKantorId,
          noHp: row.noHp,
          nip18: row.nip18,
          idJabatan: row.idJabatan,
          namaUnitEs4: row.namaUnitEs4,
          namaPangkat: row.namaPangkat,
          pendidikanFormal: row.pendidikanFormal,
          alamat: row.alamat,
          provinsiId: row.provinsiId,
          kotaId: row.kotaId,
        }));

        await tx
          .insert(userProfileTable)
          .values(profiles)
          .onConflictDoUpdate({
            target: userProfileTable.userId,
            set: {
              gender: sql`excluded.gender`,
              namaKantor: sql`excluded.nama_kantor`,
              provinsiKantorId: sql`excluded.provinsi_kantor_id`,
              noHp: sql`excluded.no_hp`,
              nip18: sql`excluded.nip18`,
              idJabatan: sql`excluded.id_jabatan`,
              namaUnitEs4: sql`excluded.nama_unit_es4`,
              namaPangkat: sql`excluded.nama_pangkat`,
              pendidikanFormal: sql`excluded.pendidikan_formal`,
              alamat: sql`excluded.alamat`,
              provinsiId: sql`excluded.provinsi_id`,
              kotaId: sql`excluded.kota_id`,
              updatedAt: sql`now()`,
            },
          });
      }

      return { updated: rows.length };
    });
  }

  static async getPegawaiList(payload: GetMonitoringUserSchema) {
    const conditions = [];
    if (payload.search) {
      conditions.push(ilike(user.name, `%${payload.search}%`));
    }
    if (payload.kodeJabatan) {
      conditions.push(eq(jabatanTable.kodeJabatan, payload.kodeJabatan));
    }

    const qb = db.select({
      id: user.id,
      name: user.name,
      foto: user.image,
      namaKantor: userProfileTable.namaKantor,
      noHp: userProfileTable.noHp,
    })
      .from(user)
      .leftJoin(userProfileTable, eq(user.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id));

    if (conditions.length > 0) {
      qb.where(and(...conditions));
    }

    const offset = (payload.page - 1) * payload.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(payload.limit).offset(offset);

    return {
      total,
      data,
    };
  }
}
