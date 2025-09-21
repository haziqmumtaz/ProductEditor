import { reactive, ref, toRefs } from "vue";
import { productsApi } from "./api";
import type { Product } from "../types";

export function usePostProduct() {
  const state = reactive({
    response: {} as Product,
    loading: false,
    error: "",
  });

  async function execute(product: Omit<Product, "id">) {
    state.loading = true;
    state.error = "";
    state.response = {} as Product;

    try {
      const result = await productsApi.create(product as Product);
      state.response = result;
      return result;
    } catch (err: any) {
      state.error = err.message || "Failed to create product";
      throw err;
    } finally {
      state.loading = false;
    }
  }

  return {
    ...toRefs(state),
    execute,
  };
}
