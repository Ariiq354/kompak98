interface ProvinsiOption {
  id: number;
  provinsi: string;
}

interface KotaOption {
  id: number;
  idProvinsi: number;
  kota: string;
}

type FetchStatus = "idle" | "pending" | "success" | "error";

export function useProvinsiOptions() {
  const data = useState<ProvinsiOption[]>("wilayah-provinsi-options", () => []);
  const status = useState<FetchStatus>("wilayah-provinsi-status", () => "idle");

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

export function useKotaOptions() {
  const data = useState<Record<number, KotaOption[]>>("wilayah-kota-options", () => ({}));
  const status = useState<Record<number, FetchStatus>>("wilayah-kota-status", () => ({}));

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
