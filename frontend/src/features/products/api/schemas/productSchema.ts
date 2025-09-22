import { z } from "zod";

export const productSchema = z
  .object({
    id: z.number(),
    name: z.string().min(3, "Name must be at least 3 characters").max(120),
    gvtId: z.number().min(1, "GvtID must be present"),
    productTagline: z.string().min(1, "Product tagline must be present"),
    shortDescription: z
      .string()
      .min(1, "Short description must be present")
      .max(2000, "Short description must be less than 2000 characters"),
    longDescription: z
      .string()
      .min(1, "Long description must be present")
      .max(3000, "Long description must be less than 3000 characters"),
    logoLocation: z
      .string()
      .optional()
      .refine(
        (val) => !val || z.url().safeParse(val).success,
        "Must be a valid URL i.e https://example.com"
      ),
    productUrl: z.string().min(1, "Product URL must be present"),
    voucherTypeName: z.string().min(1, "Voucher type name must be present"),
    orderUrl: z
      .url()
      .min(1, "Order URL must be present")
      .refine(
        (val) => !val || z.url().safeParse(val).success,
        "Must be a valid URL i.e https://example.com"
      ),
    productTitle: z.string().min(1, "Product title must be present"),
    variableDenomPriceMinAmount: z.string().optional(),
    variableDenomPriceMaxAmount: z.string().optional(),
    __typename: z.literal("ProductInfo"),
  })
  .refine(
    (data) =>
      data.variableDenomPriceMinAmount == null ||
      data.variableDenomPriceMaxAmount == null ||
      data.variableDenomPriceMinAmount <= data.variableDenomPriceMaxAmount,
    {
      message: "Min amount must be <= max amount",
      path: ["variableDenomPriceMinAmount"],
    }
  );

export const createProductSchema = productSchema.omit({ id: true });

export const updateProductSchema = productSchema.partial();
