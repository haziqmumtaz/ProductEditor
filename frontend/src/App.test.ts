import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";

// Mock child components
vi.mock("./components/layout/BaseHeader.vue", () => ({
  default: {
    name: "Header",
    template: "<div>Header Mock</div>",
    props: ["title"],
  },
}));

vi.mock("./components/buttons/BaseButton.vue", () => ({
  default: {
    name: "BaseButton",
    template: "<button><slot>Create Product</slot></button>",
    props: ["variant", "size"],
    emits: ["click"],
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
    RouterView: {
      name: "RouterView",
      template: "<div>RouterView Mock</div>",
    },
  };
});

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: "/", component: { template: "<div>Home</div>" } }],
});

describe("App", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    mockPush.mockClear();
    vi.clearAllMocks();
  });

  it("renders app structure with header and router view", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.find("div").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "Header" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "RouterView" }).exists()).toBe(true);
  });

  it("renders header with correct title", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    const header = wrapper.findComponent({ name: "Header" });
    expect(header.props("title")).toBe("Coda Products Panel");
  });

  it("renders router view for page content", async () => {
    await router.push("/");
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router],
      },
    });

    const routerView = wrapper.findComponent({ name: "RouterView" });
    expect(routerView.exists()).toBe(true);
  });
});
