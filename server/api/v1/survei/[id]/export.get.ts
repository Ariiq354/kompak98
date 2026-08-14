import { SurveiService } from "~~/server/modules/survei/service";
import { idParamsSchema } from "~~/server/utils/schema";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const params = await getValidatedRouterParamsSafe(event, idParamsSchema);

  const { survei, csv } = await SurveiService.exportHasilResponCsv(params.id);

  const safeFilename = `hasil-survei-${survei.judul.toLowerCase().replace(/[^a-z0-9]/g, "-")}.csv`;

  setResponseHeaders(event, {
    "Content-Disposition": `attachment; filename="${safeFilename}"`,
    "Content-Type": "text/csv; charset=utf-8",
  });

  return `\uFEFF${csv}`;
});
