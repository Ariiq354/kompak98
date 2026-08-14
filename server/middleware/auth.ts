import type { UserWithId } from "../utils/auth";
import { auth } from "../utils/auth";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });
  if (session?.user) {
    event.context.user = {
      ...session.user,
      id: Number(session.user.id), // <-- konversi runtime ke number di sini
    };
  }
  else {
    event.context.user = undefined;
  }
});

declare module "h3" {
  interface H3EventContext {
    user: UserWithId | undefined;
  }
}
