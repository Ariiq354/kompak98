import { createPengeluaranSchema } from "~~/server/modules/pengeluaran/model";
import { PengeluaranService } from "~~/server/modules/pengeluaran/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createPengeluaranSchema);

  await PengeluaranService.create(body);

  return {
    message: "Success",
  };
});
