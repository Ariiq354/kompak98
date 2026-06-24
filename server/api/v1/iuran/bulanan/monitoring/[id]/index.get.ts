import { getDetailKasByTahunSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const query = await getValidatedQuerySafe(event, getDetailKasByTahunSchema);

  const result = await IuranBulananService.getHistoryKasBulanan(query.userId, params.id);

  return result;
});
