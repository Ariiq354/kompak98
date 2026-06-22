import { format } from "date-fns";
import { id } from "date-fns/locale";

export function ObjectAssign<T extends object>(data: T, patchData: Partial<T>): T {
  return Object.assign(data, patchData);
}

export function formatDate(value: string | null) {
  if (!value)
    return "-";

  return format(new Date(value), "d MMMM yyyy", {
    locale: id,
  });
}
