import { SurveiService } from "~~/server/modules/survei/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await SurveiService.findById(params.id);
});
