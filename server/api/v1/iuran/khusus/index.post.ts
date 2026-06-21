import { createIuranKhususSchema } from "~~/server/modules/iuran-khusus/model";
import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createIuranKhususSchema);

  await IuranKhususService.createIuranKhusus(body);

  return {
    message: "Success",
  };
});
