import { Context } from "koa";
import Router from "koa-router";
import { ProductService } from "../service/products-service";
import { postProductSchema, putProductSchema } from "./schemas/products-schema";
import { paginationParamsSchema } from "../types/http";

const productService = new ProductService();

async function listProducts(ctx: Context) {
  const params = paginationParamsSchema.parse({
    page: ctx.query.page ? parseInt(ctx.query.page as string) : undefined,
    limit: ctx.query.limit ? parseInt(ctx.query.limit as string) : undefined,
  });

  const result = productService.getPaginatedProducts(params);
  ctx.response.body = result;
}

async function getProductById(ctx: Context) {
  ctx.response.body = productService.getProductById(parseInt(ctx.params.id));
}

async function createProduct(ctx: Context) {
  const payload = await postProductSchema.parseAsync(ctx.request.body);
  const newProduct = await productService.createProduct(payload);
  ctx.response.body = newProduct;
}

async function updateProduct(ctx: Context) {
  const payload = await putProductSchema.parseAsync(ctx.request.body);
  const updatedProduct = await productService.updateProduct(
    ctx.params.id,
    payload
  );
  ctx.response.body = updatedProduct;
}

async function deleteProduct(ctx: Context) {
  const deletedProduct = await productService.deleteProduct(
    parseInt(ctx.params.id)
  );
  ctx.response.body = deletedProduct;
}

const router = new Router({ prefix: "/api/products" });

router.get("/", listProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.patch("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
