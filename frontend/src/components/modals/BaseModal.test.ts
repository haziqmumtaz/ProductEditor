import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import BaseModal from "./BaseModal.vue";

describe("BaseModal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders when isOpen is true", async () => {
    const wrapper = mount(BaseModal, {
      props: { isOpen: true },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Check if modal content exists in document body
    const modalContent = document.querySelector('[class*="fixed inset-0"]');
    expect(modalContent).toBeTruthy();
  });

  it("does not render when isOpen is false", async () => {
    const wrapper = mount(BaseModal, {
      props: { isOpen: false },
    });

    await wrapper.vm.$nextTick();

    const modalContent = document.querySelector('[class*="fixed inset-0"]');
    expect(modalContent).toBeFalsy();
  });

  it("emits close event on Escape key", async () => {
    const wrapper = mount(BaseModal, {
      props: { isOpen: true },
    });

    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(escapeEvent);

    expect(wrapper.emitted("close")).toBeTruthy();
  });

  it("emits close event when close button is clicked", async () => {
    const wrapper = mount(BaseModal, {
      props: { isOpen: true },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Find the close button in the document
    const closeButton = document.querySelector("button");
    if (closeButton) {
      closeButton.click();
      expect(wrapper.emitted("close")).toBeTruthy();
    }
  });

  it("has correct props interface", () => {
    const wrapper = mount(BaseModal, {
      props: {
        isOpen: true,
        title: "Test Modal",
        size: "lg",
        closeOnBackdrop: false,
      },
    });

    expect(wrapper.props("isOpen")).toBe(true);
    expect(wrapper.props("title")).toBe("Test Modal");
    expect(wrapper.props("size")).toBe("lg");
    expect(wrapper.props("closeOnBackdrop")).toBe(false);
  });

  it("uses default props correctly", () => {
    const wrapper = mount(BaseModal, {
      props: { isOpen: true },
    });

    expect(wrapper.props("size")).toBe("md");
    expect(wrapper.props("closeOnBackdrop")).toBe(true);
  });
});
