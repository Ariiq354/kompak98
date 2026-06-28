export default defineNuxtRouteMiddleware(async (to) => {
  const { data: session } = await authClient.useSession(useFetch);

  if (session.value) {
    const user = useState("user");
    user.value = session.value.user;
  }

  if (to.path === "/login") {
    if (session.value) {
      return navigateTo({ path: "/dashboard" });
    }
  };

  if (to.path.startsWith("/dashboard")) {
    if (!session.value) {
      return navigateTo({ path: "/login", query: { redirect: to.fullPath } });
    }

    const isAdminRoute = to.path.startsWith("/dashboard/admin");
    if (isAdminRoute && session.value.user.role !== "admin") {
      return navigateTo({ path: "/dashboard" });
    }
  }
});
