import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  ProductRepository,
  IProductRepository,
} from "../repository/products-repository";
import { createTestProductRepository } from "../testing/repositories/products-repository";
import { Product } from "../types/core";
import { ProductService } from "./products-service";

describe("ProductService", () => {
  let service: ProductService;
  let mockRepo: IProductRepository;

  beforeEach(() => {
    mockRepo = createTestProductRepository();
    service = new ProductService(mockRepo as ProductRepository);
  });

  describe("getProducts", () => {
    it("should return all products", () => {
      const products = service.getAllProducts();

      expect(products).toHaveLength(3);
      expect(products[0]).toMatchObject({
        id: 1,
        name: "Test Game 1",
        gvtId: 101,
        productTagline: "Test gaming experience",
        shortDescription: "A short test description for game 1",
        longDescription:
          "A longer test description with more details about game 1",
        logoLocation: "https://example.com/logo1.jpg",
        productUrl: "/test/game-1",
        voucherTypeName: "TEST_VOUCHER",
        orderUrl: "https://example.com/order/1",
        productTitle: "Test Game 1 - Test Platform",
        variableDenomPriceMinAmount: "5.0",
        variableDenomPriceMaxAmount: "100.0",
        __typename: "ProductInfo",
      });
    });
  });

  describe("getProductsWithOptions", () => {
    it("should return paginated products with default params from Zod validation", async () => {
      const result = service.getProductsWithOptions({
        page: 1,
        limit: 10,
        sortBy: "id",
        sortOrder: "asc",
        search: "",
      });

      expect(result).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
          expect.objectContaining({ id: 3 }),
        ]),
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it("should return paginated products with explicit params from function parameters", async () => {
      const result = service.getProductsWithOptions({
        page: 1,
        limit: 2,
        sortBy: "name",
        sortOrder: "asc",
        search: "",
      });

      expect(result).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 1 }),
          expect.objectContaining({ id: 2 }),
        ]),
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      });
    });

    it("should return empty data when offset exceeds product count", () => {
      const result = service.getProductsWithOptions({
        page: 5,
        limit: 10,
        sortBy: "id",
        sortOrder: "asc",
        search: "",
      });

      expect(result).toEqual({
        data: expect.arrayContaining([]),
        page: 5,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      });
    });

    it("should handle page 2 with correct pagination flags", async () => {
      const result = service.getProductsWithOptions({ page: 2, limit: 1 });

      expect(result).toMatchObject({
        data: expect.arrayContaining([expect.objectContaining({ id: 2 })]),
        page: 2,
        limit: 1,
        total: 3,
        totalPages: 3,
        hasNext: true,
        hasPrev: true,
      });
    });

    it("should filter products by name search", () => {
      const result = service.getProductsWithOptions({
        page: 1,
        limit: 10,
        sortBy: "id",
        sortOrder: "asc",
        search: "Game 1",
      });

      expect(result).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({ id: 1, name: "Test Game 1" }),
        ]),
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });
  });

  describe("getProductById", () => {
    it("should return product when found", async () => {
      const result = service.getProductById(1);

      expect(result).toMatchObject({
        id: 1,
        name: "Test Game 1",
        gvtId: 101,
        productTagline: "Test gaming experience",
        shortDescription: "A short test description for game 1",
        longDescription:
          "A longer test description with more details about game 1",
        logoLocation: "https://example.com/logo1.jpg",
        productUrl: "/test/game-1",
        voucherTypeName: "TEST_VOUCHER",
        orderUrl: "https://example.com/order/1",
        productTitle: "Test Game 1 - Test Platform",
        variableDenomPriceMinAmount: "5.0",
        variableDenomPriceMaxAmount: "100.0",
        __typename: "ProductInfo",
      });
    });

    it("should return 404 when product not found", () => {
      const result = service.getProductById(999);

      expect(result).toEqual({
        error: "Product not found",
        status: 404,
      });
    });
  });

  describe("createProduct", () => {
    it("should create and return new product", async () => {
      const newProductData: Omit<Product, "id"> = {
        name: "New Game",
        gvtId: 201,
        productTagline: "New gaming experience",
        shortDescription: "New description",
        longDescription: "New long description",
        logoLocation: "https://example.com/new-logo.jpg",
        productUrl: "/new-game",
        voucherTypeName: "NEW_VOUCHER",
        orderUrl: "https://example.com/order/new",
        productTitle: "New Game - Platform",
        variableDenomPriceMinAmount: "1.0",
        variableDenomPriceMaxAmount: "50.0",
        __typename: "ProductInfo",
      };

      const result = await service.createProduct(newProductData as Product);

      expect(result).toMatchObject({
        id: 4,
        name: "New Game",
      });
    });
  });

  describe("updateProduct", () => {
    it("should update and return product when found", async () => {
      const updateData: Partial<Product> = { name: "Updated Game Name" };
      const result = await service.updateProduct(1, updateData as Product);

      expect(result).toMatchObject({
        id: 1,
        name: "Updated Game Name",
      });
    });

    it("should return 404 when product not found", async () => {
      const result = await service.updateProduct(999, {} as Product);

      expect(result).toEqual({
        error: "Product not found",
        status: 404,
      });
    });
  });

  describe("deleteProduct", () => {
    it("should delete and return product id when found", async () => {
      const result = await service.deleteProduct(1);

      expect(result).toMatchObject({
        id: 1,
      });
    });

    it("should return failure when product not found", async () => {
      const result = await service.deleteProduct(999);

      expect(result).toEqual({
        error: "Product not found",
        status: 404,
      });
    });
  });
});
