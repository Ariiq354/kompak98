import { getAcaraSchema } from "~~/server/modules/acara/model";
import { AcaraService } from "~~/server/modules/acara/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, getAcaraSchema);

  return await AcaraService.findAll(query);
});
