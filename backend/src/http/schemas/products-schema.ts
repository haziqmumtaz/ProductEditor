import { z } from "zod";

export const putProductSchema = z
  .object({
    id: z.number(),
    name: z.string().min(1).max(120),
    gvtId: z.number().min(1),
    productTagline: z.string(),
    shortDescription: z.string(),
    longDescription: z.string(),
    logoLocation: z.string().optional(),
    productUrl: z.string(),
    voucherTypeName: z.string(),
    orderUrl: z.url(),
    productTitle: z.string(),
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

export const postProductSchema = putProductSchema.omit({
  id: true,
});
