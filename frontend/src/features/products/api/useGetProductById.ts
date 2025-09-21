import { useBaseApi, type ApiComposable } from "../../../lib/useBaseApi";
import { productsApi } from "./api";
import type { Product } from "../types";

export function useGetProductById(): ApiComposable<Product> {
  const { response, loading, error, executeApiCall } = useBaseApi<Product>({
    defaultErrorMessage: "Failed to load product",
  });

  async function execute(id: number): Promise<Product> {
    return executeApiCall(() => productsApi.get(id));
  }

  return { response, loading, error, execute };
}
