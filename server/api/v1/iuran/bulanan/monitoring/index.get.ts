import { getKasBulananByTahunSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getKasBulananByTahunSchema);

  const result = await IuranBulananService.getKasBulananByTahun(query);

  return result;
});
