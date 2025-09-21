import fs from "fs";
import path from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readDataFromFile, writeDataToFile } from "./file-database";

// Mock fs module
vi.mock("fs", () => ({
  default: {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
  },
}));

// Mock path module
vi.mock("path", () => ({
  default: {
    join: vi.fn((...args) => args.join("/")),
  },
}));

describe("file-database", () => {
  const mockFs = vi.mocked(fs);
  const mockPath = vi.mocked(path);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("readDataFromFile", () => {
    it("should read and parse data from file successfully", () => {
      const mockData = {
        products: [
          { id: 1, name: "Test Product 1" },
          { id: 2, name: "Test Product 2" },
        ],
      };
      const mockFilePath = "data/products.json";
      const mockFileContent = JSON.stringify(mockData);

      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockPath.join.mockReturnValue(mockFilePath);

      const result = readDataFromFile("products.json");

      expect(mockPath.join).toHaveBeenCalled();
      expect(mockFs.readFileSync).toHaveBeenCalledWith(mockFilePath, "utf8");
      expect(result).toEqual(mockData.products);
    });

    it("should return empty array when products property is undefined", () => {
      const mockData = { products: undefined };
      const mockFilePath = "data/products.json";
      const mockFileContent = JSON.stringify(mockData);

      mockFs.readFileSync.mockReturnValue(mockFileContent);
      mockPath.join.mockReturnValue(mockFilePath);

      const result = readDataFromFile("products.json");

      expect(result).toEqual([]);
    });

    //   const mockData = { products: [{ id: 1, name: "Test" }] };
    //   const mockFilePath = "data/test.json";
    //   const mockFileContent = JSON.stringify(mockData);

    //   mockFs.readFileSync.mockReturnValue(mockFileContent);
    //   mockPath.join.mockReturnValue(mockFilePath);

    //   const result = readDataFromFile("test.json");

    //   expect(mockPath.join).toHaveBeenCalled();
    //   expect(result).toEqual(mockData.products);
    // });
  });

  describe("writeDataToFile", () => {
    it("should write data to file successfully", async () => {
      const mockData = [
        { id: 1, name: "Test Product 1" },
        { id: 2, name: "Test Product 2" },
      ];
      const mockFilePath = "data/products.json";
      const expectedFileContent = JSON.stringify(
        { products: mockData },
        null,
        2
      );

      mockPath.join.mockReturnValue(mockFilePath);
      mockFs.writeFileSync.mockImplementation(() => {});

      await writeDataToFile("products.json", mockData);

      expect(mockPath.join).toHaveBeenCalled();
      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        mockFilePath,
        expectedFileContent,
        "utf8"
      );
    });
  });

  //     // it("should handle read-then-write workflow", async () => {
  //     //   const originalData = { products: [{ id: 1, name: "Original" }] };
  //     //   const updatedData = [{ id: 1, name: "Updated" }];
  //     //   const mockFilePath = "data/products.json";

  //     //   // Mock read operation
  //     //   mockFs.readFileSync.mockReturnValue(JSON.stringify(originalData));
  //     //   mockPath.join.mockReturnValue(mockFilePath);

  //     //   const readResult = readDataFromFile("products.json");
  //     //   expect(readResult).toEqual(originalData.products);

  //     //   // Mock write operation
  //     //   mockFs.writeFileSync.mockImplementation(() => {});

  //     //   await writeDataToFile("products.json", updatedData);

  //     //   expect(mockFs.writeFileSync).toHaveBeenCalledWith(
  //     //     mockFilePath,
  //     //     JSON.stringify({ products: updatedData }, null, 2),
  //     //     "utf8"
  //     //   );
  //     // });

  //     it("should handle multiple file operations", async () => {
  //       const mockData1 = [{ id: 1, name: "Product 1" }];
  //       const mockData2 = [{ id: 2, name: "Product 2" }];

  //       mockPath.join.mockReturnValue("data/file1.json");
  //       mockFs.writeFileSync.mockImplementation(() => {});

  //       await writeDataToFile("file1.json", mockData1);
  //       await writeDataToFile("file2.json", mockData2);

  //       expect(mockFs.writeFileSync).toHaveBeenCalledTimes(2);
  //       expect(mockPath.join).toHaveBeenCalledTimes(2);
  //     });
  //   });
});
