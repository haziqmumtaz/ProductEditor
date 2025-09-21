import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import BaseSearchBar from "./BaseSearchBar.vue";

describe("BaseSearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = "";
  });

  it("renders input element", () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("placeholder")).toBe("Search products...");
  });

  it("applies correct CSS classes", () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");
    expect(input.classes()).toContain("border");
    expect(input.classes()).toContain("rounded");
    expect(input.classes()).toContain("px-3");
    expect(input.classes()).toContain("py-2");
    expect(input.classes()).toContain("w-full");
  });

  it("updates input value when typed", async () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");
    await input.setValue("test search");

    expect(input.element.value).toBe("test search");
  });

  it("emits search event with debounce", async () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");
    await input.setValue("test");

    // Should not emit immediately
    expect(wrapper.emitted("search")).toBeFalsy();

    // Fast-forward 500ms
    vi.advanceTimersByTime(500);

    // Now should emit
    expect(wrapper.emitted("search")).toBeTruthy();
    expect(wrapper.emitted("search")?.[0]).toEqual(["test"]);
  });

  it("debounces multiple rapid inputs", async () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");

    // Type multiple characters rapidly
    await input.setValue("a");
    vi.advanceTimersByTime(100);

    await input.setValue("ab");
    vi.advanceTimersByTime(100);

    await input.setValue("abc");
    vi.advanceTimersByTime(100);

    // Should not have emitted yet
    expect(wrapper.emitted("search")).toBeFalsy();

    // Fast-forward to complete the debounce
    vi.advanceTimersByTime(500);

    // Should only emit once with the final value
    expect(wrapper.emitted("search")).toHaveLength(1);
    expect(wrapper.emitted("search")?.[0]).toEqual(["abc"]);
  });

  it("clears previous timeout on new input", async () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");

    // First input
    await input.setValue("first");
    vi.advanceTimersByTime(300);

    // Second input (should clear previous timeout)
    await input.setValue("second");
    vi.advanceTimersByTime(300);

    // Should not have emitted from first input
    expect(wrapper.emitted("search")).toBeFalsy();

    // Complete the debounce for second input
    vi.advanceTimersByTime(200);

    // Should only emit for second input
    expect(wrapper.emitted("search")).toHaveLength(1);
    expect(wrapper.emitted("search")?.[0]).toEqual(["second"]);
  });

  it("handles empty input", async () => {
    const wrapper = mount(BaseSearchBar);

    const input = wrapper.find("input");
    await input.setValue("test");
    vi.advanceTimersByTime(500);

    // Clear the input
    await input.setValue("");
    vi.advanceTimersByTime(500);

    // Should emit empty string
    expect(wrapper.emitted("search")).toHaveLength(2);
    expect(wrapper.emitted("search")?.[1]).toEqual([""]);
  });
});
