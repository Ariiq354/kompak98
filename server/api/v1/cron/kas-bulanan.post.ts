import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";

export default defineEventHandler(async () => {
  await IuranBulananService.createKasBulanan();

  return {
    message: "Success",
  };
});
