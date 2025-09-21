import { describe, it, expect, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import { createRouter, createWebHistory } from "vue-router";
import NotFound from "./NotFound.vue";

// Create a mock router for testing
const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/products", component: { template: "<div>Products</div>" } },
  ],
});

describe("NotFound", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders 404 heading", () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [router],
      },
    });

    const heading = wrapper.find("h1");
    expect(heading.exists()).toBe(true);
    expect(heading.text()).toBe("404");
  });

  it("renders page not found message", () => {
    const wrapper = mount(NotFound, {
      global: {
        plugins: [router],
      },
    });

    const subHeading = wrapper.find("h2");
    expect(subHeading.exists()).toBe(true);
    expect(subHeading.text()).toBe("Page Not Found");
  });
});
