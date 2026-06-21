import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  const result = await IuranKhususService.getAllIuranKhusus(query);

  return result;
});
