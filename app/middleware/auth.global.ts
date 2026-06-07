import { authClient } from "~/utils/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (to.path === "/login") {
    if (session.value) {
      return navigateTo({ path: "/dashboard" });
    }
  };

  if (to.path.startsWith("/dashboard")) {
    if (!session.value) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }
  }
});
