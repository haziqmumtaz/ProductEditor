import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockSingleProduct, mockUpdatedProduct } from "../testing/mock";
import { productsApi } from "./api";
import { usePatchProduct } from "./usePatchProduct";

vi.mock("./api", () => ({
  productsApi: {
    patch: vi.fn(),
  },
}));

const mockProductsApi = vi.mocked(productsApi);

describe("usePatchProduct", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call API with correct parameters and return the API response", async () => {
    mockProductsApi.patch.mockResolvedValueOnce(mockUpdatedProduct);

    const { execute } = usePatchProduct();
    const result = await execute(1, mockUpdatedProduct);

    expect(mockProductsApi.patch).toHaveBeenCalledWith(1, mockUpdatedProduct);
    expect(result).toEqual(mockUpdatedProduct);
  });

  it("should handle partial updates with different product types and return the API response", async () => {
    // Test updating a gift card to a subscription
    const partialUpdate = {
      ...mockSingleProduct,
      name: "Amazon Prime Membership",
      voucherTypeName: "Subscription Service",
      shortDescription: "Annual Prime membership with free shipping",
    };

    mockProductsApi.patch.mockResolvedValueOnce(partialUpdate);

    const { execute } = usePatchProduct();
    const result = await execute(1, partialUpdate);

    expect(result).toEqual(partialUpdate);
  });

  it("should implement ApiComposable interface", () => {
    const composable = usePatchProduct();

    expect(composable).toHaveProperty("response");
    expect(composable).toHaveProperty("loading");
    expect(composable).toHaveProperty("error");
    expect(composable).toHaveProperty("execute");
    expect(typeof composable.execute).toBe("function");
  });
});
