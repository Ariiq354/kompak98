import { JabatanService } from "~~/server/modules/jabatan/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);

  const result = await JabatanService.getJabatanOption();

  return result;
});
