import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ProductForm from "./ProductForm.vue";
import type { Product } from "../types";
import { mockSingleProduct, mockProductForCreation } from "../testing/mock";

describe("ProductForm", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("renders all form fields with correct labels and placeholders", () => {
    const wrapper = mount(ProductForm, {
      props: { product: mockSingleProduct },
    });

    // Check that all form fields are rendered with correct labels and asterisks
    expect(wrapper.text()).toContain("Logo Location");
    expect(wrapper.text()).toContain("Product Name");
    expect(wrapper.text()).toContain("Product Title");
    expect(wrapper.text()).toContain("GvtID");
    expect(wrapper.text()).toContain("Product Tagline");
    expect(wrapper.text()).toContain("Voucher Type Name");
    expect(wrapper.text()).toContain("Product URL");
    expect(wrapper.text()).toContain("Order URL");
    expect(wrapper.text()).toContain("Denom Price Min Amount");
    expect(wrapper.text()).toContain("Denom Price Max Amount");
    expect(wrapper.text()).toContain("Short Description");
    expect(wrapper.text()).toContain("Long Description");

    expect(wrapper.text()).toContain("Logo Location *");
    expect(wrapper.text()).toContain("Product Name *");
    expect(wrapper.text()).toContain("Product Title *");
    expect(wrapper.text()).toContain("GvtID *");
    expect(wrapper.text()).toContain("Product Tagline *");
    expect(wrapper.text()).toContain("Voucher Type Name *");
    expect(wrapper.text()).toContain("Product URL *");
    expect(wrapper.text()).toContain("Order URL *");
    expect(wrapper.text()).toContain("Short Description *");
    expect(wrapper.text()).toContain("Long Description *");

    expect(wrapper.text()).not.toContain("Denom Price Min Amount *");
    expect(wrapper.text()).not.toContain("Denom Price Max Amount *");
  });

  it("populates form fields with product data and handles input changes", async () => {
    const wrapper = mount(ProductForm, {
      props: { product: mockSingleProduct },
    });

    const nameInput = wrapper.find(
      'input[type="text"][placeholder="Enter product name"]'
    );
    const gvtIdInput = wrapper.find(
      'input[type="number"][placeholder="Enter gvtId"]'
    );
    const productUrlInput = wrapper.find(
      'input[type="text"][placeholder="Enter product URL"]'
    );
    const shortDescTextarea = wrapper.find(
      'textarea[placeholder="Enter short description"]'
    );

    expect((nameInput.element as HTMLInputElement).value).toBe(
      mockSingleProduct.name
    );
    expect((gvtIdInput.element as HTMLInputElement).value).toBe(
      mockSingleProduct.gvtId.toString()
    );
    expect((productUrlInput.element as HTMLInputElement).value).toBe(
      mockSingleProduct.productUrl
    );
    expect((shortDescTextarea.element as HTMLTextAreaElement).value).toBe(
      mockSingleProduct.shortDescription
    );

    await nameInput.setValue("Updated Product Name");
    await gvtIdInput.setValue("2001");
    await productUrlInput.setValue("https://updated.com");

    expect((nameInput.element as HTMLInputElement).value).toBe(
      "Updated Product Name"
    );
    expect((gvtIdInput.element as HTMLInputElement).value).toBe("2001");
    expect((productUrlInput.element as HTMLInputElement).value).toBe(
      "https://updated.com"
    );
  });

  it("handles create and edit modes correctly with different validation schemas", async () => {
    // Test create mode
    const createWrapper = mount(ProductForm, {
      props: { product: mockProductForCreation, mode: "create" },
    });

    // Check that form fields exist and have correct placeholders
    const nameInput = createWrapper.find(
      'input[placeholder="Enter product name"]'
    );
    const titleInput = createWrapper.find(
      'input[placeholder="Enter product title"]'
    );
    expect(nameInput.exists()).toBe(true);
    expect(titleInput.exists()).toBe(true);

    const editWrapper = mount(ProductForm, {
      props: { product: mockSingleProduct, mode: "edit" },
    });

    const editNameInput = editWrapper.find(
      'input[placeholder="Enter product name"]'
    );
    const editTitleInput = editWrapper.find(
      'input[placeholder="Enter product title"]'
    );
    expect((editNameInput.element as HTMLInputElement).value).toBe(
      mockSingleProduct.name
    );
    expect((editTitleInput.element as HTMLInputElement).value).toBe(
      mockSingleProduct.productTitle
    );
  });

  it("emits update events with debouncing and handles validation changes", async () => {
    const wrapper = mount(ProductForm, {
      props: { product: mockSingleProduct },
    });

    const nameInput = wrapper.find(
      'input[type="text"][placeholder="Enter product name"]'
    );

    await nameInput.setValue("New Product Name");
    expect(wrapper.emitted("update:product")).toBeFalsy(); // Should not emit immediately

    vi.advanceTimersByTime(300); // Fast-forward 300ms
    expect(wrapper.emitted("update:product")).toBeTruthy(); // Now should emit
    expect(wrapper.emitted("update:product")?.[0]).toEqual([
      expect.objectContaining({ name: "New Product Name" }),
    ]);

    // Test validation change emit
    await nameInput.setValue(""); // Invalid input
    vi.advanceTimersByTime(300);
    expect(wrapper.emitted("validation-change")).toBeTruthy();
  });

  it("shows validation errors and handles field validation correctly", async () => {
    const wrapper = mount(ProductForm, {
      props: { product: mockSingleProduct },
    });

    const nameInput = wrapper.find(
      'input[type="text"][placeholder="Enter product name"]'
    );

    // Test invalid input
    await nameInput.setValue(""); // Empty name should be invalid
    await nameInput.trigger("blur");
    vi.advanceTimersByTime(300);

    // Check that error is displayed
    expect(wrapper.text()).toContain("Name must be at least 3 characters");
    expect(wrapper.emitted("validation-change")?.[0]).toEqual([false]);

    // Test valid input
    await nameInput.setValue("Valid Product Name");
    await nameInput.trigger("blur");
    vi.advanceTimersByTime(300);

    // Error should be cleared
    expect(wrapper.text()).not.toContain("Name must be at least 3 characters");
    expect(wrapper.emitted("validation-change")?.pop()).toEqual([true]);
  });

  it("displays character counts and handles textarea inputs correctly", () => {
    const wrapper = mount(ProductForm, {
      props: { product: mockSingleProduct },
    });

    // Check character count display
    expect(wrapper.text()).toContain(
      `${mockSingleProduct.shortDescription.length} / 2000`
    );
    expect(wrapper.text()).toContain(
      `${mockSingleProduct.longDescription.length} / 3000`
    );

    // Check textarea attributes
    const shortDescTextarea = wrapper.find(
      'textarea[placeholder="Enter short description"]'
    );
    const longDescTextarea = wrapper.find(
      'textarea[placeholder="Enter long description"]'
    );

    expect(shortDescTextarea.attributes("rows")).toBe("4");
    expect(longDescTextarea.attributes("rows")).toBe("6");
  });

  it("handles edge cases and error states gracefully", async () => {
    const invalidProduct = {
      ...mockSingleProduct,
      name: "",
      gvtId: 0,
      orderUrl: "invalid-url", // Invalid
    };

    const wrapper = mount(ProductForm, {
      props: { product: invalidProduct },
    });

    // Test multiple validation errors
    const nameInput = wrapper.find(
      'input[type="text"][placeholder="Enter product name"]'
    );
    const gvtIdInput = wrapper.find(
      'input[type="number"][placeholder="Enter gvtId"]'
    );
    const orderUrlInput = wrapper.find(
      'input[type="url"][placeholder="Enter order URL"]'
    );

    await nameInput.trigger("blur");
    await gvtIdInput.trigger("blur");
    await orderUrlInput.trigger("blur");
    vi.advanceTimersByTime(300);

    // Should show multiple errors
    expect(wrapper.text()).toContain("Name must be at least 3 characters");
    expect(wrapper.text()).toContain("GvtID must be present");
    expect(wrapper.emitted("validation-change")?.pop()).toEqual([false]);
  });
});
