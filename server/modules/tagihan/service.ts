import type { CreateTagihanKhususSchema, UpdateStatusAdminSchema, UpdateTagihanSchema } from "./model";
import { TagihanRepo } from "./repo";

export abstract class TagihanService {
  static async createKasBulanan() {
    return await TagihanRepo.createKasBulanan();
  }

  static async createTagihanKhusus(payload: CreateTagihanKhususSchema) {
    return await TagihanRepo.createTagihanKhusus(payload);
  }

  static async updateTagihan(id: number, payload: UpdateTagihanSchema) {
    const result = await TagihanRepo.update(id, payload);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        data: {
          code: "TAGIHAN_MISSING",
          message: "Tagihan tidak ditemukan",
        },
      });
    }
  }

  static async deleteTagihan(ids: number[]) {
    const result = await TagihanRepo.delete(ids);
    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        data: {
          code: "TAGIHAN_MISSING",
          message: "Tagihan tidak ditemukan",
        },
      });
    }
  }

  static async updateStatusAdmin(tagihanAnggotaId: number, payload: UpdateStatusAdminSchema) {
    const result = await TagihanRepo.updateStatusAnggota(
      tagihanAnggotaId,
      payload.status,
      payload.status === "lunas" ? new Date() : null,
    );

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        data: { code: "TAGIHAN_ANGGOTA_MISSING", message: "Tagihan tidak ditemukan" },
      });
    }
    return result[0];
  }

  static async updateStatusUser(tagihanAnggotaId: number) {
    const result = await TagihanRepo.updateStatusAnggota(
      tagihanAnggotaId,
      "menunggu_verifikasi",
      new Date(),
    );

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        data: { code: "TAGIHAN_ANGGOTA_MISSING", message: "Tagihan tidak ditemukan" },
      });
    }
    return result[0];
  }

  static async findAllTagihan(query: PaginationSearchSchema) {
    return await TagihanRepo.findAll(query);
  }

  static async findTagihanBelumDibayar(query: PaginationSearchSchema) {
    return await TagihanRepo.findBelumDibayarByUser(query);
  }

  static async findAllTagihanUser(userId: number, query: PaginationSearchSchema) {
    return await TagihanRepo.findAllByUser(userId, query);
  }
}
