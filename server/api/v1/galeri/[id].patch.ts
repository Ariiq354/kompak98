import { renameSchema } from "~~/server/modules/galeri/model";
import { GaleriService } from "~~/server/modules/galeri/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, renameSchema);

  return await GaleriService.rename(params.id, body.name);
});
