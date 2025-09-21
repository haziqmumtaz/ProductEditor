import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../components/layout/NotFound.vue";
import CreateProduct from "../features/products/pages/CreateProduct.vue";
import ProductDetails from "../features/products/pages/ProductDetails.vue";
import ProductsList from "../features/products/pages/ProductsList.vue";

vi.mock("../features/products/pages/ProductsList.vue", () => ({
  default: {
    name: "ProductsList",
    template: "<div>Products List</div>",
  },
}));

vi.mock("../features/products/pages/ProductDetails.vue", () => ({
  default: {
    name: "ProductDetails",
    template: "<div>Product Details</div>",
  },
}));

vi.mock("../features/products/pages/CreateProduct.vue", () => ({
  default: {
    name: "CreateProduct",
    template: "<div>Create Product</div>",
  },
}));

vi.mock("../components/layout/NotFound.vue", () => ({
  default: {
    name: "NotFound",
    template: "<div>Not Found</div>",
  },
}));

describe("Router Configuration", () => {
  let testRouter: ReturnType<typeof createRouter>;

  beforeEach(() => {
    testRouter = createRouter({
      history: createWebHistory(),
      routes: [
        {
          path: "/",
          name: "Home",
          component: ProductsList,
        },
        {
          path: "/products",
          name: "ProductsList",
          component: ProductsList,
        },
        {
          path: "/products/:id",
          name: "ProductDetails",
          component: ProductDetails,
          meta: {
            title: "Product Details",
          },
        },
        {
          path: "/products/:id/edit",
          name: "EditProduct",
          component: ProductDetails,
          meta: {
            title: "Edit Product",
          },
        },
        {
          path: "/products/create",
          name: "CreateProduct",
          component: CreateProduct,
          meta: {
            title: "Create Product",
          },
        },
        {
          path: "/:pathMatch(.*)*",
          name: "NotFound",
          component: NotFound,
        },
      ],
    });
  });

  describe("Route Definitions", () => {
    it("should have all required routes defined", () => {
      const routes = testRouter.getRoutes();

      expect(routes).toHaveLength(6);

      const routeNames = routes.map((route) => route.name);
      expect(routeNames).toContain("Home");
      expect(routeNames).toContain("ProductsList");
      expect(routeNames).toContain("ProductDetails");
      expect(routeNames).toContain("EditProduct");
      expect(routeNames).toContain("CreateProduct");
      expect(routeNames).toContain("NotFound");
    });

    it("should have correct paths for each route", () => {
      const routes = testRouter.getRoutes();

      const homeRoute = routes.find((r) => r.name === "Home");
      expect(homeRoute?.path).toBe("/");

      const productsRoute = routes.find((r) => r.name === "ProductsList");
      expect(productsRoute?.path).toBe("/products");

      const productDetailsRoute = routes.find(
        (r) => r.name === "ProductDetails"
      );
      expect(productDetailsRoute?.path).toBe("/products/:id");

      const editProductRoute = routes.find((r) => r.name === "EditProduct");
      expect(editProductRoute?.path).toBe("/products/:id/edit");

      const createProductRoute = routes.find((r) => r.name === "CreateProduct");
      expect(createProductRoute?.path).toBe("/products/create");

      const notFoundRoute = routes.find((r) => r.name === "NotFound");
      expect(notFoundRoute?.path).toBe("/:pathMatch(.*)*");
    });

    it("should have correct components for each route", () => {
      const routes = testRouter.getRoutes();

      const homeRoute = routes.find((r) => r.name === "Home");
      expect(homeRoute?.components?.default).toBe(ProductsList);

      const productsRoute = routes.find((r) => r.name === "ProductsList");
      expect(productsRoute?.components?.default).toBe(ProductsList);

      const productDetailsRoute = routes.find(
        (r) => r.name === "ProductDetails"
      );
      expect(productDetailsRoute?.components?.default).toBe(ProductDetails);

      const editProductRoute = routes.find((r) => r.name === "EditProduct");
      expect(editProductRoute?.components?.default).toBe(ProductDetails);

      const createProductRoute = routes.find((r) => r.name === "CreateProduct");
      expect(createProductRoute?.components?.default).toBe(CreateProduct);

      const notFoundRoute = routes.find((r) => r.name === "NotFound");
      expect(notFoundRoute?.components?.default).toBe(NotFound);
    });
  });
});
