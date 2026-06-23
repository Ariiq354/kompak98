import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { UpdateUserSchema } from "./model";
import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class UserRepo {
  static async getAllUserOption() {
    return db.select({
      id: userTable.id,
      image: userTable.image,
      name: userTable.name,
    }).from(userTable);
  }

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
      gender: userProfileTable.gender,
      nip9: userTable.username,
      foto: userTable.image,
      namaKantor: userProfileTable.namaKantor,
      provinsiKantor: userProfileTable.provinsiKantor,
      noHp: userProfileTable.noHp,
      nip18: userProfileTable.nip18,
      namaJabatan: userProfileTable.namaJabatan,
      namaUnitEs4: userProfileTable.namaUnitEs4,
      namaPangkat: userProfileTable.namaPangkat,
      pendidikanFormal: userProfileTable.pendidikanFormal,
      alamat: userProfileTable.alamat,
      provinsi: userProfileTable.provinsi,
      kota: userProfileTable.kota,
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .where(eq(userTable.id, userId));

    if (data.length === 0)
      return null;

    return data[0];
  }

  static async getMonitoringUser(payload: PaginationSearchSchema) {
    const qb = db.select({
      id: userTable.id,
      name: userTable.name,
      gender: userProfileTable.gender,
      nip9: userTable.username,
      foto: userTable.image,
      namaKantor: userProfileTable.namaKantor,
      provinsiKantor: userProfileTable.provinsiKantor,
      noHp: userProfileTable.noHp,
      nip18: userProfileTable.nip18,
      namaJabatan: userProfileTable.namaJabatan,
      namaUnitEs4: userProfileTable.namaUnitEs4,
      namaPangkat: userProfileTable.namaPangkat,
      pendidikanFormal: userProfileTable.pendidikanFormal,
      alamat: userProfileTable.alamat,
      provinsi: userProfileTable.provinsi,
      kota: userProfileTable.kota,
    })
      .from(userTable)
      .leftJoin(userProfileTable, eq(userTable.id, userProfileTable.userId));

    const offset = (payload.page - 1) * payload.limit;
    const total = await db.$count(qb);
    const data = await qb.limit(payload.limit).offset(offset);

    return {
      total,
      data,
    };
  }
}
