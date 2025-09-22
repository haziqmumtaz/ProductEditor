import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import BaseButton from "./BaseButton.vue";

describe("BaseButton", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders with default props", () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: "Click me",
      },
    });

    const button = wrapper.find("button");
    expect(button.exists()).toBe(true);
    expect(button.text()).toBe("Click me");
    expect(button.attributes("type")).toBe("button");
    expect(button.attributes("disabled")).toBeUndefined();
  });

  it("applies correct variant classes", () => {
    const variants = ["primary", "secondary", "danger", "basic"] as const;

    variants.forEach((variant) => {
      const wrapper = mount(BaseButton, {
        props: { variant },
        slots: { default: "Button" },
      });

      const button = wrapper.find("button");
      expect(button.classes()).toContain("inline-flex");
      expect(button.classes()).toContain("items-center");
      expect(button.classes()).toContain("justify-center");
    });
  });

  it("applies correct size classes", () => {
    const sizes = ["xs", "sm", "md", "lg", "xl", "auto"] as const;

    sizes.forEach((size) => {
      const wrapper = mount(BaseButton, {
        props: { size },
        slots: { default: "Button" },
      });

      const button = wrapper.find("button");
      expect(button.classes()).toContain("inline-flex");
    });
  });

  it("applies disabled state correctly", () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: "Disabled Button" },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.classes()).toContain("opacity-50");
    expect(button.classes()).toContain("cursor-not-allowed");
  });

  it("applies loading state correctly", () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: "Loading Button" },
    });

    const button = wrapper.find("button");
    expect(button.attributes("disabled")).toBeDefined();
    expect(button.classes()).toContain("cursor-wait");

    // Check for loading spinner
    const spinner = wrapper.find("svg");
    expect(spinner.exists()).toBe(true);
    expect(spinner.classes()).toContain("animate-spin");
  });

  it("sets correct button type", () => {
    const types = ["button", "submit", "reset"] as const;

    types.forEach((type) => {
      const wrapper = mount(BaseButton, {
        props: { type },
        slots: { default: "Button" },
      });

      const button = wrapper.find("button");
      expect(button.attributes("type")).toBe(type);
    });
  });

  it("sets title attribute when provided", () => {
    const wrapper = mount(BaseButton, {
      props: { title: "Tooltip text" },
      slots: { default: "Button" },
    });

    const button = wrapper.find("button");
    expect(button.attributes("title")).toBe("Tooltip text");
  });

  it("emits click event when clicked", async () => {
    const wrapper = mount(BaseButton, {
      slots: { default: "Click me" },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("click")).toBeTruthy();
    expect(wrapper.emitted("click")).toHaveLength(1);
  });

  it("does not emit click event when disabled", async () => {
    const wrapper = mount(BaseButton, {
      props: { disabled: true },
      slots: { default: "Disabled Button" },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("does not emit click event when loading", async () => {
    const wrapper = mount(BaseButton, {
      props: { loading: true },
      slots: { default: "Loading Button" },
    });

    const button = wrapper.find("button");
    await button.trigger("click");

    expect(wrapper.emitted("click")).toBeFalsy();
  });

  it("renders slot content correctly", () => {
    const wrapper = mount(BaseButton, {
      slots: {
        default: "<span>Custom content</span>",
      },
    });

    const button = wrapper.find("button");
    expect(button.html()).toContain("<span>Custom content</span>");
  });

  it("combines multiple props correctly", () => {
    const wrapper = mount(BaseButton, {
      props: {
        variant: "danger",
        size: "lg",
        disabled: false,
        loading: false,
        type: "submit",
        title: "Submit form",
      },
      slots: { default: "Submit" },
    });

    const button = wrapper.find("button");
    expect(button.attributes("type")).toBe("submit");
    expect(button.attributes("title")).toBe("Submit form");
    expect(button.attributes("disabled")).toBeUndefined();
    expect(wrapper.find("svg").exists()).toBe(false);
  });
});
