import { Buffer } from "node:buffer";
import { z } from "zod";

const multipartFileSchema = z.object({
  name: z.string().optional(),
  filename: z.string().optional(),
  type: z.string().optional(),
  data: z.instanceof(Buffer),
});

export type MultipartFile = z.infer<typeof multipartFileSchema>;

interface MultipartFilesOptions {
  minCount?: number;
  maxCount?: number;
  minSize?: number;
  maxSize?: number;
  fileTypes?: string[];
}

interface MultipartFileOptions {
  minSize?: number;
  maxSize?: number;
  fileTypes?: string[];
}

export function multipartFiles({
  minCount,
  maxCount,
  minSize,
  maxSize,
  fileTypes,
}: MultipartFilesOptions = {}) {
  const fileSchema = multipartFileSchema.superRefine(
    (file: MultipartFile, ctx) => {
      if (
        minSize !== undefined
        && file.data.length < minSize
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be at least ${minSize} bytes`,
        });
      }

      if (
        maxSize !== undefined
        && file.data.length > maxSize
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be at most ${maxSize} bytes`,
        });
      }

      if (
        fileTypes?.length
        && (!file.type || !fileTypes.includes(file.type))
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be one of: ${fileTypes.join(", ")}`,
        });
      }
    },
  );

  return z.preprocess(
    (value) => {
      if (value == null) {
        return [];
      }

      return Array.isArray(value)
        ? value
        : [value];
    },
    z.array(fileSchema).superRefine((files, ctx) => {
      if (
        minCount !== undefined
        && files.length < minCount
      ) {
        ctx.addIssue({
          code: "too_small",
          minimum: minCount,
          inclusive: true,
          origin: "array",
          message: `Minimum ${minCount} file(s) required`,
        });
      }

      if (
        maxCount !== undefined
        && files.length > maxCount
      ) {
        ctx.addIssue({
          code: "too_big",
          maximum: maxCount,
          inclusive: true,
          origin: "array",
          message: `Maximum ${maxCount} file(s) allowed`,
        });
      }
    }),
  );
}

export function multipartFile({
  minSize,
  maxSize,
  fileTypes,
}: MultipartFileOptions = {}) {
  const fileSchema = multipartFileSchema.superRefine(
    (file, ctx) => {
      if (
        minSize !== undefined
        && file.data.length < minSize
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be at least ${minSize} bytes`,
        });
      }

      if (
        maxSize !== undefined
        && file.data.length > maxSize
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be at most ${maxSize} bytes`,
        });
      }

      if (
        fileTypes?.length
        && (!file.type || !fileTypes.includes(file.type))
      ) {
        ctx.addIssue({
          code: "custom",
          message: `File "${file.filename ?? "unknown"}" must be one of: ${fileTypes.join(", ")}`,
        });
      }
    },
  );

  return z.preprocess(
    (value) => {
      if (value == null) {
        return undefined;
      }

      return Array.isArray(value)
        ? value[0]
        : value;
    },
    fileSchema,
  );
}

export const paginationSearchSchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  search: z.string().optional(),
});

export type PaginationSearchSchema = z.infer<typeof paginationSearchSchema>;

export const deleteSchema = z.object({
  ids: z.array(z.number()).default([]),
});

export type DeleteSchema = z.infer<typeof deleteSchema>;

export const idParamsSchema = z.object({
  id: z.coerce.number(),
});

export function treeifyError(error: z.ZodError, mapper = (issue: z.ZodIssue) => issue.message) {
  const result: any = { errors: [] };
  const processError = (err: { issues: z.ZodIssue[] }, path: PropertyKey[] = []) => {
    for (const issue of err.issues) {
      if (issue.code === "invalid_union" && (issue as any).errors?.length) {
        (issue as any).errors.map((subError: any) => processError({ issues: subError.issues }, [...path, ...issue.path]));
      }
      else if (issue.code === "invalid_key") {
        processError({ issues: (issue as any).issues }, [...path, ...issue.path]);
      }
      else if (issue.code === "invalid_element") {
        processError({ issues: (issue as any).issues }, [...path, ...issue.path]);
      }
      else {
        const fullpath = [...path, ...issue.path];
        if (fullpath.length === 0) {
          result.errors.push(mapper(issue));
          continue;
        }
        let curr = result;
        let i = 0;
        while (i < fullpath.length) {
          const el = fullpath[i]!;
          const terminal = i === fullpath.length - 1;
          if (typeof el === "string") {
            curr.properties ?? (curr.properties = {});
            curr.properties[el] ?? (curr.properties[el] = { errors: [] });
            curr = curr.properties[el];
          }
          else if (typeof el === "number") {
            curr.items ?? (curr.items = []);
            curr.items[el] ?? (curr.items[el] = { errors: [] });
            curr = curr.items[el];
          }
          if (terminal) {
            curr.errors.push(mapper(issue));
          }
          i++;
        }
      }
    }
  };
  processError(error);
  return result;
}
