import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import CreateProduct from "./CreateProduct.vue";

// Mock the composables
const mockExecute = vi.fn();
const mockResponse = vi.fn(() => ({ value: null }));
const mockLoading = vi.fn(() => ({ value: false }));
const mockError = vi.fn(() => ({ value: "" }));

vi.mock("../api/usePostProduct", () => ({
  usePostProduct: vi.fn(() => ({
    response: mockResponse(),
    loading: mockLoading(),
    error: mockError(),
    execute: mockExecute,
  })),
}));

// Mock the router
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

// Mock ProductForm component
vi.mock("../components/ProductForm.vue", () => ({
  default: {
    name: "ProductForm",
    template: `
      <div>
        <slot name="default"></slot>
        <div>ProductForm Mock</div>
      </div>
    `,
    emits: ["update:product", "validation-change"],
  },
}));

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: { template: "<div>Home</div>" } },
    { path: "/products", component: { template: "<div>Products</div>" } },
    {
      path: "/products/:id",
      component: { template: "<div>Product Details</div>" },
    },
  ],
});

describe("CreateProduct", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockPush.mockClear();
    mockExecute.mockClear();
    mockResponse.mockReturnValue({ value: null });
    mockLoading.mockReturnValue({ value: false });
    mockError.mockReturnValue({ value: "" });
    vi.clearAllMocks();
  });

  it("renders page structure with header, form, and action buttons", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CreateProduct, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find(".min-h-screen.bg-gray-50").exists()).toBe(true);
    expect(wrapper.find(".bg-white.shadow-sm.border-b").exists()).toBe(true);
    expect(wrapper.text()).toContain("Create New Product");
    expect(wrapper.text()).toContain(
      "Fill in the details below to create a new product."
    );
    expect(wrapper.text()).toContain("Cancel");
    expect(wrapper.text()).toContain("Create Product");
    expect(wrapper.findComponent({ name: "ProductForm" }).exists()).toBe(true);
  });

  it("handles form validation changes and button states correctly", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CreateProduct, {
      global: {
        plugins: [router],
      },
    });

    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    const createButton = buttons.find((btn) =>
      btn.text().includes("Create Product")
    );
    const cancelButton = buttons.find((btn) => btn.text().includes("Cancel"));

    expect(createButton).toBeDefined();
    expect(cancelButton).toBeDefined();
    expect(createButton?.props("disabled")).toBe(true);

    const productForm = wrapper.findComponent({ name: "ProductForm" });
    await productForm.vm.$emit("validation-change", true);
    await wrapper.vm.$nextTick();

    expect(createButton?.props("disabled")).toBe(false);

    await productForm.vm.$emit("validation-change", false);
    await wrapper.vm.$nextTick();

    expect(createButton?.props("disabled")).toBe(true);
  });

  it("handles product creation flow and button interactions", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CreateProduct, {
      global: {
        plugins: [router],
      },
    });

    const productForm = wrapper.findComponent({ name: "ProductForm" });
    await productForm.vm.$emit("validation-change", true);

    await wrapper.vm.$nextTick();

    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    const createButton = buttons.find((btn) =>
      btn.text().includes("Create Product")
    );
    expect(createButton?.props("disabled")).toBe(false);

    await createButton?.trigger("click");

    await wrapper.vm.$nextTick();

    expect(createButton?.props("disabled")).toBe(false);
  });

  it("handles cancel action and navigation back to products list", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CreateProduct, {
      global: {
        plugins: [router],
      },
    });

    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    const cancelButton = buttons.find((btn) => btn.text().includes("Cancel"));
    expect(cancelButton).toBeDefined();

    if (cancelButton) {
      await cancelButton.trigger("click");
      expect(mockPush).toHaveBeenCalledWith("/products");
    }
  });

  it("prevents creation when form is invalid and handles product updates", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(CreateProduct, {
      global: {
        plugins: [router],
      },
    });

    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    const createButton = buttons.find((btn) =>
      btn.text().includes("Create Product")
    );
    expect(createButton?.props("disabled")).toBe(true);

    await createButton?.trigger("click");
    expect(mockExecute).not.toHaveBeenCalled();

    const productForm = wrapper.findComponent({ name: "ProductForm" });
    await productForm.vm.$emit("update:product", { name: "Test Product" });

    expect(productForm.exists()).toBe(true);
  });
});
