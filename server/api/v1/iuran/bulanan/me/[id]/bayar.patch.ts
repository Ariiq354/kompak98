import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranBulananService.updateStatusPembayaranKasBulananUser(params.id);

  return {
    message: "Success",
  };
});
