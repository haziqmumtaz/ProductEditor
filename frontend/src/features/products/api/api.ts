import { apiHttpClient } from "../../../lib/http";
import type { Product } from "../types";

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export const productsApi = {
  list: () => apiHttpClient.get<Product[]>("/api/products"),
  listWithOptions: (
    page: number,
    limit: number,
    sortBy: string,
    sortOrder: string,
    search: string
  ) =>
    apiHttpClient.get<PaginatedResponse<Product>>(`/api/products`, {
      page,
      limit,
      sortBy,
      sortOrder,
      search,
    }),
  get: (id: number) => apiHttpClient.get<Product>(`/api/products/${id}`),
  patch: (id: number, product: Product) =>
    apiHttpClient.patch<Product, Product>(`/api/products/${id}`, product),
  create: (product: Product) =>
    apiHttpClient.post<Product, Product>("/api/products", product),
  delete: (id: number) =>
    apiHttpClient.delete<Pick<Product, "id">>(`/api/products/${id}`),
};
