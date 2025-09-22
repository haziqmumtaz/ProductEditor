import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import { ref } from "vue";
import { mockSingleProduct } from "../testing/mock";
import ProductDetails from "./ProductDetails.vue";

// Mock the API composables
const mockGetProductExecute = vi.fn();
const mockGetProductResponse = vi.fn(() => ref(null as any));
const mockGetProductLoading = vi.fn(() => ref(false));
const mockGetProductError = vi.fn(() => ref(""));

const mockPatchProductExecute = vi.fn();
const mockPatchProductResponse = vi.fn(() => ref(null as any));
const mockPatchProductLoading = vi.fn(() => ref(false));
const mockPatchProductError = vi.fn(() => ref(""));

vi.mock("../api/useGetProductById", () => ({
  useGetProductById: vi.fn(() => ({
    response: mockGetProductResponse(),
    loading: mockGetProductLoading(),
    error: mockGetProductError(),
    execute: mockGetProductExecute,
  })),
}));

vi.mock("../api/usePatchProduct", () => ({
  usePatchProduct: vi.fn(() => ({
    response: mockPatchProductResponse(),
    loading: mockPatchProductLoading(),
    error: mockPatchProductError(),
    execute: mockPatchProductExecute,
  })),
}));

// Mock child components
vi.mock("../components/ProductForm.vue", () => ({
  default: {
    name: "ProductForm",
    template: "<div>ProductForm Mock</div>",
    props: ["product", "loading", "mode"],
    emits: ["update:product", "validation-change"],
  },
}));

vi.mock("../components/ProductDetailsSection.vue", () => ({
  default: {
    name: "ProductDetailsSection",
    template: "<div>ProductDetailsSection Mock</div>",
    props: ["product"],
  },
}));

// Mock router
const mockPush = vi.fn();
const mockRoute = {
  params: { id: "1" },
  name: "ProductDetails",
};

vi.mock("vue-router", async () => {
  const actual = await vi.importActual("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
    useRoute: () => mockRoute,
  };
});

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

describe("ProductDetails", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockPush.mockClear();
    mockGetProductExecute.mockClear();
    mockPatchProductExecute.mockClear();
    mockGetProductResponse.mockReturnValue(ref(mockSingleProduct));
    mockGetProductLoading.mockReturnValue(ref(false));
    mockGetProductError.mockReturnValue(ref(""));
    mockPatchProductResponse.mockReturnValue(ref(mockSingleProduct));
    mockPatchProductLoading.mockReturnValue(ref(false));
    mockPatchProductError.mockReturnValue(ref(""));
    vi.clearAllMocks();
  });

  describe("Product Loading", () => {
    it("loads product on component mount", async () => {
      await router.push("/");
      await router.isReady();

      mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      expect(mockGetProductExecute).toHaveBeenCalledWith(1);
    });

    it("shows loading state when product is being fetched", async () => {
      mockGetProductLoading.mockReturnValue(ref(true));

      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      expect(wrapper.text()).toContain("Loading product details...");
    });
  });

  describe("View Mode", () => {
    it("shows edit and back buttons when not in edit mode", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const editButton = buttons.find((btn) => btn.text().includes("Edit"));
      expect(editButton?.exists()).toBe(true);
      const backButton = buttons.find((btn) =>
        btn.text().includes("Back to Products List")
      );
      expect(backButton?.exists()).toBe(true);
    });

    it("navigates to edit route when edit button is clicked", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const editButton = buttons.find((btn) => btn.text().includes("Edit"));
      await editButton?.trigger("click");

      expect(mockPush).toHaveBeenCalledWith("/products/1/edit");
    });
  });

  describe("Edit Mode", () => {
    beforeEach(() => {
      mockRoute.name = "EditProduct";
    });

    it("shows cancel and save buttons when in edit mode", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain("Cancel");
      expect(wrapper.text()).toContain("Save Changes");
    });

    it("does not show edit button when in edit mode", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const editButton = buttons.find((btn) => btn.text().includes("Edit"));
      expect(editButton).toBeUndefined();
    });

    it("navigates back to view mode when cancel button is clicked", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const cancelButton = buttons.find((btn) => btn.text().includes("Cancel"));
      await cancelButton?.trigger("click");

      expect(mockPush).toHaveBeenCalledWith("/products/1");
    });
  });

  describe("Save Functionality", () => {
    beforeEach(() => {
      mockRoute.name = "EditProduct";
    });

    it("disables save button when form is invalid", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const saveButton = buttons.find((btn) =>
        btn.text().includes("Save Changes")
      );
      expect(saveButton?.props("disabled")).toBe(true);
    });

    it("shows loading state on save button when patching", async () => {
      mockPatchProductLoading.mockReturnValue(ref(true));

      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const saveButton = buttons.find((btn) =>
        btn.text().includes("Save Changes")
      );
      expect(saveButton?.props("loading")).toBeDefined();
    });

    it("shows error message when patching fails", async () => {
      mockPatchProductError.mockReturnValue(ref("Failed to update product"));

      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain(
        "Product Could Not Be Updated - Please try again"
      );
    });
  });

  describe("Navigation", () => {
    it("navigates back to products list when back button is clicked", async () => {
      await router.push("/");
      await router.isReady();

      const wrapper = mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      await wrapper.vm.$nextTick();

      const buttons = wrapper.findAllComponents({ name: "BaseButton" });
      const backButton = buttons.find((btn) =>
        btn.text().includes("Back to Products List")
      );
      await backButton?.trigger("click");

      expect(mockPush).toHaveBeenCalledWith("/products");
    });
  });

  describe("Route Parameters", () => {
    it("extracts product ID from route parameters", async () => {
      mockRoute.params.id = "123";

      await router.push("/");
      await router.isReady();

      mount(ProductDetails, {
        global: {
          plugins: [router],
        },
      });

      expect(mockGetProductExecute).toHaveBeenCalledWith(123);
    });
  });
});
