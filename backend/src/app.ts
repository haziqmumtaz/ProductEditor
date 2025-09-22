import Koa from "koa";
import bodyParser from "koa-bodyparser";
import routers from "./http";
import cors from "@koa/cors";
import { requestLogger } from "./middlewares/logging";
import { errorHandler } from "./middlewares/errorHandler";

const app = new Koa();

app.use(requestLogger());
app.use(errorHandler());
app.use(bodyParser());
app.use(cors());

app.use(async (ctx, next) => {
  if (ctx.method === "GET" && ctx.path === `/api/health`) {
    ctx.status = 200;
    ctx.response.body = {
      message: "ok",
      timestamp: new Date().toISOString(),
    };
    return;
  }
  await next();
});

routers.forEach((router) => {
  app.use(router.routes());
  app.use(router.allowedMethods());
});

export default app;
