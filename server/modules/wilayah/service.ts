import type { GetRegenciesSchema } from "./model";
import { WilayahRepo } from "./repo";

export abstract class WilayahService {
  static async findProvincies() {
    return await WilayahRepo.findProvincies();
  }

  static async findRegencies(query: GetRegenciesSchema) {
    return await WilayahRepo.findRegencies(query);
  }
}
