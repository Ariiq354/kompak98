import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  await IuranBulananService.updateStatusPembayaranKasBulananAdmin(params.id);

  return {
    message: "Success",
  };
});
