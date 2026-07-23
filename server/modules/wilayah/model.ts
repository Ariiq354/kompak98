import z from "zod";

export const getRegenciesSchema = z.object({
  provinsiId: z.coerce.number().int().positive().optional(),
});

export type GetRegenciesSchema = z.infer<typeof getRegenciesSchema>;
