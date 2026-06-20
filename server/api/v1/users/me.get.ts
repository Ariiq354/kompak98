import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  const user = authGuard(event);

  return await UserService.getUserProfile(user.id);
});
