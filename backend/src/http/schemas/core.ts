import z from "zod";

export const paginationParamsSchema = z.object({
  sortBy: z
    .enum(["id", "gvtId", "name", "productTitle"])
    .optional()
    .default("id"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("asc"),
  search: z.string().optional().default(""),
  page: z
    .string()
    .optional()
    .default("1")
    .transform((val) => parseInt(val, 10))
    .pipe(z.number().int().min(1, "Page must be >= 1")),
  limit: z
    .string()
    .optional()
    .default("10")
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .min(1, "Limit must be >= 1")
        .max(100, "Limit must be <= 100")
    ),
});

export const idParamSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .pipe(z.number().int().min(1, "ID must be a positive integer"));

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
