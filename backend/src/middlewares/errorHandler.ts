import { Middleware } from "koa";
import { ZodError } from "zod";

export function errorHandler(): Middleware {
  return async (ctx, next) => {
    try {
      await next();
      const response = await ctx.response.body;
      if (response && "status" in response) {
        ctx.status = response.status;
        ctx.body = { error: response.error };
      }
    } catch (error) {
      if (error instanceof ZodError) {
        ctx.status = 400;
        ctx.body = {
          error: "Validation failed",
          details: JSON.parse(error.message),
        };
      } else {
        ctx.status = 500;
        console.log(error);
        ctx.body = { error: "Internal server error" };
      }
    }
  };
}
