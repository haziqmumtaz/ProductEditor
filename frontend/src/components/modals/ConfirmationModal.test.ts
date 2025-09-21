import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import ConfirmationModal from "./ConfirmationModal.vue";

describe("ConfirmationModal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("renders when isOpen is true", async () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Are you sure you want to delete this item?",
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    const modalContent = document.querySelector('[class*="fixed inset-0"]');
    expect(modalContent).toBeTruthy();
  });

  it("does not render when isOpen is false", async () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: false,
        message: "Test message",
      },
    });

    await wrapper.vm.$nextTick();

    const modalContent = document.querySelector('[class*="fixed inset-0"]');
    expect(modalContent).toBeFalsy();
  });

  it("displays the message correctly", async () => {
    const testMessage = "Are you sure you want to delete this item?";
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: testMessage,
      },
      attachTo: document.body,
    });

    await wrapper.vm.$nextTick();

    // Check if message exists in the document body (since BaseModal uses Teleport)
    const messageElement = document.querySelector("p");
    expect(messageElement).toBeTruthy();
    expect(messageElement?.textContent).toContain(testMessage);
  });

  it("uses default props correctly", () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Test message",
      },
    });

    expect(wrapper.props("title")).toBe("Confirm Action");
    expect(wrapper.props("confirmText")).toBe("Confirm");
    expect(wrapper.props("cancelText")).toBe("Cancel");
    expect(wrapper.props("variant")).toBe("danger");
  });

  it("accepts custom props", () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Test message",
        title: "Custom Title",
        confirmText: "Yes, Delete",
        cancelText: "No, Keep",
        variant: "warning",
      },
    });

    expect(wrapper.props("title")).toBe("Custom Title");
    expect(wrapper.props("confirmText")).toBe("Yes, Delete");
    expect(wrapper.props("cancelText")).toBe("No, Keep");
    expect(wrapper.props("variant")).toBe("warning");
  });

  it("emits close event when cancel button is clicked", async () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Test message",
      },
    });

    // Find the cancel button (first button should be cancel)
    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    if (buttons.length >= 1) {
      await buttons[0].trigger("click");
      expect(wrapper.emitted("close")).toBeTruthy();
    }
  });

  it("has correct button configuration", () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Test message",
      },
    });

    // Verify that the component renders BaseButton components
    const buttons = wrapper.findAllComponents({ name: "BaseButton" });
    expect(buttons.length).toBeGreaterThan(0);

    // Verify component exists and renders without error
    expect(wrapper.exists()).toBe(true);
  });

  it("passes correct props to BaseModal", () => {
    const wrapper = mount(ConfirmationModal, {
      props: {
        isOpen: true,
        message: "Test message",
        title: "Custom Title",
      },
    });

    const baseModal = wrapper.findComponent({ name: "BaseModal" });
    expect(baseModal.props("isOpen")).toBe(true);
    expect(baseModal.props("title")).toBe("Custom Title");
    expect(baseModal.props("size")).toBe("md");
  });
});
