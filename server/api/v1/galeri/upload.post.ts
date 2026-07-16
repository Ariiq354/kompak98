import { uploadFileSchema } from "~~/server/modules/galeri/model";
import { GaleriService } from "~~/server/modules/galeri/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedMultipart(event, uploadFileSchema);

  return await GaleriService.uploadFiles(body.parentId || null, body.file, user.id);
});
