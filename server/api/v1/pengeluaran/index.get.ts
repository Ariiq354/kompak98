import { getPengeluaranSchema } from "~~/server/modules/pengeluaran/model";
import { PengeluaranService } from "~~/server/modules/pengeluaran/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getPengeluaranSchema);

  const result = await PengeluaranService.findAll(query);

  return result;
});
