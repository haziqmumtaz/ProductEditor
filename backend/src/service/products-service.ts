import { Product } from "../types/core";
import { ProductRepository } from "../repository/products-repository";
import { Failure, HttpResult, Success } from "../types/http";
import { PaginationParams, PaginatedResponse } from "../types/http";

interface IProductService {
  getAllProducts(): Product[];
  getProductsWithOptions(
    params: PaginationParams
  ): HttpResult<PaginatedResponse<Product>>;
  getProductById(id: number): HttpResult<Product>;
  createProduct(data: Product): Promise<HttpResult<Product>>;
  updateProduct(
    id: number,
    data: Product
  ): Promise<HttpResult<Pick<Product, "id">>>;
}

export class ProductService implements IProductService {
  private productRepository: ProductRepository;

  constructor(productRepository?: ProductRepository) {
    this.productRepository = productRepository ?? new ProductRepository();
  }

  getAllProducts(): Product[] {
    return Success(this.productRepository.getAll());
  }

  getProductsWithOptions(params) {
    const { sortBy, sortOrder, search, page, limit } = params;
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

    const { products, total } = this.productRepository.getProducts(
      sortBy,
      sortOrder,
      search,
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
