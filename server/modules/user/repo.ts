import type { GetMonitoringUserSchema, ImportUserRow, UpdateUserSchema } from "./model";
import { and, asc, eq, ilike, inArray } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
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

      await tx.update(userTable)
        .set({
          image: payload.foto || null,
        })
        .where(eq(userTable.id, userId));
    });
  }

  static async getUserProfile(userId: number) {
    const data = await db.select({
      id: userTable.id,
      name: userTable.name,
      role: userTable.role,
      gender: userProfileTable.gender,
      nip9: userTable.username,
      foto: userTable.image,
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
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .where(eq(userTable.id, userId));

    if (data.length === 0)
      return null;

    return data[0];
  }

  static getMonitoringUserQuery(payload: Pick<GetMonitoringUserSchema, "search" | "kodeJabatan">) {
    const conditions = [];
    if (payload.search) {
      conditions.push(ilike(userTable.name, `%${payload.search}%`));
    }
    if (payload.kodeJabatan) {
      conditions.push(eq(jabatanTable.kodeJabatan, payload.kodeJabatan));
    }

    const qb = db.select({
      id: userTable.id,
      name: userTable.name,
      role: userTable.role,
      banned: userTable.banned,
      banReason: userTable.banReason,
      gender: userProfileTable.gender,
      nip9: userTable.username,
      foto: userTable.image,
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
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .leftJoin(jabatanTable, eq(userProfileTable.idJabatan, jabatanTable.id))
      .orderBy(asc(userTable.name));

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
    const existingUsers = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(inArray(userTable.id, ids));
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
      await db.transaction(async (tx) => {
        for (const row of chunk) {
          const {
            id,
            name,
            nip9,
            gender,
            ...profile
          } = row;

          await tx
            .update(userTable)
            .set({
              name,
              username: nip9,
            })
            .where(eq(userTable.id, id));

          await tx
            .insert(userProfileTable)
            .values({
              userId: id,
              gender,
              ...profile,
            })
            .onConflictDoUpdate({
              target: userProfileTable.userId,
              set: {
                gender,
                ...profile,
              },
            });
        }
      });
    }

    return { updated: rows.length };
  }

  static async getPegawaiList(payload: GetMonitoringUserSchema) {
    const conditions = [];
    if (payload.search) {
      conditions.push(ilike(userTable.name, `%${payload.search}%`));
    }
    if (payload.kodeJabatan) {
      conditions.push(eq(jabatanTable.kodeJabatan, payload.kodeJabatan));
    }

    const qb = db.select({
      id: userTable.id,
      name: userTable.name,
      foto: userTable.image,
      namaKantor: userProfileTable.namaKantor,
      noHp: userProfileTable.noHp,
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
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
