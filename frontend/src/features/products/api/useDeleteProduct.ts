import { reactive, toRefs } from "vue";
import { productsApi } from "./api";

export function useDeleteProduct() {
  const state = reactive({
    response: null,
    loading: false,
    error: "",
  });

  async function execute(id: number) {
    state.loading = true;
    state.error = "";
    try {
      const response = await productsApi.delete(id);
      state.response = response as unknown as null;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "Failed to delete product";
    } finally {
      state.loading = false;
    }
  }

  return { ...toRefs(state), execute };
}
