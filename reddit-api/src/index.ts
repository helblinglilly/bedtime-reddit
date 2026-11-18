import { fromHono } from "chanfana";
import { Hono } from "hono";
import { VideoList } from "./endpoints/taskList";

const app = new Hono<{ Bindings: Env }>();

const openapi = fromHono(app, {
  docs_url: "/",
});

openapi.get("/videos", VideoList);

export default app;
