import { useBaseApi, type ApiComposable } from "../../../lib/useBaseApi";
import { productsApi } from "./api";
import type { Product } from "../types";

export function usePostProduct(): ApiComposable<Product> {
  const { response, loading, error, executeApiCall } = useBaseApi<Product>({
    defaultErrorMessage: "Failed to create product",
  });

  async function execute(product: Omit<Product, "id">): Promise<Product> {
    return executeApiCall(() => productsApi.create(product as Product));
  }

  return { response, loading, error, execute };
}
