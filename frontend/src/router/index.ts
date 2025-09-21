import { createRouter, createWebHistory } from "vue-router";
import ProductsList from "../features/products/pages/ProductsList.vue";
import ProductDetails from "../features/products/pages/ProductDetails.vue";
import CreateProduct from "../features/products/pages/CreateProduct.vue";
import NotFound from "../components/layout/NotFound.vue";

const routes = [
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
