import type { CreateAcaraSchema, GetAcaraSchema, UpdateAcaraSchema } from "./model";
import { deleteFile, uploadFile } from "~~/server/utils/files";
import { AcaraRepo } from "./repo";

export abstract class AcaraService {
  static async create(payload: CreateAcaraSchema) {
    const { file, ...data } = payload;
    const fileData = file;

    const { key } = await uploadFile(
      "acara",
      fileData.filename!,
      fileData.data,
      fileData.type!,
    );

    return await AcaraRepo.create(data, key);
  }

  static async update(id: number, payload: UpdateAcaraSchema) {
    const event = await AcaraRepo.findById(id);

    if (!event) {
      throw createError({
        statusCode: 404,
        statusMessage: "Acara tidak ditemukan",
      });
    }

    const { file, ...data } = payload;
    let fileKey: string | undefined;

    if (file) {
      const fileData = file;
      const { key } = await uploadFile(
        "acara",
        fileData.filename!,
        fileData.data,
        fileData.type!,
      );
      fileKey = key;

      // Delete the old file
      if (event.foto) {
        await deleteFile(event.foto);
      }
    }

    return await AcaraRepo.update(id, data, fileKey);
  }

  static async findAll(query: GetAcaraSchema) {
    return await AcaraRepo.findAll(query);
  }

  static async deleteAcara(ids: number[]) {
    const events = await AcaraRepo.findByIds(ids);

    // Delete associated files from storage
    for (const event of events) {
      if (event.foto) {
        await deleteFile(event.foto);
      }
    }

    return await AcaraRepo.delete(ids);
  }

  static async findBelum() {
    return await AcaraRepo.findBelum();
  }

  static async findSudah() {
    return await AcaraRepo.findSudah();
  }
}
