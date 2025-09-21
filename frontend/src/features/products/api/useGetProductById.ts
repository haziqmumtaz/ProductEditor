import { reactive, toRefs } from "vue";
import { productsApi } from "./api";
import type { Product } from "../types";

export function useGetProductById() {
  const state = reactive({
    response: {} as Product,
    loading: false,
    error: "",
  });

  async function execute(id: number) {
    state.loading = true;
    state.error = "";
    try {
      const response = await productsApi.get(id);
      state.response = response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        state.error = e.message;
      } else {
        state.error = "Failed to load product";
      }
    } finally {
      state.loading = false;
    }
  }

  return { ...toRefs(state), execute };
}
