import { createFolderSchema } from "~~/server/modules/galeri/model";
import { GaleriService } from "~~/server/modules/galeri/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedBodySafe(event, createFolderSchema);

  return await GaleriService.createFolder(body.name, body.parentId || null, user.id);
});
