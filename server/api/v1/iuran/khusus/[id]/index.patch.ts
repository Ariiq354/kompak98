import { updateIuranKhususSchema } from "~~/server/modules/iuran-khusus/model";
import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateIuranKhususSchema);

  await IuranKhususService.updateIuranKhusus(params.id, body);

  return {
    message: "Success",
  };
});
