import { IuranBulananService } from "~~/server/modules/iuran-bulanan/service";
import { env } from "~~/shared/env";

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, "Authorization");
  const expectedAuthHeader = `Bearer ${env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedAuthHeader) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  await IuranBulananService.createKasBulanan();

  return {
    message: "Success",
  };
});
