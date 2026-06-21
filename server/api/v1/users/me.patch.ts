import { updateUserSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);
  const body = await readValidatedMultipart(event, updateUserSchema);

  return await UserService.updateUser(user, body);
});
