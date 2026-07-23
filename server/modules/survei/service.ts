import type { CreateSurveiSchema, GetSurveiSchema, SubmitResponSchema, UpdateSurveiSchema } from "./model";
import { deleteFile, deleteFiles, uploadFile } from "~~/server/utils/files";
import { SurveiRepo } from "./repo";

export abstract class SurveiService {
  static async create(userId: number, payload: CreateSurveiSchema) {
    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file) {
      const fileData = file;
      const { key } = await uploadFile(
        "survei",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;
    }

    return await SurveiRepo.create(userId, {
      ...data,
      headerGambar: fileKey || data.headerGambar,
    });
  }

  static async update(id: number, payload: UpdateSurveiSchema) {
    const survei = await SurveiRepo.findById(id);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }

    const hasRespon = await SurveiRepo.hasRespon(id);
    if (hasRespon) {
      throw createError({
        statusCode: 400,
        message: "Survei tidak dapat diubah karena sudah memiliki respon",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file) {
      const fileData = file;
      const { key } = await uploadFile(
        "survei",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;
    }

    if (survei.headerGambar && (fileKey || data.headerGambar === "" || data.headerGambar === null)) {
      await deleteFile(survei.headerGambar);
    }

    return await SurveiRepo.update(id, {
      ...data,
      headerGambar: fileKey !== undefined ? fileKey : (data.headerGambar || null),
    });
  }

  static async findById(id: number, userRole?: string | null) {
    const survei = await SurveiRepo.findById(id);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }

    const onlyPublished = userRole !== "admin";
    if (onlyPublished && survei.status !== "published") {
      throw createError({
        statusCode: 403,
        message: "Survei belum dipublikasikan atau masih berupa draft",
      });
    }
    return survei;
  }

  static async findAll(query: GetSurveiSchema, userRole?: string | null) {
    const onlyPublished = userRole !== "admin" || query.status === "published";
    return await SurveiRepo.findAll(query, { onlyPublished });
  }

  static async delete(ids: number[]) {
    const surveis = await SurveiRepo.findByIds(ids);
    const keys = surveis
      .map(s => s.headerGambar)
      .filter((k): k is string => !!k);

    if (keys.length > 0) {
      await deleteFiles(keys);
    }

    return await SurveiRepo.delete(ids);
  }

  static async submitRespon(surveiId: number, userId: number, payload: SubmitResponSchema) {
    const survei = await SurveiRepo.findById(surveiId);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }

    if (survei.status !== "published") {
      throw createError({
        statusCode: 400,
        message: "Survei belum dipublikasikan atau masih berupa draft",
      });
    }

    const now = new Date();
    if (survei.tanggalMulai && now < new Date(survei.tanggalMulai)) {
      throw createError({
        statusCode: 400,
        message: "Survei belum dimulai",
      });
    }

    if (survei.tanggalSelesai && now > new Date(survei.tanggalSelesai)) {
      throw createError({
        statusCode: 400,
        message: "Survei telah berakhir",
      });
    }

    const hasResponded = await SurveiRepo.hasUserResponded(surveiId, userId);
    if (hasResponded) {
      throw createError({
        statusCode: 400,
        message: "Anda sudah mengisi survei ini",
      });
    }

    const requiredQuestions = survei.pertanyaan.filter(p => p.wajib);
    const answeredQuestionIds = new Set(payload.jawaban.map(j => j.pertanyaanId));

    for (const rq of requiredQuestions) {
      if (!answeredQuestionIds.has(rq.id)) {
        throw createError({
          statusCode: 400,
          message: `Pertanyaan "${rq.pertanyaan}" wajib diisi`,
        });
      }
    }

    const surveyQuestionIds = new Set(survei.pertanyaan.map(p => p.id));
    for (const jaw of payload.jawaban) {
      if (!surveyQuestionIds.has(jaw.pertanyaanId)) {
        throw createError({
          statusCode: 400,
          message: `Pertanyaan ID ${jaw.pertanyaanId} bukan bagian dari survei ini`,
        });
      }
    }

    return await SurveiRepo.submitRespon(surveiId, userId, payload);
  }

  static async getHasilRespon(surveiId: number) {
    const survei = await SurveiRepo.findById(surveiId);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }
    return await SurveiRepo.getHasilRespon(surveiId);
  }
}
