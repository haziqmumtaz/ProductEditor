import { ProductRepositoryClass } from "../../repository/products-repository";
import { Product } from "../../types/core";

export const createTestProductRepository = (): ProductRepositoryClass => {
  const products: Product[] = [
    {
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
    },
    {
      id: 2,
      name: "Test Game 2",
      gvtId: 102,
      productTagline: "Another test gaming experience",
      shortDescription: "A short test description for game 2",
      longDescription:
        "A longer test description with more details about game 2",
      logoLocation: "https://example.com/logo2.jpg",
      productUrl: "/test/game-2",
      voucherTypeName: "TEST_VOUCHER_2",
      orderUrl: "https://example.com/order/2",
      productTitle: "Test Game 2 - Test Platform",
      variableDenomPriceMinAmount: "10.0",
      variableDenomPriceMaxAmount: "200.0",
      __typename: "ProductInfo",
    },
    {
      id: 3,
      name: "Test Game 3",
      gvtId: 103,
      productTagline: "Premium test gaming experience",
      shortDescription: "A short test description for game 3",
      longDescription:
        "A longer test description with more details about game 3",
      logoLocation: "https://example.com/logo3.jpg",
      productUrl: "/test/game-3",
      voucherTypeName: "TEST_VOUCHER_3",
      orderUrl: "https://example.com/order/3",
      productTitle: "Test Game 3 - Test Platform",
      variableDenomPriceMinAmount: "1.0",
      variableDenomPriceMaxAmount: "50.0",
      __typename: "ProductInfo",
    },
  ];

  return {
    getProductsCount: () => {
      return products.length;
    },

    getAll: () => {
      return products;
    },

    getProducts: (sortBy, sortOrder, search, page, limit) => {
      let filteredProducts = products;

      if (search) {
        filteredProducts = filteredProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.productTitle.toLowerCase().includes(search.toLowerCase())
        );
      }

      filteredProducts = filteredProducts.sort((a, b) => {
        return sortOrder === "asc"
          ? a[sortBy] - b[sortBy]
          : b[sortBy] - a[sortBy];
      });

      const offset = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);
      return {
        products: paginatedProducts,
        total: filteredProducts.length,
      };
    },

    getById: (id) => {
      return products.find((p) => p.id === id);
    },

    save: async (product) => {
      const newProduct = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...product,
      };
      products.push(newProduct);
      return newProduct;
    },

    update: async (id, productData) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return undefined;

      products[index] = { ...products[index], ...productData };
      return products[index];
    },

    delete: async (id) => {
      const index = products.findIndex((p) => p.id === id);
      if (index === -1) return undefined;

      products.splice(index, 1);
      return { id };
    },
  };
};
