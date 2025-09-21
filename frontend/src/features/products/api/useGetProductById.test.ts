import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSingleProduct } from "../testing/mock";
import { productsApi } from "./api";
import { useGetProductById } from "./useGetProductById";

vi.mock("./api", () => ({
  productsApi: {
    get: vi.fn(),
  },
}));

const mockProductsApi = vi.mocked(productsApi);

describe("useGetProductById (refactored)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API with correct product ID and return the API response", async () => {
    mockProductsApi.get.mockResolvedValueOnce(mockSingleProduct);

    const { execute } = useGetProductById();
    const result = await execute(123);

    expect(mockProductsApi.get).toHaveBeenCalledWith(123);
    expect(result).toEqual(mockSingleProduct);
  });

  it("should implement ApiComposable interface", () => {
    const composable = useGetProductById();

    expect(composable).toHaveProperty("response");
    expect(composable).toHaveProperty("loading");
    expect(composable).toHaveProperty("error");
    expect(composable).toHaveProperty("execute");
    expect(typeof composable.execute).toBe("function");
  });
});
