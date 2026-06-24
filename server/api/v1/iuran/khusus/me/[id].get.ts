import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const result = await IuranKhususService.getHistoryPembayaranByUser(user.id, params.id);

  return result;
});
