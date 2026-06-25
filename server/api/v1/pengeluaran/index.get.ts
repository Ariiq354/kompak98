import { PengeluaranService } from "~~/server/modules/pengeluaran/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  const result = await PengeluaranService.findAll(query);

  return result;
});
