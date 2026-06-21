import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  const result = await IuranKhususService.getIuranKhusuByUser(user.id, query);

  return result;
});
