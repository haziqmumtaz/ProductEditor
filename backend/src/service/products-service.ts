import { Product } from "../types/core";
import { ProductRepository } from "../repository/products-repository";
import { Failure, HttpResult, Success } from "../types/http";
import { PaginationParams, PaginatedResponse } from "../types/http";

interface ProductServiceClass {
  getProducts(): Product[];
  getPaginatedProducts(
    params: PaginationParams
  ): HttpResult<PaginatedResponse<Product>>;
  getProductById(id: number): HttpResult<Product>;
  createProduct(data: Product): Promise<HttpResult<Product>>;
  updateProduct(
    id: number,
    data: Product
  ): Promise<HttpResult<Pick<Product, "id">>>;
}

export class ProductService implements ProductServiceClass {
  productRepository = new ProductRepository();

  getProducts(): Product[] {
    return this.productRepository.getAll();
  }

  getPaginatedProducts(params) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;

    if (offset >= this.productRepository.getProductsCount()) {
      return {
        data: [],
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      };
    }

    const { products, total } = this.productRepository.getAllPaginated(
      page,
      limit
    );
    const totalPages = Math.ceil(total / limit);

    return Success({
      data: products,
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    });
  }

  getProductById(id) {
    const p = this.productRepository.getById(id);
    if (!p) return Failure("Product not found", 404);
    return Success(p);
  }

  async createProduct(data) {
    const newProduct = await this.productRepository.save(data);
    return Success(newProduct);
  }

  async updateProduct(id, data) {
    const p = this.productRepository.getById(id);
    if (!p) return Failure("Product not found", 404);
    const result = await this.productRepository.update(id, data);
    return Success(result);
  }

  async deleteProduct(id) {
    const p = this.productRepository.getById(id);
    if (!p) return Failure("Product not found", 404);
    const result = await this.productRepository.delete(id);
    return Success(result);
  }
}
