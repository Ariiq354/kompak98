import { TagihanService } from "~~/server/modules/tagihan/service";
import { paginationSearchSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  return await TagihanService.findAllTagihanUser(user.id, query);
});
