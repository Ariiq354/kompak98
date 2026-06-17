import { TagihanService } from "~~/server/modules/tagihan/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  return await TagihanService.updateStatusUser(params.id);
});
