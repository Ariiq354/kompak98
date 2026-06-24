import { createPembayaranKhususSchema } from "~~/server/modules/iuran-khusus/model";
import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, createPembayaranKhususSchema);

  const result = await IuranKhususService.pembayaranIuranKhusus(user.id, body);

  return result;
});
