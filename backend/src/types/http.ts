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
  page: z.number().int().min(1, "Page must be >= 1").optional().default(1),
  limit: z
    .number()
    .int()
    .min(1, "Limit must be >= 1")
    .max(100, "Limit must be <= 100")
    .optional()
    .default(10),
});

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
