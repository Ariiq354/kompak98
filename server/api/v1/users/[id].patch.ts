import { updateUserSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedMultipart(event, updateUserSchema);

  return await UserService.updateByAdmin(params.id, body);
});
