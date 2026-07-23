import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranKhususService.updateStatusPembayaranIuranKhususUser(params.id, user.id);

  return {
    message: "Success",
  };
});
