import { AcaraService } from "~~/server/modules/acara/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedBodySafe(event, deleteSchema);

  await AcaraService.deleteAcara(body.ids);

  return {
    message: "Success",
  };
});
