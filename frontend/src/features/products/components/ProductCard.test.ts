import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mockSingleProduct } from "../testing/mock";
import ProductCard from "./ProductCard.vue";

// Mock the icons
vi.mock("../../../assets/icons", () => ({
  ViewIcon: {
    name: "ViewIcon",
    template: "<div data-testid='view-icon'>View</div>",
  },
  EditIcon: {
    name: "EditIcon",
    template: "<div data-testid='edit-icon'>Edit</div>",
  },
  DeleteIcon: {
    name: "DeleteIcon",
    template: "<div data-testid='delete-icon'>Delete</div>",
  },
}));

describe("ProductCard", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders product information correctly", () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockSingleProduct },
    });

    const image = wrapper.find("img");
    expect(image.exists()).toBe(true);
    expect(image.attributes("src")).toBe(mockSingleProduct.logoLocation);
    expect(image.attributes("alt")).toBe(mockSingleProduct.name);
    expect(wrapper.text()).toContain(`Id: ${mockSingleProduct.id}`);
    expect(wrapper.text()).toContain(`GvtId: ${mockSingleProduct.gvtId}`);
    expect(wrapper.text()).toContain(mockSingleProduct.name);
    expect(wrapper.text()).toContain(mockSingleProduct.shortDescription);
    expect(wrapper.text()).toContain(
      `$${mockSingleProduct.variableDenomPriceMinAmount}`
    );
    expect(wrapper.text()).toContain(
      `$${mockSingleProduct.variableDenomPriceMaxAmount}`
    );
  });

  it("does not display price range when not available", () => {
    const productWithoutPrice = {
      ...mockSingleProduct,
      variableDenomPriceMinAmount: undefined,
      variableDenomPriceMaxAmount: undefined,
    };

    const wrapper = mount(ProductCard, {
      props: { product: productWithoutPrice },
    });

    expect(wrapper.text()).not.toContain("$");
  });

  it("handles image error by setting fallback image", async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockSingleProduct },
    });

    const image = wrapper.find("img");
    const errorEvent = new Event("error");

    // Trigger the error event
    await image.element.dispatchEvent(errorEvent);

    // The error handler should set a fallback image
    expect(image.attributes("src")).toContain("data:image/svg+xml");
  });

  it("renders action buttons with correct icons and emits events", async () => {
    const wrapper = mount(ProductCard, {
      props: { product: mockSingleProduct },
    });

    // Check that all three action buttons exist
    expect(wrapper.find('[data-testid="view-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="edit-icon"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="delete-icon"]').exists()).toBe(true);

    const viewButton = wrapper.findAllComponents({ name: "BaseButton" })[0];
    await viewButton.trigger("click");
    expect(wrapper.emitted("viewDetails")).toBeTruthy();
    expect(wrapper.emitted("viewDetails")?.[0]).toEqual([mockSingleProduct]);

    const editButton = wrapper.findAllComponents({ name: "BaseButton" })[1];
    await editButton.trigger("click");
    expect(wrapper.emitted("edit")).toBeTruthy();
    expect(wrapper.emitted("edit")?.[0]).toEqual([mockSingleProduct]);

    const deleteButton = wrapper.findAllComponents({ name: "BaseButton" })[2];
    await deleteButton.trigger("click");
    expect(wrapper.emitted("delete")).toBeTruthy();
    expect(wrapper.emitted("delete")?.[0]).toEqual([mockSingleProduct]);
  });

  it("renders short description with v-html", () => {
    const productWithHtmlDescription = {
      ...mockSingleProduct,
      shortDescription: "This is a <strong>bold</strong> description",
    };

    const wrapper = mount(ProductCard, {
      props: { product: productWithHtmlDescription },
    });

    // Find the paragraph element that contains the short description
    const descriptionElement = wrapper.find(
      "p.text-gray-600.text-sm.line-clamp-2"
    );
    expect(descriptionElement.html()).toContain("<strong>bold</strong>");
  });

  it("handles long product names with line-clamp", () => {
    const productWithLongName = {
      ...mockSingleProduct,
      name: "This is a very long product name that should be truncated with line-clamp-2 class",
    };

    const wrapper = mount(ProductCard, {
      props: { product: productWithLongName },
    });

    const nameElement = wrapper.find("h4.font-semibold");
    expect(nameElement.classes()).toContain("line-clamp-2");
  });
});
