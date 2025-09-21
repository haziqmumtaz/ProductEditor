import { Context } from "koa";
import Router from "koa-router";
import { ProductService } from "../service/products-service";
import { postProductSchema, putProductSchema } from "./schemas/products-schema";
import { paginationParamsSchema, idParamSchema } from "../types/http";

const getProductService = () => new ProductService();

async function listProducts(ctx: Context) {
  const params = paginationParamsSchema.parse(ctx.query);
  const result = getProductService().getProductsWithOptions(params);
  ctx.response.body = result;
}

async function getProductById(ctx: Context) {
  const id = idParamSchema.parse(ctx.params.id);
  ctx.response.body = getProductService().getProductById(id);
}

async function createProduct(ctx: Context) {
  const payload = await postProductSchema.parseAsync(ctx.request.body);
  const newProduct = await getProductService().createProduct(payload);
  ctx.response.body = newProduct;
}

async function updateProduct(ctx: Context) {
  const payload = await putProductSchema.parseAsync(ctx.request.body);
  const id = idParamSchema.parse(ctx.params.id);
  const updatedProduct = await getProductService().updateProduct(id, payload);
  ctx.response.body = updatedProduct;
}

async function deleteProduct(ctx: Context) {
  const id = idParamSchema.parse(ctx.params.id);
  const deletedProduct = await getProductService().deleteProduct(id);
  ctx.response.body = deletedProduct;
}

const productsRouter = new Router({ prefix: "/api/products" });

productsRouter.get("/", listProducts);
productsRouter.get("/:id", getProductById);
productsRouter.post("/", createProduct);
productsRouter.patch("/:id", updateProduct);
productsRouter.delete("/:id", deleteProduct);

export default productsRouter;
