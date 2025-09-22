import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockProductForCreation, mockSingleProduct } from "../testing/mock";
import { productsApi } from "./api";
import { usePostProduct } from "./usePostProduct";

vi.mock("./api", () => ({
  productsApi: {
    create: vi.fn(),
  },
}));

const mockProductsApi = vi.mocked(productsApi);

describe("usePostProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API with correct product data and return the API response", async () => {
    mockProductsApi.create.mockResolvedValueOnce(mockSingleProduct);

    const { execute } = usePostProduct();
    const result = await execute(mockProductForCreation);

    expect(mockProductsApi.create).toHaveBeenCalledWith(mockProductForCreation);
    expect(result).toEqual(mockSingleProduct);
  });

  it("should return the created product", async () => {
    mockProductsApi.create.mockResolvedValueOnce(mockSingleProduct);

    const { execute } = usePostProduct();
    const result = await execute(mockProductForCreation);

    expect(result).toEqual(mockSingleProduct);
  });

  it("should implement ApiComposable interface", () => {
    const composable = usePostProduct();

    expect(composable).toHaveProperty("response");
    expect(composable).toHaveProperty("loading");
    expect(composable).toHaveProperty("error");
    expect(composable).toHaveProperty("execute");
    expect(typeof composable.execute).toBe("function");
  });
});
