import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const result = await IuranBulananService.getHistoryKasBulanan(user.id, params.id);

  return result;
});
