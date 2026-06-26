import type { PaginationSearchSchema } from "~~/server/utils/schema";
import type { CreatePengeluaranSchema, UpdatePengeluaranSchema } from "./model";
import { PengeluaranRepo } from "./repo";

export abstract class PengeluaranService {
  static async create(data: CreatePengeluaranSchema) {
    return PengeluaranRepo.create(data);
  }

  static async update(id: number, data: UpdatePengeluaranSchema) {
    return PengeluaranRepo.update(id, data);
  }

  static async findAll(query: PaginationSearchSchema) {
    return PengeluaranRepo.findAll(query);
  }

  static async deletePengeluaran(ids: number[]) {
    return PengeluaranRepo.delete(ids);
  }
}
