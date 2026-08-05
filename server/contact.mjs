import http from "node:http";
import { Resend } from "resend";

const PORT = Number(process.env.CONTACT_API_PORT || 8787);
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM =
  process.env.RESEND_FROM || "Kivoo <onboarding@resend.dev>";
const TO =
  process.env.CONTACT_TO ||
  process.env.VITE_CONTACT_EMAIL ||
  "hello@kivoo.org";
const ALLOWED_ORIGINS = (
  process.env.CONTACT_ALLOWED_ORIGINS ||
  "http://localhost:5173,http://127.0.0.1:5173,https://www.kivoo.org,https://kivoo.org"
)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

function corsHeaders(origin) {
  const allow =
    origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function sendJson(res, status, body, origin) {
  const payload = JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(payload),
    ...corsHeaders(origin),
  });
  res.end(payload);
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > 32_768) {
        reject(new Error("Payload too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || "";
  const url = new URL(
    req.url || "/",
    `http://${req.headers.host || "localhost"}`
  );

  if (req.method === "OPTIONS" && url.pathname === "/api/contact") {
    res.writeHead(204, corsHeaders(origin));
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/health") {
    sendJson(res, 200, { ok: true }, origin);
    return;
  }

  if (req.method !== "POST" || url.pathname !== "/api/contact") {
    sendJson(
      res,
      404,
      { success: false, error: { message: "Not found" } },
      origin
    );
    return;
  }

  if (!resend) {
    sendJson(
      res,
      500,
      {
        success: false,
        error: { message: "RESEND_API_KEY is not configured on the server." },
      },
      origin
    );
    return;
  }

  try {
    const raw = await readBody(req);
    const data = JSON.parse(raw || "{}");
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const message = String(data.message || "").trim();
    const website = String(data.website || "").trim();

    if (website) {
      sendJson(res, 200, { success: true }, origin);
      return;
    }

    if (!name || !email || !message) {
      sendJson(
        res,
        400,
        {
          success: false,
          error: { message: "Name, email, and message are required." },
        },
        origin
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      sendJson(
        res,
        400,
        { success: false, error: { message: "Please enter a valid email." } },
        origin
      );
      return;
    }

    const { error } = await resend.emails.send({
      from: FROM,
      to: [TO],
      replyTo: email,
      subject: `Kivoo contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
      `,
    });

    if (error) {
      sendJson(
        res,
        502,
        {
          success: false,
          error: {
            message:
              error.message ||
              "Could not send your message. Please try again.",
          },
        },
        origin
      );
      return;
    }

    sendJson(res, 200, { success: true }, origin);
  } catch (err) {
    const tooLarge =
      err instanceof Error && err.message === "Payload too large";
    sendJson(
      res,
      tooLarge ? 413 : 400,
      {
        success: false,
        error: {
          message: tooLarge
            ? "Message is too long."
            : "Could not send your message. Please try again.",
        },
      },
      origin
    );
  }
});

server.listen(PORT, () => {
  console.log(`Contact API listening on http://localhost:${PORT}`);
  if (!RESEND_API_KEY) {
    console.warn("Warning: RESEND_API_KEY is not set — submissions will fail.");
  }
});
