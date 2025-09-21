import { useBaseApi, type ApiComposable } from "../../../lib/useBaseApi";
import { productsApi, type PaginatedResponse } from "./api";
import type { Product } from "../types";

export interface ProductsQueryParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export function useGetProducts(): ApiComposable<PaginatedResponse<Product>> {
  const { response, loading, error, executeApiCall } = useBaseApi<
    PaginatedResponse<Product>
  >({
    defaultErrorMessage: "Failed to load products",
  });

  async function execute(
    params: ProductsQueryParams = {}
  ): Promise<PaginatedResponse<Product>> {
    const {
      query = "",
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "asc",
    } = params;

    return executeApiCall(() =>
      productsApi.listWithOptions(page, limit, sortBy, sortOrder, query)
    );
  }

  return { response, loading, error, execute };
}
