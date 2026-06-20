import { TagihanService } from "~~/server/modules/tagihan/service";

export default defineEventHandler(async () => {
  return await TagihanService.createKasBulanan();
});
