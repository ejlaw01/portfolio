import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const TO = "ethan@bitlore.io";
const FROM = "Bit Lore Manufacturing <noreply@bitlore.io>";

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }
    if (!process.env.RESEND_API_KEY) {
        console.error("Missing RESEND_API_KEY env var");
        return res.status(500).json({ error: "Server is not configured to send mail." });
    }

    const body = req.body ?? {};
    const { name, company, email, message, _hp } = body as Record<string, unknown>;

    // Honeypot — bots fill hidden field; silently accept and drop.
    if (typeof _hp === "string" && _hp.trim() !== "") {
        return res.status(200).json({ ok: true });
    }

    const safe = (v: unknown, max: number) =>
        typeof v === "string" ? v.trim().slice(0, max) : "";

    const safeName = safe(name, 200);
    const safeCompany = safe(company, 200);
    const safeEmail = safe(email, 200);
    const safeMessage = safe(message, 5000);

    if (!safeName) return res.status(400).json({ error: "Name is required." });
    if (!safeEmail || !isEmail(safeEmail)) return res.status(400).json({ error: "A valid email is required." });
    if (!safeMessage) return res.status(400).json({ error: "Message is required." });

    try {
        await resend.emails.send({
            from: FROM,
            to: TO,
            replyTo: safeEmail,
            subject: `Manufacturing inquiry — ${safeName}${safeCompany ? ` (${safeCompany})` : ""}`,
            text: [
                `Name: ${safeName}`,
                `Company: ${safeCompany || "(not provided)"}`,
                `Email: ${safeEmail}`,
                "",
                "Message:",
                safeMessage,
            ].join("\n"),
        });
        return res.status(200).json({ ok: true });
    } catch (err) {
        console.error("Resend send failed:", err);
        return res.status(502).json({ error: "Failed to send. Please email directly at ethan@bitlore.io." });
    }
}
