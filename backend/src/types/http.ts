import { z } from "zod";

export type HttpResult<T> = success<T> | failure;

type success<T> = T;

type failure = {
  error: string;
  status: number;
};

export const Success = <T>(data: T): success<T> => data;

export const Failure = (error: string, status: number): failure => ({
  error,
  status: status,
});

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

// Schema for validating URL path parameters (like :id)
export const idParamSchema = z
  .string()
  .transform((val) => parseInt(val, 10))
  .pipe(z.number().int().min(1, "ID must be a positive integer"));

export type PaginationParams = z.infer<typeof paginationParamsSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
