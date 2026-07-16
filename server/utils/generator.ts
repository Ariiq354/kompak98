import { eq } from "drizzle-orm";
import { db } from "../database";

export async function getUniqueNominal<
  TTable,
  TColumn,
>(
  nominal: number,
  table: TTable,
  column: TColumn,
  maxRetries = 10,
): Promise<number> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const uniqueCode = Math.floor(Math.random() * 500) + 1;
    const finalNominal = nominal + uniqueCode;

    const existing = await db
      .select()
      .from(table as any)
      .where(eq(column as any, finalNominal))
      .limit(1);

    if (existing.length === 0) {
      return finalNominal;
    }
  }
  throw createError({
    statusCode: 409,
    message: "Gagal membuat kode nominal unik. Silakan coba lagi.",
  });
}
