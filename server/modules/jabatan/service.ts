import { JabatanRepo } from "./repo";

export abstract class JabatanService {
  static async getJabatanOption() {
    return await JabatanRepo.getJabatanOption();
  }
}
