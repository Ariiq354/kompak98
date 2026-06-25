import { PengeluaranService } from "~~/server/modules/pengeluaran/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  await PengeluaranService.deletePengeluaran(body.ids);

  return {
    message: "Success",
  };
});
