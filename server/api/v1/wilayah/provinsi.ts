import { WilayahService } from "~~/server/modules/wilayah/service";

export default defineEventHandler(async (event) => {
  authGuard(event);

  return await WilayahService.findProvincies();
});
