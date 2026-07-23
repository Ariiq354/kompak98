import { getSurveiSchema } from "~~/server/modules/survei/model";
import { SurveiService } from "~~/server/modules/survei/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, getSurveiSchema);

  return await SurveiService.findAll(query, user.role);
});
