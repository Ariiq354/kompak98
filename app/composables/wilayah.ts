export interface ProvinsiOption {
  id: number;
  provinsi: string;
}

export interface KotaOption {
  id: number;
  idProvinsi: number;
  kota: string;
}

type FetchStatus = "idle" | "pending" | "success" | "error";

/**
 * Composable to manage the state and fetching of Province (Provinsi) options.
 * Utilizes Nuxt's `useState` for global application caching and SSR safety.
 */
export function useProvinsiOptions() {
  const data = useState<ProvinsiOption[]>("wilayah-provinsi-options", () => []);
  const status = useState<FetchStatus>("wilayah-provinsi-status", () => "idle");

  /**
   * Fetches the provinces list from the backend API.
   * Resolves immediately if a fetch is already in progress or completed successfully.
   */
  async function load() {
    if (status.value === "pending" || status.value === "success")
      return;

    status.value = "pending";
    try {
      data.value = await $fetch<ProvinsiOption[]>("/api/v1/wilayah/provinsi");
      status.value = "success";
    }
    catch {
      status.value = "error";
    }
  }

  return { data, status, load };
}

/**
 * Composable to manage the state and fetching of City/Regency (Kota/Kabupaten) options.
 * Caches results globally grouped by province ID to prevent redundant network requests.
 */
export function useKotaOptions() {
  const data = useState<Record<number, KotaOption[]>>("wilayah-kota-options", () => ({}));
  const status = useState<Record<number, FetchStatus>>("wilayah-kota-status", () => ({}));

  /**
   * Fetches the cities list for a specific province ID.
   * Resolves immediately if the data for the province is already cached or currently loading.
   */
  async function load(provinsiId: number) {
    if (status.value[provinsiId] === "pending" || data.value[provinsiId])
      return;

    status.value[provinsiId] = "pending";
    try {
      data.value[provinsiId] = await $fetch<KotaOption[]>("/api/v1/wilayah/kota", {
        query: { provinsiId },
      });
      status.value[provinsiId] = "success";
    }
    catch {
      status.value[provinsiId] = "error";
    }
  }

  return { data, status, load };
}
