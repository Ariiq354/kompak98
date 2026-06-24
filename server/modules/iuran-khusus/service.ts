import type { CreateIuranKhususSchema, CreatePembayaranKhususSchema, UpdateIuranKhususSchema } from "./model";
import { format, startOfToday } from "date-fns";

import { IuranKhususRepo } from "./repo";

export abstract class IuranKhususService {
  static async createIuranKhusus(payload: CreateIuranKhususSchema) {
    await IuranKhususRepo.createIuranKhusus(payload);
  }

  static async updateIuranKhusus(id: number, payload: UpdateIuranKhususSchema) {
    await IuranKhususRepo.updateIuranKhusus(id, payload);
  }

  static async deleteIuranKhusus(ids: number[]) {
    await IuranKhususRepo.deleteIuranKhusus(ids);
  }

  static async getIuranKhususNominal(query: PaginationSearchSchema) {
    return await IuranKhususRepo.getIuranKhususNominal(query);
  }

  static async getIuranKhusus(query: PaginationSearchSchema) {
    return await IuranKhususRepo.getIuranKhusus(query);
  }

  static async getHistoryPembayaranByUser(userId: number, iuranId: number) {
    return await IuranKhususRepo.getPembayaranIuranKhusus(iuranId, userId);
  }

  static async getHistoryPembayaran(iuranId: number) {
    return await IuranKhususRepo.getPembayaranIuranKhusus(iuranId);
  }

  static async pembayaranIuranKhusus(userId: number, payload: CreatePembayaranKhususSchema) {
    const isValid = await IuranKhususRepo.checkIuranTanggalAkhir(payload.iuranId);

    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: "Masa berlaku iuran ini sudah berakhir atau tidak ditemukan.",
      });
    }

    return await IuranKhususRepo.pembayaranIuranKhusus(userId, payload);
  }

  static async updateStatusPembayaranIuranKhususAdmin(pembayaranId: number) {
    const result = await IuranKhususRepo.updateStatusPembayaranKhusus(
      pembayaranId,
      "lunas",
    );

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Iuran tidak ditemukan",
        data: {
          code: "IURAN_ANGGOTA_MISSING",
        },
      });
    }
  }

  static async updateStatusPembayaranIuranKhususUser(pembayaranId: number) {
    const today = format(startOfToday(), "yyyy-MM-dd");
    const result = await IuranKhususRepo.updateStatusPembayaranKhusus(
      pembayaranId,
      "menunggu_verifikasi",
      today,
    );

    if (result.length === 0) {
      throw createError({
        statusCode: 404,
        message: "Iuran tidak ditemukan",
        data: {
          code: "IURAN_ANGGOTA_MISSING",
        },
      });
    }
  }
}
