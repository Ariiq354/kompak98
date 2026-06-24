import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranKhususService.updateStatusPembayaranIuranKhususUser(params.id);

  return {
    message: "Success",
  };
});
