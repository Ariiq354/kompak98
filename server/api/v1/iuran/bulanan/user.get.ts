import { getAllUserKasBulananByTahunSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getAllUserKasBulananByTahunSchema);

  const result = await IuranBulananService.getAllUserKasBulananByTahun(query);

  return result;
});
