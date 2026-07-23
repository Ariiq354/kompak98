import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranBulananService.updateStatusPembayaranKasBulananUser(params.id, user.id);

  return {
    message: "Success",
  };
});
