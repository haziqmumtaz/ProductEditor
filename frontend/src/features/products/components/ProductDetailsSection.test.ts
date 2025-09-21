import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ProductDetailsSection from "./ProductDetailsSection.vue";
import type { Product } from "../types";
import { mockSingleProduct, mockProducts } from "../testing/mock";

describe("ProductDetailsSection", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders all basic product information", () => {
    const wrapper = mount(ProductDetailsSection, {
      props: { product: mockSingleProduct },
    });

    // Check that all main product fields are displayed
    expect(wrapper.text()).toContain("Product Name");
    expect(wrapper.text()).toContain(mockSingleProduct.name);
    expect(wrapper.text()).toContain("Product Title");
    expect(wrapper.text()).toContain(mockSingleProduct.productTitle);
    expect(wrapper.text()).toContain("Government ID");
    expect(wrapper.text()).toContain(mockSingleProduct.gvtId.toString());
    expect(wrapper.text()).toContain("Tagline");
    expect(wrapper.text()).toContain(mockSingleProduct.productTagline);
    expect(wrapper.text()).toContain("Voucher Type");
    expect(wrapper.text()).toContain(mockSingleProduct.voucherTypeName);
    expect(wrapper.text()).toContain("Product URL");
    expect(wrapper.text()).toContain(mockSingleProduct.productUrl);
    expect(wrapper.text()).toContain("Order URL");
    expect(wrapper.text()).toContain(mockSingleProduct.orderUrl);
    expect(wrapper.text()).toContain("Price Range");
    expect(wrapper.text()).toContain(
      `$${mockSingleProduct.variableDenomPriceMinAmount}`
    );
    expect(wrapper.text()).toContain(
      `$${mockSingleProduct.variableDenomPriceMaxAmount}`
    );
    expect(wrapper.text()).toContain("Short Description");
    expect(wrapper.text()).toContain(mockSingleProduct.shortDescription);
    expect(wrapper.text()).toContain("Long Description");
    expect(wrapper.text()).toContain(mockSingleProduct.longDescription);
  });

  it("does not display price range section when not available", () => {
    const productWithoutPrice = {
      ...mockSingleProduct,
      variableDenomPriceMinAmount: undefined,
      variableDenomPriceMaxAmount: undefined,
    };

    const wrapper = mount(ProductDetailsSection, {
      props: { product: productWithoutPrice },
    });

    expect(wrapper.text()).not.toContain("Price Range");
  });

  it("renders descriptions with v-html support", () => {
    const productWithHtmlDescriptions = {
      ...mockSingleProduct,
      shortDescription: "This is a <strong>bold</strong> short description",
      longDescription: "This is a <em>italic</em> long description",
    };

    const wrapper = mount(ProductDetailsSection, {
      props: { product: productWithHtmlDescriptions },
    });

    // Check that HTML is rendered in short description
    const shortDescElement = wrapper.find('div[class*="leading-relaxed"]');
    expect(shortDescElement.html()).toContain("<strong>bold</strong>");

    // Check that HTML is rendered in long description
    const longDescElements = wrapper.findAll('div[class*="leading-relaxed"]');
    expect(longDescElements[1].html()).toContain("<em>italic</em>");
  });

  it("handles empty strings gracefully", () => {
    const productWithEmptyStrings = {
      ...mockSingleProduct,
      shortDescription: "",
      longDescription: "",
      productTagline: "",
    };

    const wrapper = mount(ProductDetailsSection, {
      props: { product: productWithEmptyStrings },
    });

    // Empty strings should not render the sections due to v-if conditions
    expect(wrapper.text()).not.toContain("Short Description");
    expect(wrapper.text()).not.toContain("Long Description");
    // Tagline should still render as it's always displayed
    expect(wrapper.text()).toContain("Tagline");
  });

  it("maintains responsive grid layout", () => {
    const wrapper = mount(ProductDetailsSection, {
      props: { product: mockSingleProduct },
    });

    // Check responsive grid classes
    const gridContainer = wrapper.find(
      ".grid.grid-cols-1.lg\\:grid-cols-2.gap-8"
    );
    expect(gridContainer.exists()).toBe(true);
  });
});
