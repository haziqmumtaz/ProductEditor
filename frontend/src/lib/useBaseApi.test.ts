import { beforeEach, describe, expect, it, vi } from "vitest";
import { useBaseApi } from "./useBaseApi";

describe("useBaseApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const { response, loading, error } = useBaseApi();

    expect(response.value).toEqual({});
    expect(loading.value).toBe(false);
    expect(error.value).toBe("");
  });

  it("should initialize with custom default error message", () => {
    const { response, loading, error } = useBaseApi({
      defaultErrorMessage: "Custom error message",
    });

    expect(response.value).toEqual({});
    expect(loading.value).toBe(false);
    expect(error.value).toBe("");
  });

  it("should set loading to true during API call", async () => {
    const mockResponse = { id: 1, name: "Test" };
    const mockApiCall = vi.fn().mockResolvedValue(mockResponse);

    const { loading, executeApiCall } = useBaseApi();

    const executePromise = executeApiCall(mockApiCall);
    expect(loading.value).toBe(true);

    await executePromise;
    expect(loading.value).toBe(false);
  });

  it("should update response data on success", async () => {
    const mockResponse = { id: 1, name: "Test Product" };
    const mockApiCall = vi.fn().mockResolvedValue(mockResponse);

    const { response, executeApiCall } = useBaseApi();
    const result = await executeApiCall(mockApiCall);

    expect(response.value).toEqual(mockResponse);
    expect(result).toEqual(mockResponse);
  });

  it("should handle API errors with Error instance", async () => {
    const errorMessage = "API Error";
    const mockApiCall = vi.fn().mockRejectedValue(new Error(errorMessage));

    const { error, executeApiCall } = useBaseApi();

    await expect(executeApiCall(mockApiCall)).rejects.toThrow(errorMessage);
    expect(error.value).toBe(errorMessage);
  });

  it("should handle API errors without Error instance", async () => {
    const mockApiCall = vi.fn().mockRejectedValue("String error");

    const { error, executeApiCall } = useBaseApi();

    await expect(executeApiCall(mockApiCall)).rejects.toThrow();
    expect(error.value).toBe("An error occurred");
  });

  it("should use custom error message", async () => {
    const mockApiCall = vi.fn().mockRejectedValue("String error");

    const { error, executeApiCall } = useBaseApi({
      defaultErrorMessage: "Custom error occurred",
    });

    await expect(executeApiCall(mockApiCall)).rejects.toThrow();
    expect(error.value).toBe("Custom error occurred");
  });

  it("should use custom error message from executeApiCall", async () => {
    const mockApiCall = vi.fn().mockRejectedValue("String error");

    const { error, executeApiCall } = useBaseApi();

    await expect(
      executeApiCall(mockApiCall, "Specific error message")
    ).rejects.toThrow();
    expect(error.value).toBe("Specific error message");
  });

  it("should clear error on new successful request", async () => {
    const { error, executeApiCall } = useBaseApi();

    // First call fails
    const failCall = vi.fn().mockRejectedValue(new Error("Network error"));
    await expect(executeApiCall(failCall)).rejects.toThrow();
    expect(error.value).toBe("Network error");

    // Second call succeeds
    const successCall = vi.fn().mockResolvedValue({ success: true });
    await executeApiCall(successCall);
    expect(error.value).toBe("");
  });

  it("should update response on new successful request", async () => {
    const { response, executeApiCall } = useBaseApi();

    // First successful call
    const firstCall = vi.fn().mockResolvedValue({ id: 1, name: "First" });
    await executeApiCall(firstCall);
    expect(response.value).toEqual({ id: 1, name: "First" });

    // Second successful call
    const secondCall = vi.fn().mockResolvedValue({ id: 2, name: "Second" });
    await executeApiCall(secondCall);
    expect(response.value).toEqual({ id: 2, name: "Second" });
  });

  it("should handle concurrent API calls", async () => {
    const { loading, executeApiCall } = useBaseApi();

    // Mock with delays
    const call1 = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100))
      );
    const call2 = vi
      .fn()
      .mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ id: 2 }), 100))
      );

    // Start both calls
    const promise1 = executeApiCall(call1);
    const promise2 = executeApiCall(call2);

    expect(loading.value).toBe(true);

    await Promise.all([promise1, promise2]);
    expect(loading.value).toBe(false);
  });

  it("should work with typed generics", async () => {
    interface CustomType {
      id: number;
      customField: string;
    }

    const mockResponse: CustomType = { id: 1, customField: "test" };
    const mockApiCall = vi.fn().mockResolvedValue(mockResponse);

    const { response, executeApiCall } = useBaseApi<CustomType>();
    const result = await executeApiCall(mockApiCall);

    expect(response.value).toEqual(mockResponse);
    expect(result).toEqual(mockResponse);
    expect(result.id).toBe(1);
    expect(result.customField).toBe("test");
  });
});
