import { getGaleriSchema } from "~~/server/modules/galeri/model";
import { GaleriService } from "~~/server/modules/galeri/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, getGaleriSchema);

  return await GaleriService.findAll(query);
});
