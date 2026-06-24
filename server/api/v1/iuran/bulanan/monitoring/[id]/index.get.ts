import { getDetailKasByTahunSchema } from "~~/server/modules/iuran-bulanan/model";
import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await getValidatedBodySafe(event, getDetailKasByTahunSchema);

  const result = await IuranBulananService.getHistoryKasBulanan(body.id, params.id);

  return result;
});
