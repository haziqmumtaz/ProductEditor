import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BaseHeader from "./BaseHeader.vue";

describe("BaseHeader", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders with required title prop", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "My App",
      },
    });

    const header = wrapper.find("header");
    expect(header.exists()).toBe(true);

    const title = wrapper.find("h1");
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("My App");
  });

  it("renders logo when provided", () => {
    const logoUrl = "https://example.com/logo.png";
    const wrapper = mount(BaseHeader, {
      props: {
        title: "My App",
        logo: logoUrl,
      },
    });

    const logo = wrapper.find("img");
    expect(logo.exists()).toBe(true);
    expect(logo.attributes("src")).toBe(logoUrl);
    expect(logo.attributes("alt")).toBe("Logo");
  });

  it("does not render logo when not provided", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "My App",
      },
    });

    const logo = wrapper.find("img");
    expect(logo.exists()).toBe(false);
  });

  it("renders slot content", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "My App",
      },
      slots: {
        default: "<button>Menu</button>",
      },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Menu");
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "My App",
      },
    });

    const header = wrapper.find("header");
    expect(header.classes()).toContain("header");
  });

  it("displays different titles correctly", () => {
    const titles = ["Home", "Products", "About Us", "Contact"];

    titles.forEach((title) => {
      const wrapper = mount(BaseHeader, {
        props: { title },
      });

      const titleElement = wrapper.find("h1");
      expect(titleElement.text()).toBe(title);
    });
  });

  it("combines logo and title correctly", () => {
    const wrapper = mount(BaseHeader, {
      props: {
        title: "Product Editor",
        logo: "/logo.png",
      },
    });

    const logo = wrapper.find("img");
    const title = wrapper.find("h1");

    expect(logo.exists()).toBe(true);
    expect(title.exists()).toBe(true);
    expect(title.text()).toBe("Product Editor");
  });
});
