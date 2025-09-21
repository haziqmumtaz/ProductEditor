import { useBaseApi, type ApiComposable } from "../../../lib/useBaseApi";
import { productsApi } from "./api";
import type { Product } from "../types";

export function usePatchProduct(): ApiComposable<Product> {
  const { response, loading, error, executeApiCall } = useBaseApi<Product>({
    defaultErrorMessage: "Failed to patch product",
  });

  async function execute(id: number, product: Product): Promise<Product> {
    return executeApiCall(() => productsApi.patch(id, product));
  }

  return { response, loading, error, execute };
}
