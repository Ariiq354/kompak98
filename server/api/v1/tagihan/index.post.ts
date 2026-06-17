import { createTagihanKhususSchema } from "~~/server/modules/tagihan/model";
import { TagihanService } from "~~/server/modules/tagihan/service";
import { adminGuard } from "~~/server/utils/guard";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, createTagihanKhususSchema);

  return await TagihanService.createTagihanKhusus(body);
});
