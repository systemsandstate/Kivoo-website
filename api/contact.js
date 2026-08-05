import { Resend } from "resend";

const FROM = process.env.RESEND_FROM || "Kivoo <onboarding@resend.dev>";
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

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  Object.entries(corsHeaders(origin)).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({
      success: false,
      error: { message: "Method not allowed" },
    });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      success: false,
      error: { message: "RESEND_API_KEY is not configured on the server." },
    });
    return;
  }

  try {
    const data = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const name = String(data.name || "").trim();
    const email = String(data.email || "").trim();
    const message = String(data.message || "").trim();
    const website = String(data.website || "").trim();

    if (website) {
      res.status(200).json({ success: true });
      return;
    }

    if (!name || !email || !message) {
      res.status(400).json({
        success: false,
        error: { message: "Name, email, and message are required." },
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({
        success: false,
        error: { message: "Please enter a valid email." },
      });
      return;
    }

    if (message.length > 8000 || name.length > 200 || email.length > 320) {
      res.status(413).json({
        success: false,
        error: { message: "Message is too long." },
      });
      return;
    }

    const resend = new Resend(apiKey);
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
      res.status(502).json({
        success: false,
        error: {
          message:
            error.message || "Could not send your message. Please try again.",
        },
      });
      return;
    }

    res.status(200).json({ success: true });
  } catch {
    res.status(400).json({
      success: false,
      error: { message: "Could not send your message. Please try again." },
    });
  }
}
