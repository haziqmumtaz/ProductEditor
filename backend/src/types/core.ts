import z from "zod";
import { putProductSchema } from "../http/schemas/products-schema";

export type Product = z.infer<typeof putProductSchema>;
