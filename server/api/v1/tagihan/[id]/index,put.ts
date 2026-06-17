import { updateTagihanSchema } from "~~/server/modules/tagihan/model";
import { TagihanService } from "~~/server/modules/tagihan/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);
  const body = await readValidatedBodySafe(event, updateTagihanSchema);

  return await TagihanService.updateTagihan(params.id, body);
});
