import { getMonitoringUserSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, getMonitoringUserSchema);

  return await UserService.getPegawaiList(query);
});
