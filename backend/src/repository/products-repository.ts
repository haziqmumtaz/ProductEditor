import { Product } from "../types/core";
import { PaginationParams } from "../types/http";
import { readDataFromFile, writeDataToFile } from "../utils/file-database";
import { generateId } from "../utils/generateId";

interface ProductRepositoryClass {
  getProductsCount(): number;
  getAll(): Product[];
  getAllPaginated(
    page: number,
    limit: number
  ): {
    products: Product[];
    total: number;
  };
  getById(id: number): Product | undefined;
  save(product: Product): Promise<Product>;
  update(id: number, product: Product): Promise<Product>;
  delete(id: number): Promise<number>;
}

export class ProductRepository implements ProductRepositoryClass {
  private products: Product[];

  constructor() {
    this.products = readDataFromFile("products.json");
    if (!this.products || !this.products.length) {
      this.products = [];
    }
  }

  getProductsCount(): number {
    return this.products.length;
  }

  getAll() {
    return this.products;
  }

  getAllPaginated(page, limit) {
    const offset = (page - 1) * limit;

    const products = this.products.slice(offset, offset + limit);
    const total = this.getProductsCount();

    return { products, total };
  }

  getById(id: number) {
    return this.products.find((p) => p.id == id);
  }

  async save(product) {
    product = { id: generateId(), ...product };
    this.products = [product, ...this.products];
    await writeDataToFile("products.json", this.products);
    return product;
  }

  async update(id: number, product) {
    const idx = this.products.findIndex((p) => p.id == id);
    this.products[idx] = { ...this.products[idx], ...product };
    await writeDataToFile("products.json", this.products);
    return this.products[idx];
  }

  async delete(id: number) {
    this.products = this.products.filter((p) => p.id != id);
    await writeDataToFile("products.json", this.products);
    return id;
  }
}
