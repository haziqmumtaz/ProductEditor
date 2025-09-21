import { beforeEach, describe, expect, it, vi } from "vitest";
import { productsApi } from "./api";
import { useDeleteProduct } from "./useDeleteProduct";

vi.mock("./api", () => ({
  productsApi: {
    delete: vi.fn(),
  },
}));

const mockProductsApi = vi.mocked(productsApi);

describe("useDeleteProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API with correct product ID and return the API response", async () => {
    mockProductsApi.delete.mockResolvedValueOnce({ id: 1 });

    const { execute } = useDeleteProduct();
    const result = await execute(123);

    expect(mockProductsApi.delete).toHaveBeenCalledWith(123);
    expect(result).toEqual({ id: 1 });
  });

  it("should handle deletion of different product IDs", async () => {
    mockProductsApi.delete.mockResolvedValue({ id: 1 });

    const { execute } = useDeleteProduct();

    // Test with different product IDs from our mock data
    await execute(1); // Amazon Gift Card
    await execute(2); // Starbucks Gift Card
    await execute(8); // PlayStation Plus

    expect(mockProductsApi.delete).toHaveBeenCalledTimes(3);
    expect(mockProductsApi.delete).toHaveBeenNthCalledWith(1, 1);
    expect(mockProductsApi.delete).toHaveBeenNthCalledWith(2, 2);
    expect(mockProductsApi.delete).toHaveBeenNthCalledWith(3, 8);
  });

  it("should implement ApiComposable interface", () => {
    const composable = useDeleteProduct();

    expect(composable).toHaveProperty("response");
    expect(composable).toHaveProperty("loading");
    expect(composable).toHaveProperty("error");
    expect(composable).toHaveProperty("execute");
    expect(typeof composable.execute).toBe("function");
  });
});
