import { serveStatic } from "hono/bun";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

/**
 * Add any API routes here.
 */
app.get("/api/hello-zo", (c) => c.json({ msg: "Hello from Zo" }));

app.post("/api/contact", async (c) => {
  const body = await c.req.json().catch(() => null) as { name?: string; company?: string; email?: string; message?: string } | null;
  const name = body?.name?.trim();
  const company = body?.company?.trim();
  const email = body?.email?.trim();
  const message = body?.message?.trim();

  if (!name || !email || !message || !email.includes("@")) {
    return c.json({ error: "Please provide your name, a valid email and a project brief." }, 400);
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL || "marketing@alimurtaza.com";
  const sender = process.env.CONTACT_SENDER_EMAIL || "website@alimurtaza.com";

  if (!resendApiKey) {
    return c.json({ error: "Email delivery is not configured yet." }, 503);
  }

  const submittedAt = new Date().toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" });
  const safe = (value: string) => value.replace(/[&<>\"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[char] || char));
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px;color:#252525"><h2 style="margin-bottom:24px">New website enquiry</h2><p><strong>Name:</strong> ${safe(name)}</p><p><strong>Company:</strong> ${safe(company || "Not provided")}</p><p><strong>Email:</strong> ${safe(email)}</p><p><strong>Submitted:</strong> ${safe(submittedAt)} PKT</p><hr style="border:0;border-top:1px solid #ddd;margin:24px 0"><p style="white-space:pre-wrap;line-height:1.6">${safe(message)}</p></div>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: `AMA Website <${sender}>`, to: [recipient], reply_to: email, subject: `Website enquiry from ${name}${company ? ` — ${company}` : ""}`, html }),
  });

  if (!response.ok) {
    console.error("Contact email delivery failed:", response.status, await response.text());
    return c.json({ error: "We could not send your enquiry right now. Please email marketing@alimurtaza.com directly." }, 502);
  }

  return c.json({ sent: true });
});

if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

/**
 * Determine port based on mode. In production, use the published_port if available.
 * In development, always use the local_port.
 * Ports are managed by the system and injected via the PORT environment variable.
 */
const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

/**
 * Configure routing for production builds.
 *
 * - Streams prebuilt assets from `dist`.
 * - Static files from `public/` are copied to `dist/` by Vite and served at root paths.
 * - Falls back to `index.html` for any other GET so the SPA router can resolve the request.
 */
function configureProduction(app: Hono) {
  app.use("/assets/*", serveStatic({ root: "./dist" }));
  app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
  app.use(async (c, next) => {
    if (c.req.method !== "GET") return next();

    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/")) return next();

    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) {
        return new Response(file);
      }
    }

    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

/**
 * Configure routing for development builds.
 *
 * - Boots Vite in middleware mode for transforms.
 * - Static files from `public/` are served at root paths (matching Vite convention).
 * - Mirrors production routing semantics so SPA routes behave consistently.
 */
async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}
