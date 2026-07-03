import { GaleriService } from "~~/server/modules/galeri/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await GaleriService.getDetails(params.id);
});
