import { AcaraService } from "~~/server/modules/acara/service";

export default defineEventHandler(async () => {
  return await AcaraService.findSudah();
});
