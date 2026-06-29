import { adminClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/vue";

export function useAuthClient() {
  const url = useRequestURL();
  const headers = import.meta.server
    ? useRequestHeaders(["cookie"])
    : undefined;

  return createAuthClient({
    baseURL: url.origin,
    fetchOptions: { headers },
    plugins: [usernameClient(), adminClient()],
  });
}
