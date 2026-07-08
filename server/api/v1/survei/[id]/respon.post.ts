import { submitResponSchema } from "~~/server/modules/survei/model";
import { SurveiService } from "~~/server/modules/survei/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, submitResponSchema);

  return await SurveiService.submitRespon(params.id, user.id, body);
});
