import { createSurveiSchema } from "~~/server/modules/survei/model";
import { SurveiService } from "~~/server/modules/survei/service";

export default defineEventHandler(async (event) => {
  const user = adminGuard(event);
  const body = await readValidatedBodySafe(event, createSurveiSchema);

  return await SurveiService.create(user.id, body);
});
