// Lead/support notifications via the Cloudflare Email Sending binding (see wrangler.toml [[send_email]])

import { sanitizeText, unescapeText } from "../middleware/sanitize";
import { EMAIL_FROM, CONTACT_NOTIFY_EMAIL, SUPPORT_NOTIFY_EMAIL } from "../config";
import type { LeadDetails } from "./storage";
import { customAnswers, type FormField } from "./form-config";

// The stored lead: every text field except email and ip is already HTML-escaped at the API boundary
// (routes/api.ts), so it goes into the HTML as is; escaping again shows &amp;#x27; for an apostrophe
interface ContactNotificationData extends Partial<LeadDetails> {
  name: string;
  email: string;
  company: string;
  impressions: string;
  message: string | null;
  source: string | null;
  ip: string | null;
}

const detailLabels: [keyof LeadDetails, string][] = [
  ["phone", "Phone"], ["role", "Role"], ["inventoryTypes", "Inventory"], ["property", "Domain / bundle ID"],
  ["appStoreUrls", "App store URLs"], ["adsTxtUrl", "ads.txt URL"], ["currentSetup", "Current setup"],
  ["topGeo", "Top geo"], ["timeline", "Timeline"], ["referral", "Heard about us"],
];

const impressionLabels: Record<string, string> = {
  "under-10m": "Under 10M",
  "10m-50m": "10M - 50M",
  "50m-100m": "50M - 100M",
  "100m-500m": "100M - 500M",
  "500m-1b": "500M - 1B",
  "over-1b": "Over 1B",
};

function parseSupportCompany(company: string): { subject: string; priority: string } {
  const match = company.match(/^(.+?)\s*\[Priority:\s*(.+?)\]$/);
  if (match) return { subject: match[1].trim(), priority: match[2].trim() };
  return { subject: company, priority: "Medium" };
}

function buildDetailRows(data: ContactNotificationData, fields: FormField[]): string {
  const safeName = data.name;
  const safeEmail = sanitizeText(data.email);
  const safeIp = data.ip ? sanitizeText(data.ip) : null;

  const row = (label: string, value: string, isEmail = false) =>
    `<tr><td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; color: #333; width: 140px;">${label}</td><td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #555;">${isEmail ? `<a href="mailto:${value}" style="color: #00FAA8;">${value}</a>` : value}</td></tr>`;

  let rows = row("Name", safeName) + row("Email", safeEmail, true);

  if (data.source === "support") {
    const { subject, priority } = parseSupportCompany(data.company);
    rows += row("Subject", subject);
    rows += row("Priority", priority);
  } else {
    rows += row("Company", data.company);
    const impressionDisplay = impressionLabels[data.impressions] || data.impressions;
    rows += row("Impressions", impressionDisplay);
    for (const [key, label] of detailLabels) {
      const value = data[key];
      if (value) rows += row(label, value.replace(/\n/g, "<br>"));
    }
    // labels are operator text, escaped here; the answers were escaped at the API boundary
    for (const [label, value] of customAnswers(data.customFields ?? null, fields)) {
      rows += row(sanitizeText(label), value.replace(/\n/g, "<br>"));
    }
  }

  if (data.botCheck) rows += row("Bot check", data.botCheck);

  if (safeIp) {
    rows += `<tr><td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-weight: 600; color: #333;">IP Address</td><td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; color: #999; font-size: 13px;">${safeIp}</td></tr>`;
  }

  return rows;
}

export async function sendContactNotification(
  mailer: SendEmail,
  data: ContactNotificationData,
  fields: FormField[] = []
): Promise<boolean> {
  try {
    const isSupport = data.source === "support";
    const sourceLabel = isSupport ? "Support Request" : "Contact Form";
    const safeMessage = data.message;

    const htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #15181f; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
          <h1 style="color: #00FAA8; margin: 0 0 5px 0; font-size: 24px;">${isSupport ? "New Support Request" : "New Lead from HBDR.com"}</h1>
          <p style="color: rgba(255,255,255,0.5); margin: 0; font-size: 14px;">${sourceLabel}</p>
        </div>
        <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 20px;">
          <table style="width: 100%; border-collapse: collapse;">
            ${buildDetailRows(data, fields)}
          </table>
        </div>
        ${safeMessage ? `<div style="background: #f8f9fa; border-radius: 12px; padding: 24px;"><h3 style="margin: 0 0 10px 0; color: #333; font-size: 16px;">${isSupport ? "Description" : "Message"}</h3><p style="margin: 0; color: #555; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p></div>` : ""}
        <div style="text-align: center; margin-top: 20px; padding: 15px;"><p style="color: #999; font-size: 12px; margin: 0;">This notification was sent from HBDR.com</p></div>
      </div>`;

    // the subject is a plain-text header: show the real characters, drop line breaks
    const plain = (text: string) => unescapeText(text).replace(/[\r\n]/g, "");
    const safeSubjectName = plain(data.name);
    let emailSubject: string;
    if (isSupport) {
      const { subject } = parseSupportCompany(data.company);
      emailSubject = `Support Request: ${plain(subject)} — ${safeSubjectName}`;
    } else {
      const safeSubjectCompany = plain(data.company);
      emailSubject = `New Lead: ${safeSubjectName} - ${safeSubjectCompany}`;
    }

    const toAddress = isSupport ? SUPPORT_NOTIFY_EMAIL : CONTACT_NOTIFY_EMAIL;

    // local wrangler dev simulates the binding and returns undefined
    const result = await mailer.send({
      from: EMAIL_FROM,
      to: toAddress,
      replyTo: data.email,
      subject: emailSubject,
      html: htmlContent,
    });

    console.log(`Email sent ${result?.messageId ?? "(simulated)"}: ${sourceLabel} from ${safeSubjectName} (${sanitizeText(data.email)}) → ${toAddress}`);
    return true;
  } catch (error) {
    console.error(`Failed to send email notification (from ${EMAIL_FROM.email}):`, error);
    return false;
  }
}
