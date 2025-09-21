import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import request from "supertest";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import productsRouter from "./products";
import { ProductService } from "../service/products-service";
import { createTestProductRepository } from "../testing/repositories/products-repository";
import { errorHandler } from "../middlewares/errorHandler";

// Mock the ProductService
vi.mock("../service/products-service");

describe("Products API", () => {
  let app: Koa;
  let mockService: any;
  let testRepo: any;

  beforeEach(() => {
    // Create test data
    testRepo = createTestProductRepository();

    // Mock service methods
    mockService = {
      getProductsWithOptions: vi.fn(),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
    };

    // Mock the ProductService constructor
    vi.mocked(ProductService).mockImplementation(() => mockService);

    // Setup Koa app
    app = new Koa();
    app.use(errorHandler());
    app.use(bodyParser());
    app.use(productsRouter.routes());
    app.use(productsRouter.allowedMethods());
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should return paginated products with default parameters", async () => {
      const mockResponse = {
        data: testRepo.getAll(),
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      mockService.getProductsWithOptions.mockReturnValue(mockResponse);

      const response = await request(app.callback())
        .get("/api/products")
        .expect(200);

      expect(mockService.getProductsWithOptions).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: "",
        sortBy: "id",
        sortOrder: "asc",
      });

      expect(response.body).toMatchObject({
        data: expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            name: "Test Game 1",
          }),
        ]),
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it("should return paginated products with custom parameters", async () => {
      const mockResponse = {
        data: testRepo.getAll().slice(0, 2),
        page: 1,
        limit: 2,
        total: 3,
        totalPages: 2,
        hasNext: true,
        hasPrev: false,
      };

      mockService.getProductsWithOptions.mockReturnValue(mockResponse);

      const response = await request(app.callback())
        .get("/api/products?page=1&limit=2")
        .expect(200);

      expect(mockService.getProductsWithOptions).toHaveBeenCalledWith({
        page: 1,
        limit: 2,
        search: "",
        sortBy: "id",
        sortOrder: "asc",
      });

      expect(response.body).toMatchObject({
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

    it("should return 400 for invalid pagination parameters", async () => {
      await request(app.callback())
        .get("/api/products?page=0&limit=101")
        .expect(400);
    });

    it("should return 400 for non-numeric pagination parameters", async () => {
      await request(app.callback())
        .get("/api/products?page=abc&limit=xyz")
        .expect(400);
    });

    it("should sort products by name in ascending order", async () => {
      const mockResponse = {
        data: [
          { id: 1, name: "Apple Game" },
          { id: 2, name: "Banana Game" },
          { id: 3, name: "Cherry Game" },
        ],
        page: 1,
        limit: 10,
        total: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      mockService.getProductsWithOptions.mockReturnValue(mockResponse);

      await request(app.callback())
        .get("/api/products?sortBy=name&sortOrder=asc")
        .expect(200);

      expect(mockService.getProductsWithOptions).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: "",
        sortBy: "name",
        sortOrder: "asc",
      });
    });

    it("should sort products by productTitle in descending order", async () => {
      const mockResponse = {
        data: [
          { id: 1, productTitle: "Zebra Game Title" },
          { id: 2, productTitle: "Alpha Game Title" },
        ],
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      };

      mockService.getProductsWithOptions.mockReturnValue(mockResponse);

      await request(app.callback())
        .get("/api/products?sortBy=productTitle&sortOrder=desc")
        .expect(200);

      expect(mockService.getProductsWithOptions).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        search: "",
        sortBy: "productTitle",
        sortOrder: "desc",
      });
    });

    it("should return 400 for invalid sortBy parameter", async () => {
      await request(app.callback())
        .get("/api/products?sortBy=invalidField")
        .expect(400);
    });
  });

  describe("GET /api/products/:id", () => {
    it("should return a specific product when found", async () => {
      const mockProduct = testRepo.getAll()[0];
      mockService.getProductById.mockReturnValue(mockProduct);

      const response = await request(app.callback())
        .get("/api/products/1")
        .expect(200);

      expect(mockService.getProductById).toHaveBeenCalledWith(1);
      expect(response.body).toMatchObject({
        id: 1,
        name: "Test Game 1",
        gvtId: 101,
      });
    });

    it("should return 404 when product not found", async () => {
      mockService.getProductById.mockReturnValue({
        error: "Product not found",
        status: 404,
      });

      const response = await request(app.callback())
        .get("/api/products/999")
        .expect(404);

      expect(response.body).toEqual({
        error: "Product not found",
      });
    });

    it("should handle non-numeric product ID", async () => {
      await request(app.callback()).get("/api/products/abc").expect(400);
    });
  });

  describe("POST /api/products", () => {
    const validProductData = {
      name: "New Test Game",
      gvtId: 301,
      productTagline: "Amazing new game",
      shortDescription: "Short description",
      longDescription: "Long description",
      logoLocation: "https://example.com/logo.jpg",
      productUrl: "/new-game",
      voucherTypeName: "NEW_VOUCHER",
      orderUrl: "https://example.com/order",
      productTitle: "New Game Title",
      variableDenomPriceMinAmount: "1.0",
      variableDenomPriceMaxAmount: "100.0",
      __typename: "ProductInfo",
    };

    it("should create a new product with valid data", async () => {
      const createdProduct = { id: 4, ...validProductData };
      mockService.createProduct.mockResolvedValue(createdProduct);

      const response = await request(app.callback())
        .post("/api/products")
        .send(validProductData)
        .expect(200);

      expect(mockService.createProduct).toHaveBeenCalledWith(validProductData);
      expect(response.body).toMatchObject({
        id: 4,
        name: "New Test Game",
      });
    });

    it("should return 400 for invalid product data", async () => {
      const invalidData = { name: "" };

      await request(app.callback())
        .post("/api/products")
        .send(invalidData)
        .expect(400);
    });
  });

  describe("PATCH /api/products/:id", () => {
    const updateData = {
      id: 1,
      name: "Updated Game Name",
      gvtId: 301,
      productTagline: "Updated tagline",
      shortDescription: "Updated description",
      longDescription: "Updated long description",
      logoLocation: "https://example.com/updated-logo.jpg",
      productUrl: "/updated-game",
      voucherTypeName: "UPDATED_VOUCHER",
      orderUrl: "https://example.com/updated-order",
      productTitle: "Updated Game Title",
      variableDenomPriceMinAmount: "1.0",
      variableDenomPriceMaxAmount: "100.0",
      __typename: "ProductInfo",
    };

    it("should update an existing product", async () => {
      mockService.updateProduct.mockResolvedValue(updateData);

      const response = await request(app.callback())
        .patch("/api/products/1")
        .send(updateData)
        .expect(200);

      expect(mockService.updateProduct).toHaveBeenCalledWith(1, updateData);
      expect(response.body).toMatchObject({
        id: 1,
        name: "Updated Game Name",
      });
    });

    it("should return 404 when trying to update non-existent product", async () => {
      mockService.updateProduct.mockResolvedValue({
        error: "Product not found",
        status: 404,
      });

      const response = await request(app.callback())
        .patch("/api/products/999")
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        error: "Product not found",
      });
    });

    it("should return 400 for invalid update data", async () => {
      const invalidUpdateData = { gvtId: "invalid" };

      await request(app.callback())
        .patch("/api/products/1")
        .send(invalidUpdateData)
        .expect(400);
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete an existing product", async () => {
      mockService.deleteProduct.mockResolvedValue({ id: 1 });

      const response = await request(app.callback())
        .delete("/api/products/1")
        .expect(200);

      expect(mockService.deleteProduct).toHaveBeenCalledWith(1);
      expect(response.body).toEqual({ id: 1 });
    });

    it("should return 404 when trying to delete non-existent product", async () => {
      mockService.deleteProduct.mockResolvedValue({
        error: "Product not found",
        status: 404,
      });

      const response = await request(app.callback())
        .delete("/api/products/999")
        .expect(404);

      expect(response.body).toEqual({
        error: "Product not found",
      });
    });

    it("should return 400 for non-numeric product ID", async () => {
      await request(app.callback()).delete("/api/products/abc").expect(400);
    });
  });

  describe("Error Handling", () => {
    it("should handle service errors gracefully and return 500", async () => {
      // Mock the service to throw an error
      mockService.getProductsWithOptions.mockImplementation(() => {
        throw new Error("Database connection failed");
      });

      const response = await request(app.callback())
        .get("/api/products")
        .expect(500);

      expect(response.body).toEqual({
        error: "Internal server error",
      });
    });

    it("should handle async service errors gracefully and return 500", async () => {
      // Mock the service to reject with an error
      mockService.createProduct.mockRejectedValue(
        new Error("Save operation failed")
      );

      const validProductData = {
        name: "Test Game",
        gvtId: 123,
        productTagline: "Test",
        shortDescription: "Test",
        longDescription: "Test",
        logoLocation: "https://example.com/logo.jpg",
        productUrl: "/test",
        voucherTypeName: "TEST",
        orderUrl: "https://example.com/order",
        productTitle: "Test Title",
        variableDenomPriceMinAmount: "1.0",
        variableDenomPriceMaxAmount: "100.0",
        __typename: "ProductInfo",
      };

      const response = await request(app.callback())
        .post("/api/products")
        .send(validProductData)
        .expect(500);

      expect(response.body).toEqual({
        error: "Internal server error",
      });
    });
  });
});
