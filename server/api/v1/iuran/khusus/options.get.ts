import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);

  const result = await IuranKhususService.getIuranKhususOptions();

  return result;
});
