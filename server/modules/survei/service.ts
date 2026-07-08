import type { CreateSurveiSchema, GetSurveiSchema, SubmitResponSchema, UpdateSurveiSchema } from "./model";
import { SurveiRepo } from "./repo";

export abstract class SurveiService {
  static async create(payload: CreateSurveiSchema) {
    return await SurveiRepo.create(payload);
  }

  static async update(id: number, payload: UpdateSurveiSchema) {
    const survei = await SurveiRepo.findById(id);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }
    return await SurveiRepo.update(id, payload);
  }

  static async findById(id: number) {
    const survei = await SurveiRepo.findById(id);
    if (!survei) {
      throw createError({
        statusCode: 404,
        message: "Survei tidak ditemukan",
      });
    }
    return survei;
  }

  static async findAll(query: GetSurveiSchema) {
    return await SurveiRepo.findAll(query);
  }

  static async delete(ids: number[]) {
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
