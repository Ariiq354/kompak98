import { GaleriService } from "~~/server/modules/galeri/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await GaleriService.deleteItem(params.id, user);
});
