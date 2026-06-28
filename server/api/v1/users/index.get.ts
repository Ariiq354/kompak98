import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  return await UserService.getMonitoringUser(query);
});
