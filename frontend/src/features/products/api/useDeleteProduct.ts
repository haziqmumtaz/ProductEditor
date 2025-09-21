import { useBaseApi, type ApiComposable } from "../../../lib/useBaseApi";
import { productsApi } from "./api";
import type { Product } from "../types";

export function useDeleteProduct(): ApiComposable<Pick<Product, "id">> {
  const { response, loading, error, executeApiCall } = useBaseApi<
    Pick<Product, "id">
  >({
    defaultErrorMessage: "Failed to delete product",
  });

  async function execute(id: number): Promise<Pick<Product, "id">> {
    return executeApiCall(() => productsApi.delete(id));
  }

  return { response, loading, error, execute };
}
