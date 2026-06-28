import { getMonitoringUserSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getMonitoringUserSchema);

  return await UserService.getMonitoringUser(query);
});
