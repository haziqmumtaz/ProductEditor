import { reactive, toRefs } from "vue";
import { productsApi } from "./api";
import type { Product } from "../types";

export function usePatchProduct() {
  const state = reactive({
    response: {} as Product,
    loading: false,
    error: "",
  });

  async function execute(id: number, product: Product) {
    state.loading = true;
    state.error = "";
    try {
      const response = await productsApi.patch(id, product);
      state.response = response;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to patch product";
    } finally {
      state.loading = false;
    }
  }

  return { ...toRefs(state), execute };
}
