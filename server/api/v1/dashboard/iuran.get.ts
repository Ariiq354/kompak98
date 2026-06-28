import { DashboardService } from "~~/server/modules/dashboard/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);

  return await DashboardService.getDashboardTransaksi();
});
