import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await UserService.getUserProfile(params.id);
});
