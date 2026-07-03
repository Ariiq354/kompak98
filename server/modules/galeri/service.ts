import type { GetGaleriSchema } from "./model";
import { deleteFile, getFileExtension, uploadFile } from "~~/server/utils/files";
import { GaleriRepo } from "./repo";

export abstract class GaleriService {
  static async createFolder(name: string, parentId: number | null, userId: number) {
    return await GaleriRepo.createFolder(name, parentId, userId);
  }

  static async uploadFiles(parentId: number | null, files: any[], userId: number) {
    const results = [];
    for (const fileData of files) {
      const extension = getFileExtension(fileData.filename || "file");
      const originalName = fileData.filename || "unnamed";

      const { key } = await uploadFile(
        "galeri",
        originalName,
        fileData.data,
        fileData.type || "application/octet-stream",
      );

      const fileRecord = await GaleriRepo.createFile({
        name: originalName,
        parentId,
        mimeType: fileData.type || "application/octet-stream",
        extension,
        originalName,
        path: key,
        size: fileData.data.length,
        createdBy: userId,
      });

      results.push(fileRecord);
    }
    return results;
  }

  static async rename(id: number, name: string) {
    const item = await GaleriRepo.findById(id);
    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: "Item tidak ditemukan",
      });
    }
    return await GaleriRepo.rename(id, name);
  }

  static async findAll(query: GetGaleriSchema) {
    return await GaleriRepo.findAll(query);
  }

  static async findById(id: number) {
    const item = await GaleriRepo.findById(id);
    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: "Item tidak ditemukan",
      });
    }
    return item;
  }

  static async getDetails(id: number) {
    const item = await this.findById(id);
    const breadcrumbs = await GaleriRepo.getBreadcrumbs(id);
    return { item, breadcrumbs };
  }

  static async deleteItem(id: number) {
    const item = await GaleriRepo.findById(id);
    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: "Item tidak ditemukan",
      });
    }

    if (item.isFolder) {
      const descendants = await GaleriRepo.getDescendants(id);
      for (const desc of descendants) {
        if (!desc.isFolder && desc.path) {
          try {
            await deleteFile(desc.path);
          }
          catch (err) {
            console.error(`Failed to delete file from storage: ${desc.path}`, err);
          }
        }
      }
    }
    else if (item.path) {
      try {
        await deleteFile(item.path);
      }
      catch (err) {
        console.error(`Failed to delete file from storage: ${item.path}`, err);
      }
    }

    return await GaleriRepo.delete(id);
  }
}
