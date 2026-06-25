import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreatePengeluaranSchema } from "./model";
import { createPengeluaranSchema } from "./model";
import { PengeluaranRepo } from "./repo";

export abstract class PengeluaranService {
  static async create(data: CreatePengeluaranSchema) {
    const validatedData = createPengeluaranSchema.parse(data);
    return PengeluaranRepo.create(validatedData);
  }

  static async findAll(query: PaginationSearchSchema) {
    return PengeluaranRepo.findAll(query);
  }

  static async deletePengeluaran(ids: number[]) {
    return PengeluaranRepo.delete(ids);
  }
}
