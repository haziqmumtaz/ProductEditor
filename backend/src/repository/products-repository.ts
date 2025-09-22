import { Product } from "../types/core";
import { readDataFromFile, writeDataToFile } from "../utils/file-database";
import { generateId } from "../utils/generateId";

export interface IProductRepository {
  getProductsCount(): number;
  getAll(): Product[];
  getProducts(
    sortBy: string,
    sortOrder: string,
    search: string,
    page: number,
    limit: number
  ): {
    products: Product[];
    total: number;
  };
  getById(id: number): Product | undefined;
  save(product: Product): Promise<Product>;
  update(id: number, product: Product): Promise<Product>;
  delete(id: number): Promise<Pick<Product, "id">>;
}

export class ProductRepository implements IProductRepository {
  private products: Product[];

  constructor() {
    this.products = readDataFromFile("products.json") ?? [];
  }

  getProductsCount() {
    return this.products.length;
  }

  getAll() {
    return this.products;
  }

  getProducts(sortBy, sortOrder, search, page, limit) {
    const offset = (page - 1) * limit;
    let products = this.products;
    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    products = products.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Handle string fields (name, productTitle)
      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue
          .toLowerCase()
          .localeCompare(bValue.toLowerCase());
        return sortOrder === "asc" ? comparison : -comparison;
      }
    });

    products = products.slice(offset, offset + limit);

    const total = this.getProductsCount();

    return { products, total };
  }

  getById(id) {
    return this.products.find((p) => p.id == id);
  }

  async save(product) {
    product = { id: generateId(), ...product } as Product;
    this.products = [product, ...this.products];
    await writeDataToFile("products.json", this.products);
    return product;
  }

  async update(id, product) {
    const idx = this.products.findIndex((p) => p.id == id);
    this.products[idx] = { ...this.products[idx], ...product };
    await writeDataToFile("products.json", this.products);
    return this.products[idx];
  }

  async delete(id) {
    this.products = this.products.filter((p) => p.id != id);
    await writeDataToFile("products.json", this.products);
    return { id };
  }
}
