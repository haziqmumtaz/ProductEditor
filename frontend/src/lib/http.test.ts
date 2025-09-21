import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiHttpClient } from "./http";

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

// Mock setTimeout and clearTimeout
vi.stubGlobal(
  "setTimeout",
  vi.fn((fn) => fn())
);
vi.stubGlobal("clearTimeout", vi.fn());

describe("apiHttpClient", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    vi.clearAllTimers();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("GET requests", () => {
    it("should make GET request with correct URL", async () => {
      const mockResponse = { data: "test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      await apiHttpClient.get("/api/test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({
          method: "GET",
          headers: expect.objectContaining({
            Accept: "application/json",
          }),
        })
      );
    });

    it("should handle query parameters", async () => {
      const mockResponse = { data: "test" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      await apiHttpClient.get("/api/test", {
        page: 1,
        limit: 10,
        search: "test",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("?page=1&limit=10&search=test"),
        expect.any(Object)
      );
    });

    it("should handle successful JSON response", async () => {
      const mockResponse = { id: 1, name: "Test Product" };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      const result = await apiHttpClient.get<{ id: number; name: string }>(
        "/api/products/1"
      );

      expect(result).toEqual(mockResponse);
    });

    it("should handle empty response", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(""),
      });

      const result = await apiHttpClient.get("/api/test");

      expect(result).toBeUndefined();
    });

    it("should handle HTTP error responses", async () => {
      const errorResponse = { error: "Not found" };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        text: () => Promise.resolve(JSON.stringify(errorResponse)),
      });

      await expect(apiHttpClient.get("/api/test")).rejects.toThrow("Not found");
    });

    it("should handle HTTP error without response body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        text: () => Promise.resolve(""),
      });

      await expect(apiHttpClient.get("/api/test")).rejects.toThrow(
        "500 Internal Server Error"
      );
    });
  });

  describe("POST requests", () => {
    it("should send JSON body", async () => {
      const mockResponse = { id: 1 };
      const requestBody = { name: "New Product", price: 100 };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      await apiHttpClient.post("/api/products", requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        })
      );
    });

    it("should handle POST without body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("{}"),
      });

      await apiHttpClient.post("/api/test");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.objectContaining({
          method: "POST",
          body: undefined,
        })
      );
    });
  });

  describe("PUT requests", () => {
    it("should send JSON body", async () => {
      const mockResponse = { id: 1, updated: true };
      const requestBody = { name: "Updated Product" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      await apiHttpClient.put("/api/products/1", requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/1"),
        expect.objectContaining({
          method: "PUT",
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe("PATCH requests", () => {
    it("should send JSON body", async () => {
      const mockResponse = { id: 1, patched: true };
      const requestBody = { name: "Patched Product" };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(mockResponse)),
      });

      await apiHttpClient.patch("/api/products/1", requestBody);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/1"),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify(requestBody),
        })
      );
    });
  });

  describe("DELETE requests", () => {
    it("should make DELETE request", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve(""),
      });

      await apiHttpClient.delete("/api/products/1");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/products/1"),
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });

  describe("toQuery function", () => {
    it("should handle undefined params", () => {
      // Test through GET request with undefined params
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("{}"),
      });

      apiHttpClient.get("/api/test", undefined);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/test"),
        expect.any(Object)
      );
    });

    it("should filter out undefined and null values", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("{}"),
      });

      await apiHttpClient.get("/api/test", {
        page: 1,
        limit: undefined,
        search: null,
        sort: "name",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("?page=1&sort=name"),
        expect.any(Object)
      );
    });
  });

  describe("error handling", () => {
    it("should handle network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      await expect(apiHttpClient.get("/api/test")).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle JSON parse errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("invalid json"),
      });

      await expect(apiHttpClient.get("/api/test")).rejects.toThrow();
    });
  });
});
