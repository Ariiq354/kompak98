import { getRegenciesSchema } from "~~/server/modules/wilayah/model";
import { WilayahService } from "~~/server/modules/wilayah/service";

export default defineEventHandler(async (event) => {
  authGuard(event);
  const query = await getValidatedQuerySafe(event, getRegenciesSchema);

  return await WilayahService.findRegencies(query);
});
