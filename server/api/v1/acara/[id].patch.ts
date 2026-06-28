import { updateAcaraSchema } from "~~/server/modules/acara/model";
import { AcaraService } from "~~/server/modules/acara/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedMultipart(event, updateAcaraSchema);

  return await AcaraService.update(params.id, body);
});
