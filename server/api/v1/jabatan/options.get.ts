import { JabatanService } from "~~/server/modules/jabatan/service";

export default defineEventHandler(async (event) => {
  authGuard(event);

  const result = await JabatanService.getJabatanOption();

  return result;
});
