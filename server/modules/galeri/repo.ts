import type { GetGaleriSchema } from "./model";
import { and, eq, ilike, inArray, isNull, sql } from "drizzle-orm";
import { db } from "~~/server/database";
import { galeriTable } from "~~/server/database/schema/galeri";

export abstract class GaleriRepo {
  static async createFolder(name: string, parentId: number | null, userId: number) {
    const [result] = await db
      .insert(galeriTable)
      .values({
        name,
        isFolder: true,
        parentId,
        createdBy: userId,
      })
      .returning();
    return result;
  }

  static async createFile(data: {
    name: string;
    parentId: number | null;
    mimeType: string;
    extension: string;
    originalName: string;
    path: string;
    size: number;
    createdBy: number;
  }) {
    const [result] = await db
      .insert(galeriTable)
      .values({
        ...data,
        isFolder: false,
      })
      .returning();
    return result;
  }

  static async rename(id: number, name: string) {
    const [result] = await db
      .update(galeriTable)
      .set({ name })
      .where(eq(galeriTable.id, id))
      .returning();
    return result;
  }

  static async findById(id: number) {
    const [result] = await db
      .select()
      .from(galeriTable)
      .where(eq(galeriTable.id, id))
      .limit(1);
    return result || null;
  }

  static async findByIds(ids: number[]) {
    if (ids.length === 0)
      return [];
    return await db
      .select()
      .from(galeriTable)
      .where(inArray(galeriTable.id, ids));
  }

  static async findAll(query: GetGaleriSchema) {
    const conditions = [];

    if (query.search) {
      conditions.push(ilike(galeriTable.name, `%${query.search}%`));
    }
    else {
      if (query.parentId) {
        conditions.push(eq(galeriTable.parentId, query.parentId));
      }
      else {
        conditions.push(isNull(galeriTable.parentId));
      }
    }

    return await db
      .select()
      .from(galeriTable)
      .where(and(...conditions))
      .orderBy(sql`is_folder DESC, name ASC`);
  }

  static async delete(id: number) {
    return await db
      .delete(galeriTable)
      .where(eq(galeriTable.id, id));
  }

  static async getBreadcrumbs(folderId: number) {
    const query = sql`
      WITH RECURSIVE ancestors AS (
        SELECT id, name, parent_id, 1 as level FROM galeri WHERE id = ${folderId}
        UNION ALL
        SELECT g.id, g.name, g.parent_id, a.level + 1 FROM galeri g
        JOIN ancestors a ON g.id = a.parent_id
      )
      SELECT id, name, parent_id as "parentId" FROM ancestors ORDER BY level DESC;
    `;
    const result = await db.execute(query);
    return result as unknown as { id: number; name: string; parentId: number | null }[];
  }

  static async getDescendants(folderId: number) {
    const query = sql`
      WITH RECURSIVE descendants AS (
        SELECT id, path, is_folder, parent_id FROM galeri WHERE id = ${folderId}
        UNION ALL
        SELECT g.id, g.path, g.is_folder, g.parent_id FROM galeri g
        JOIN descendants d ON g.parent_id = d.id
      )
      SELECT id, path, is_folder as "isFolder" FROM descendants;
    `;
    const result = await db.execute(query);
    return result as unknown as { id: number; path: string | null; isFolder: boolean }[];
  }
}
