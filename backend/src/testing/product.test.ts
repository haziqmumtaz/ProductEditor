import { describe, it, expect } from "vitest";
import { postProductSchema } from "../http/schemas/products-schema";

describe("productSchemaTest", () => {
  it("valid product passes", () => {
    const p = {
      id: "1",
      name: "Test",
      tagline: "https://x.com",
      image: "https://x.com/img.png",
      price: 10,
      description: "ok",
    };
    expect(() => postProductSchema.parse(p)).not.toThrow();
  });

  it("invalid product fails", () => {
    const bad = { id: "", name: "", tagline: "notalink" };
    expect(() => postProductSchema.parse(bad)).toThrow();
  });
});
