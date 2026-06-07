export function ObjectAssign<T extends object>(data: T, patchData: Partial<T>): T {
  return Object.assign(data, patchData);
}
