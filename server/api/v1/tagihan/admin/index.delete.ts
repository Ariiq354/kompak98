import { TagihanService } from "~~/server/modules/tagihan/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  return await TagihanService.deleteTagihan(body.ids);
});
