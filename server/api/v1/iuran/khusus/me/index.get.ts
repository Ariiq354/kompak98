import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  const result = await IuranKhususService.getIuranKhusus(query);

  return result;
});
