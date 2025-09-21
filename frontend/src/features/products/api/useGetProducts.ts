import { reactive, toRefs } from "vue";
import { productsApi, type PaginatedResponse } from "./api";
import type { Product } from "../types";

export interface ProductsQueryParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

export function useGetProducts() {
  const state = reactive({
    response: {} as PaginatedResponse<Product>,
    loading: false,
    error: "",
  });

  async function execute(params: ProductsQueryParams = {}) {
    const {
      query = "",
      page = 1,
      limit = 10,
      sortBy = "id",
      sortOrder = "asc",
    } = params;

    state.loading = true;
    state.error = "";
    try {
      // Add a delay to simulate slower API response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const response = await productsApi.listWithOptions(
        page,
        limit,
        sortBy,
        sortOrder,
        query
      );
      state.response = response;
    } catch (e: unknown) {
      if (e instanceof Error) {
        state.error = e.message;
      } else {
        state.error = "Failed to load products";
      }
    } finally {
      state.loading = false;
    }
  }

  return { ...toRefs(state), execute };
}
