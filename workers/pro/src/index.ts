import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { authRouter } from "./auth.js";
import { creditsRouter } from "./credits.js";
import { trendsRouter } from "./trends.js";
import { seoRouter } from "./seo.js";
import { keywordsRouter } from "./keywords.js";
import { domainsRouter } from "./domains.js";
import { appsRouter } from "./apps.js";
import { researchRouter } from "./research.js";
import { chatRouter } from "./chat.js";
import { authMiddleware, type AuthVariables } from "./middleware/auth.js";

const app = new Hono<{ Variables: AuthVariables }>();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);

app.get("/health", (c) =>
  c.json({ status: "ok", timestamp: new Date().toISOString() }),
);

app.route("/auth", authRouter);
app.route("/api/auth", authRouter);
app.use("/api/*", authMiddleware);
app.route("/api/credits", creditsRouter);
app.route("/api/trends", trendsRouter);
app.route("/api/seo", seoRouter);
app.route("/api/keywords", keywordsRouter);
app.route("/api/domains", domainsRouter);
app.route("/api/apps", appsRouter);
app.route("/api/research", researchRouter);
app.route("/api/chat", chatRouter);

app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
