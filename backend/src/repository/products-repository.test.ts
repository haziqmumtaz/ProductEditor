import { beforeEach, describe, expect, it, vi } from "vitest";
import { Product } from "../types/core";
import { ProductRepository } from "./products-repository";

// Mock the file-database utility
vi.mock("../utils/file-database", () => ({
  readDataFromFile: vi.fn(),
  writeDataToFile: vi.fn(),
}));

// Mock the generateId utility
vi.mock("../utils/generateId", () => ({
  generateId: vi.fn(() => 12345),
}));

import { readDataFromFile, writeDataToFile } from "../utils/file-database";
import { generateId } from "../utils/generateId";

const mockReadDataFromFile = vi.mocked(readDataFromFile);
const mockWriteDataToFile = vi.mocked(writeDataToFile);
const mockGenerateId = vi.mocked(generateId);

// Mock product data
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Amazon Gift Card",
    gvtId: 1001,
    productTagline: "Shop millions of items on Amazon",
    shortDescription: "Redeemable on Amazon.com for millions of items",
    longDescription:
      "Amazon Gift Cards are redeemable on Amazon.com for millions of items including electronics, books, clothing, home and garden, toys, and more.",
    logoLocation: "https://example.com/logos/amazon.png",
    productUrl: "https://amazon.com",
    voucherTypeName: "Digital Gift Card",
    orderUrl: "https://example.com/order/amazon",
    productTitle: "Amazon Gift Card - Digital",
    variableDenomPriceMinAmount: "25.00",
    variableDenomPriceMaxAmount: "2000.00",
    __typename: "ProductInfo",
  },
  {
    id: 2,
    name: "Starbucks Gift Card",
    gvtId: 1002,
    productTagline: "Enjoy premium coffee and beverages",
    shortDescription:
      "Redeem at any Starbucks location for coffee, food, and merchandise.",
    longDescription:
      "Starbucks Gift Cards can be used at any Starbucks location worldwide for coffee, tea, food, and merchandise.",
    logoLocation: "https://example.com/logos/starbucks.png",
    productUrl: "https://starbucks.com",
    voucherTypeName: "Gift Card",
    orderUrl: "https://example.com/order/starbucks",
    productTitle: "Starbucks Gift Card",
    variableDenomPriceMinAmount: "10.00",
    variableDenomPriceMaxAmount: "500.00",
    __typename: "ProductInfo",
  },
  {
    id: 3,
    name: "Netflix Subscription",
    gvtId: 1003,
    productTagline: "Stream unlimited movies and TV shows",
    shortDescription:
      "1-month Netflix Premium subscription with unlimited streaming.",
    longDescription:
      "Enjoy unlimited streaming of movies and TV shows on Netflix with this 1-month Premium subscription.",
    logoLocation: "https://example.com/logos/netflix.png",
    productUrl: "https://netflix.com",
    voucherTypeName: "Digital Subscription",
    orderUrl: "https://example.com/order/netflix",
    productTitle: "Netflix Premium - 1 Month",
    __typename: "ProductInfo",
  },
];

describe("ProductRepository", () => {
  let repository: ProductRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    mockReadDataFromFile.mockReturnValue(mockProducts);
    mockWriteDataToFile.mockResolvedValue(undefined);
    mockGenerateId.mockReturnValue(12345);
    repository = new ProductRepository();
  });

  describe("constructor", () => {
    it("should initialize with products from file", () => {
      expect(mockReadDataFromFile).toHaveBeenCalledWith("products.json");
      expect(repository.getProductsCount()).toBe(3);
    });
  });

  describe("getProductsCount", () => {
    it("should return correct count of products", () => {
      expect(repository.getProductsCount()).toBe(3);
    });
  });

  describe("getProducts", () => {
    it("should sort products by id ascending", () => {
      const result = repository.getProducts("id", "asc", "", 1, 10);
      expect(result.products[0].id).toBe(1);
      expect(result.products[1].id).toBe(2);
      expect(result.products[2].id).toBe(3);
    });

    it("should sort products by id descending", () => {
      const result = repository.getProducts("id", "desc", "", 1, 10);
      expect(result.products[0].id).toBe(3);
      expect(result.products[1].id).toBe(2);
      expect(result.products[2].id).toBe(1);
    });

    it("should sort products by name ascending", () => {
      const result = repository.getProducts("name", "asc", "", 1, 10);
      expect(result.products[0].name).toBe("Amazon Gift Card");
      expect(result.products[1].name).toBe("Netflix Subscription");
      expect(result.products[2].name).toBe("Starbucks Gift Card");
    });

    it("should sort products by name descending", () => {
      const result = repository.getProducts("name", "desc", "", 1, 10);
      expect(result.products[0].name).toBe("Starbucks Gift Card");
      expect(result.products[1].name).toBe("Netflix Subscription");
      expect(result.products[2].name).toBe("Amazon Gift Card");
    });

    it("should sort products by gvtId ascending", () => {
      const result = repository.getProducts("gvtId", "asc", "", 1, 10);
      expect(result.products[0].gvtId).toBe(1001);
      expect(result.products[1].gvtId).toBe(1002);
      expect(result.products[2].gvtId).toBe(1003);
    });

    it("should sort products by gvtId descending", () => {
      const result = repository.getProducts("gvtId", "desc", "", 1, 10);
      expect(result.products[0].gvtId).toBe(1003);
      expect(result.products[1].gvtId).toBe(1002);
      expect(result.products[2].gvtId).toBe(1001);
    });

    it("should filter products by name search", () => {
      const result = repository.getProducts("id", "asc", "Amazon", 1, 10);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Amazon Gift Card");
    });

    it("should filter products by productTitle search", () => {
      const result = repository.getProducts("id", "asc", "Starbucks", 1, 10);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].name).toBe("Starbucks Gift Card");
    });

    it("should handle pagination with page 2", () => {
      const result = repository.getProducts("id", "asc", "", 2, 2);
      expect(result.products).toHaveLength(1);
      expect(result.products[0].id).toBe(3);
    });
  });

  describe("getById", () => {
    it("should return product by id", () => {
      const product = repository.getById(1);
      expect(product).toEqual(mockProducts[0]);
    });

    it("should return undefined for non-existent id", () => {
      const product = repository.getById(999);
      expect(product).toBeUndefined();
    });
  });

  describe("save", () => {
    it("should save new product with generated id", async () => {
      const newProduct = {
        name: "Test Product",
        gvtId: 1004,
        productTagline: "Test tagline",
        shortDescription: "Test short description",
        longDescription: "Test long description",
        logoLocation: "https://example.com/test-logo.png",
        productUrl: "https://example.com/test-product",
        voucherTypeName: "Test Voucher",
        orderUrl: "https://example.com/order/test",
        productTitle: "Test Product Title",
        __typename: "ProductInfo" as const,
      };

      const savedProduct = await repository.save(newProduct);

      expect(mockGenerateId).toHaveBeenCalled();
      expect(savedProduct.id).toBe(12345);
      expect(savedProduct.name).toBe("Test Product");
      expect(mockWriteDataToFile).toHaveBeenCalledWith(
        "products.json",
        expect.any(Array)
      );
      expect(repository.getProductsCount()).toBe(4);
    });

    it("should add product to beginning of array", async () => {
      const newProduct = {
        name: "Test Product",
        gvtId: 1004,
        productTagline: "Test tagline",
        shortDescription: "Test short description",
        longDescription: "Test long description",
        logoLocation: "https://example.com/test-logo.png",
        productUrl: "https://example.com/test-product",
        voucherTypeName: "Test Voucher",
        orderUrl: "https://example.com/order/test",
        productTitle: "Test Product Title",
        __typename: "ProductInfo" as const,
      };

      await repository.save(newProduct);
      const allProducts = repository.getAll();
      expect(allProducts[0].id).toBe(12345);
      expect(allProducts[0].name).toBe("Test Product");
    });
  });

  describe("update", () => {
    it("should update existing product", async () => {
      const updateData = {
        name: "Updated Amazon Gift Card",
        productTagline: "Updated tagline",
      };

      const updatedProduct = await repository.update(1, updateData);

      expect(updatedProduct.id).toBe(1);
      expect(updatedProduct.name).toBe("Updated Amazon Gift Card");
      expect(updatedProduct.productTagline).toBe("Updated tagline");
      expect(updatedProduct.gvtId).toBe(1001); // Should preserve other fields
      expect(mockWriteDataToFile).toHaveBeenCalledWith(
        "products.json",
        expect.any(Array)
      );
    });

    it("should handle non-existent product gracefully", async () => {
      const updateData = { name: "Updated Name" };
      const result = await repository.update(999, updateData);
      expect(result).toEqual(updateData);
    });
  });

  describe("delete", () => {
    it("should delete existing product", async () => {
      const result = await repository.delete(1);
      expect(result).toEqual({ id: 1 });
      expect(repository.getProductsCount()).toBe(2);
      expect(repository.getById(1)).toBeUndefined();
      expect(mockWriteDataToFile).toHaveBeenCalledWith(
        "products.json",
        expect.any(Array)
      );
    });

    it("should not throw error for non-existent product", async () => {
      const result = await repository.delete(999);
      expect(result).toEqual({ id: 999 });
      expect(repository.getProductsCount()).toBe(3); // Should remain unchanged
    });
  });
});
