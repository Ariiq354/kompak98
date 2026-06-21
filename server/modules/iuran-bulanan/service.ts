import type { CreatePembayaranBulananSchema, GetAllUserKasBulananByTahunSchema } from "./model";
import { format, startOfToday } from "date-fns";
import { IuranBulananRepo } from "./repo";

export abstract class IuranBulananService {
  static async createKasBulanan() {
    return await IuranBulananRepo.createKasBulanan();
  }

  static async getKasBulananByUser(userId: number, query: PaginationSearchSchema) {
    return await IuranBulananRepo.getKasBulananByUser(userId, query);
  }

  static async getAllUserKasBulananByTahun({ tahun, ...query }: GetAllUserKasBulananByTahunSchema) {
    return await IuranBulananRepo.getAllUserKasBulananByTahun(tahun, query);
  }

  static async pembayaranKasBulanan(userId: number, payload: CreatePembayaranBulananSchema) {
    const existing = await IuranBulananRepo.checkExistingBulanPembayaran(userId, payload.iuranId);

    const bulanSudahAda = new Set(existing.map(u => u.bulan));
    const conflict = payload.periode.filter(b => bulanSudahAda.has(b));
    if (conflict.length > 0) {
      throw createError({
        statusCode: 400,
        message: `Bulan sudah pernah dipilih/dibayar: ${conflict.join(", ")}`,
      });
    }

    return await IuranBulananRepo.pembayaranKasBulanan(userId, payload);
  }

  static async updateStatusPembayaranKasBulananAdmin(pembayaranId: number) {
    const result = await IuranBulananRepo.updateStatusPembayaranKasBulanan(
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

  static async updateStatusPembayaranKasBulananUser(pembayaranId: number) {
    const today = format(startOfToday(), "yyyy-MM-dd");
    const result = await IuranBulananRepo.updateStatusPembayaranKasBulanan(
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

  static async getRingkasanKasByTahun(tahun: number) {
    const { nominalSeharusnya, nominalDibayar } = await IuranBulananRepo.getRingkasanKasByTahun(tahun);

    return {
      totalKas: nominalDibayar,
      totalBelumBayar: nominalSeharusnya - nominalDibayar,
      persentase: (nominalDibayar / nominalSeharusnya * 100).toFixed(2),
    };
  }
}
