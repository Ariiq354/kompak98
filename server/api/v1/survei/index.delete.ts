import { SurveiService } from "~~/server/modules/survei/service";
import { deleteSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  await SurveiService.delete(body.ids);

  return {
    message: "Success",
  };
});
