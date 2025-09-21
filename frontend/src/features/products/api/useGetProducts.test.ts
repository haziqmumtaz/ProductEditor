import { describe, it, expect, vi, beforeEach } from "vitest";
import { useGetProducts } from "./useGetProducts";
import { productsApi } from "./api";
import type { Product } from "../types";
import {
  mockPaginatedResponse,
  mockPaginatedResponsePage2,
} from "../testing/mock";

vi.mock("./api", () => ({
  productsApi: {
    listWithOptions: vi.fn(),
  },
}));

const mockProductsApi = vi.mocked(productsApi);

describe("useGetProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API with default parameters", async () => {
    mockProductsApi.listWithOptions.mockResolvedValueOnce(
      mockPaginatedResponse
    );

    const { execute } = useGetProducts();
    await execute();

    expect(mockProductsApi.listWithOptions).toHaveBeenCalledWith(
      1, // page
      10, // limit
      "id", // sortBy
      "asc", // sortOrder
      "" // query
    );
  });

  it("should call API with custom parameters", async () => {
    mockProductsApi.listWithOptions.mockResolvedValueOnce(
      mockPaginatedResponsePage2
    );

    const { execute } = useGetProducts();
    await execute({
      query: "gift card",
      page: 2,
      limit: 5,
      sortBy: "name",
      sortOrder: "desc",
    });

    expect(mockProductsApi.listWithOptions).toHaveBeenCalledWith(
      2, // page
      5, // limit
      "name", // sortBy
      "desc", // sortOrder
      "gift card" // query
    );
  });

  it("should return paginated response with mock products", async () => {
    mockProductsApi.listWithOptions.mockResolvedValueOnce(
      mockPaginatedResponse
    );

    const { execute } = useGetProducts();
    const result = await execute();

    expect(result).toEqual(mockPaginatedResponse);
    expect(result.data).toHaveLength(5);
    expect(result.total).toBe(8);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
  });

  it("should handle pagination with different page sizes", async () => {
    mockProductsApi.listWithOptions.mockResolvedValueOnce(
      mockPaginatedResponsePage2
    );

    const { execute } = useGetProducts();
    const result = await execute({ page: 2, limit: 5 });

    expect(result.data).toHaveLength(3); // Remaining products on page 2
    expect(result.total).toBe(8);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(5);
    expect(result.hasPrev).toBe(true);
    expect(result.hasNext).toBe(false);
  });

  it("should implement ApiComposable interface", () => {
    const composable = useGetProducts();

    expect(composable).toHaveProperty("response");
    expect(composable).toHaveProperty("loading");
    expect(composable).toHaveProperty("error");
    expect(composable).toHaveProperty("execute");
    expect(typeof composable.execute).toBe("function");
  });
});
