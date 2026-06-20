import { TagihanService } from "~~/server/modules/tagihan/service";
import { adminGuard } from "~~/server/utils/guard";
import { paginationSearchSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, paginationSearchSchema);

  return await TagihanService.findTagihanBelumDibayar(query);
});
