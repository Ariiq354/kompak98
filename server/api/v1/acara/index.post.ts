import { createAcaraSchema } from "~~/server/modules/acara/model";
import { AcaraService } from "~~/server/modules/acara/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const body = await readValidatedMultipart(event, createAcaraSchema);

  return await AcaraService.create(body);
});
