import { IuranKhususService } from "~~/server/modules/iuran-khusus/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  await IuranKhususService.deleteIuranKhusus(body.ids);

  return {
    message: "Success",
  };
});
