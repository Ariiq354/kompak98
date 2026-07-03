import { createFolderSchema } from "~~/server/modules/galeri/model";
import { GaleriService } from "~~/server/modules/galeri/service";

export default defineEventHandler(async (event) => {
  const user = adminGuard(event);
  const body = await readValidatedBodySafe(event, createFolderSchema);

  return await GaleriService.createFolder(body.name, body.parentId || null, user.id);
});
