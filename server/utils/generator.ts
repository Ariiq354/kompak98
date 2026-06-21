import { eq } from "drizzle-orm";
import { db } from "../database";
import { tagihanAnggotaTable } from "../database/schema/tagihan";

export async function getUniqueNominal(nominal: number): Promise<number> {
  while (true) {
    const uniqueCode = Math.floor(Math.random() * 900) + 100;
    const finalNominal = nominal + uniqueCode;

    const existing = await db
      .select({ id: tagihanAnggotaTable.id })
      .from(tagihanAnggotaTable)
      .where(eq(tagihanAnggotaTable.nominal, finalNominal))
      .limit(1);

    if (existing.length === 0) {
      return finalNominal;
    }
  }
}
