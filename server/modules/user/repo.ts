import type { UpdateUserSchema } from "./model";
import { eq } from "drizzle-orm";
import { db } from "~~/server/database";
import { userTable } from "~~/server/database/schema/auth";
import { userProfileTable } from "~~/server/database/schema/user";

export abstract class UserRepo {
  static async updateUser(userId: number, payload: UpdateUserSchema) {
    return await db.insert(userProfileTable)
      .values({
        userId,
        ...payload,
      })
      .onConflictDoUpdate({
        target: userProfileTable.userId,
        set: payload,
      })
      .returning();
  }

  static async getUserProfile(userId: number) {
    const data = await db.select({
      id: userTable.id,
      name: userTable.name,
      nip9: userTable.username,
      image: userTable.image,
      namaKantor: userProfileTable.namaKantor,
      noHp: userProfileTable.noHp,
      nip18: userProfileTable.nip18,
      namaJabatan: userProfileTable.namaJabatan,
      namaUnitEs4: userProfileTable.namaUnitEs4,
      namaPangkat: userProfileTable.namaPangkat,
      pendidikanFormal: userProfileTable.pendidikanFormal,
      alamat: userProfileTable.alamat,
      rt: userProfileTable.rt,
      rw: userProfileTable.rw,
    })
      .from(userTable)
      .innerJoin(userProfileTable, eq(userTable.id, userProfileTable.userId))
      .where(eq(userTable.id, userId));

    if (data.length === 0)
      return null;

    return data[0];
  }
}
