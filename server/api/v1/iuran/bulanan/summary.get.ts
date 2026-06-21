import { getRingkasanKasByTahunSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getRingkasanKasByTahunSchema);

  const result = await IuranBulananService.getRingkasanKasByTahun(query.tahun);

  return result;
});
