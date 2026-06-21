import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  const result = await IuranBulananService.getKasBulananByUser(user.id, query);

  return result;
});
