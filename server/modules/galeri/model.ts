import { z } from "zod";
import { multipartFiles } from "~~/server/utils/schema";

export const createFolderSchema = z.object({
  name: z.string().min(1),
  parentId: z.coerce.number().nullable().optional(),
});

export type CreateFolderSchema = z.infer<typeof createFolderSchema>;

export const uploadFileSchema = z.object({
  parentId: z.coerce.number().nullable().optional(),
  file: multipartFiles({
    minCount: 1,
    maxCount: 10,
    maxSize: 50 * 1024 * 1024,
  }),
});

export type UploadFileSchema = z.infer<typeof uploadFileSchema>;

export const renameSchema = z.object({
  name: z.string().min(1),
});

export type RenameSchema = z.infer<typeof renameSchema>;

export const getGaleriSchema = z.object({
  parentId: z.coerce.number().nullable().optional(),
  search: z.string().optional(),
});

export type GetGaleriSchema = z.infer<typeof getGaleriSchema>;
