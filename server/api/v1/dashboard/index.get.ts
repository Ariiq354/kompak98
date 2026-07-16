import { DashboardService } from "~~/server/modules/dashboard/service";

export default defineEventHandler(async (event) => {
  authGuard(event);

  return await DashboardService.getDashboard();
});
