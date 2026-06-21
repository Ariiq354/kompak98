import { createPembayaranBulananSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, createPembayaranBulananSchema);

  const result = await IuranBulananService.pembayaranKasBulanan(user.id, body);

  return result;
});
