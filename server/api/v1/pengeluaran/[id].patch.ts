import { updatePengeluaranSchema } from "~~/server/modules/pengeluaran/model";
import { PengeluaranService } from "~~/server/modules/pengeluaran/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updatePengeluaranSchema);

  const result = await PengeluaranService.update(params.id, body);

  return result;
});
