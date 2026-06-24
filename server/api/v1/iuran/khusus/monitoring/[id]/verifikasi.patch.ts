import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranKhususService.updateStatusPembayaranIuranKhususAdmin(params.id);

  return {
    message: "Success",
  };
});
