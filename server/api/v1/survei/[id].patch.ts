import { updateSurveiSchema } from "~~/server/modules/survei/model";
import { SurveiService } from "~~/server/modules/survei/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateSurveiSchema);

  return await SurveiService.update(params.id, body);
});
