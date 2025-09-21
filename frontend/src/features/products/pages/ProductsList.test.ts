import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import ProductsList from "./ProductsList.vue";
import { mockProducts, mockPaginatedResponse } from "../testing/mock";

// Mock the API composables
const mockGetProductsExecute = vi.fn();
const mockGetProductsResponse = vi.fn(() => ({ value: null as any }));
const mockGetProductsLoading = vi.fn(() => ({ value: false }));
const mockGetProductsError = vi.fn(() => ({ value: "" }));

const mockDeleteProductExecute = vi.fn();
const mockDeleteProductResponse = vi.fn(() => ({ value: null as any }));
const mockDeleteProductLoading = vi.fn(() => ({ value: false }));
const mockDeleteProductError = vi.fn(() => ({ value: "" }));

vi.mock("../api/useGetProducts", () => ({
  useGetProducts: vi.fn(() => ({
    response: mockGetProductsResponse(),
    loading: mockGetProductsLoading(),
    error: mockGetProductsError(),
    execute: mockGetProductsExecute,
  })),
}));

vi.mock("../api/useDeleteProduct", () => ({
  useDeleteProduct: vi.fn(() => ({
    response: mockDeleteProductResponse(),
    loading: mockDeleteProductLoading(),
    error: mockDeleteProductError(),
    execute: mockDeleteProductExecute,
  })),
}));

// Mock child components
vi.mock("../components/ProductCard.vue", () => ({
  default: {
    name: "ProductCard",
    template: "<div>ProductCard Mock</div>",
    props: ["product"],
    emits: ["view-details", "edit", "delete"],
  },
}));

vi.mock("../../../components/searchBar/BaseSearchBar.vue", () => ({
  default: {
    name: "SearchBar",
    template: "<div>SearchBar Mock</div>",
    emits: ["search"],
  },
}));

vi.mock("../../../components/modals/ConfirmationModal.vue", () => ({
  default: {
    name: "ConfirmationModal",
    template: "<div>ConfirmationModal Mock</div>",
    props: [
      "isOpen",
      "title",
      "message",
      "confirmText",
      "cancelText",
      "variant",
    ],
    emits: ["close", "confirm"],
  },
}));

// Mock router
const mockPush = vi.fn();
vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/products", component: { template: "<div>Products</div>" } },
    {
      path: "/products/:id",
      component: { template: "<div>Product Details</div>" },
    },
    {
      path: "/products/:id/edit",
      component: { template: "<div>Edit Product</div>" },
    },
  ],
});

describe("ProductsList", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockPush.mockClear();
    mockGetProductsExecute.mockClear();
    mockDeleteProductExecute.mockClear();
    mockGetProductsResponse.mockReturnValue({ value: mockPaginatedResponse });
    mockGetProductsLoading.mockReturnValue({ value: false });
    mockGetProductsError.mockReturnValue({ value: "" });
    mockDeleteProductResponse.mockReturnValue({ value: null as any });
    mockDeleteProductLoading.mockReturnValue({ value: false });
    mockDeleteProductError.mockReturnValue({ value: "" });
    vi.clearAllMocks();

    // Ensure the mock response is set up correctly
    mockGetProductsResponse.mockReturnValue({ value: mockPaginatedResponse });
  });

  it("renders page structure with header and controls", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(ProductsList, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.vm.$nextTick();

    expect(wrapper.find(".p-4.pt-8.w-\\[80vw\\]").exists()).toBe(true);
    expect(wrapper.text()).toContain("Products");
    expect(wrapper.text()).toContain("Sort by:");
    expect(wrapper.text()).toContain("Order:");
    expect(wrapper.findComponent({ name: "SearchBar" }).exists()).toBe(true);
    expect(wrapper.findAll("select")).toHaveLength(2);
  });

  it("loads products on component mount", async () => {
    await router.push("/");
    await router.isReady();

    mount(ProductsList, {
      global: {
        plugins: [router],
      },
    });

    expect(mockGetProductsExecute).toHaveBeenCalledWith({
      query: "",
      page: 1,
      limit: 12,
      sortBy: "id",
      sortOrder: "asc",
    });
  });

  it("handles search functionality and sorting controls", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(ProductsList, {
      global: {
        plugins: [router],
      },
    });

    // Test search
    const searchBar = wrapper.findComponent({ name: "SearchBar" });
    await searchBar.vm.$emit("search", "test query");
    expect(mockGetProductsExecute).toHaveBeenCalledWith({
      query: "test query",
      page: 1,
      limit: 12,
      sortBy: "id",
      sortOrder: "asc",
    });

    // Reset mocks for sorting tests
    mockGetProductsExecute.mockClear();

    // Test sorting
    const sortBySelect = wrapper.findAll("select")[0];
    await sortBySelect.setValue("name");
    await sortBySelect.trigger("change");
    expect(mockGetProductsExecute).toHaveBeenCalledWith({
      query: "test query",
      page: 1,
      limit: 12,
      sortBy: "name",
      sortOrder: "asc",
    });

    const sortOrderSelect = wrapper.findAll("select")[1];
    await sortOrderSelect.setValue("desc");
    await sortOrderSelect.trigger("change");
    expect(mockGetProductsExecute).toHaveBeenCalledWith({
      query: "test query",
      page: 1,
      limit: 12,
      sortBy: "name",
      sortOrder: "desc",
    });
  });
});
