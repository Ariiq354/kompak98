import type { H3Event } from "h3";

export function authGuard(event: H3Event) {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      message: "Unauthenticated",
    });
  }

  return event.context.user;
}
