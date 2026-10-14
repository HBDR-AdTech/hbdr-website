import { describe, it, expect, vi } from "vitest";
import { sendContactNotification } from "../email";

const lead = {
  name: "Jane Doe",
  email: "jane@publisher.com",
  company: "Publisher Inc",
  impressions: "10m-50m",
  message: "Hello",
  source: "contact",
  ip: "203.0.113.7",
};

function mailer(send = vi.fn().mockResolvedValue({ messageId: "m1" })) {
  return { send } as unknown as SendEmail & { send: typeof send };
}

describe("sendContactNotification", () => {
  it("sends contact leads to contact@ with reply-to set to the submitter", async () => {
    const m = mailer();
    expect(await sendContactNotification(m, lead)).toBe(true);
    const msg = m.send.mock.calls[0][0];
    expect(msg).toMatchObject({ from: { name: "HBDR Website", email: "noreply@hbdr.com" }, to: "contact@hbdr.com", replyTo: "jane@publisher.com" });
    expect(msg.subject).toBe("New Lead: Jane Doe - Publisher Inc");
    expect(msg.html).toContain("10M - 50M");
  });

  it("lists the qualifying answers a contact lead gave", async () => {
    const m = mailer();
    await sendContactNotification(m, { ...lead, phone: "+1 305 555 0100", inventoryTypes: "Website, CTV / OTT", property: "pub.com", currentSetup: "Google Ad Manager", referral: null });
    const html = m.send.mock.calls[0][0].html;
    for (const text of ["+1 305 555 0100", "Website, CTV / OTT", "pub.com", "Google Ad Manager"]) expect(html).toContain(text);
    expect(html).not.toContain("Heard about us");
  });

  it("lists custom answers under their escaped labels and the bot check result", async () => {
    const m = mailer();
    const fields = [{ key: "custom_budget", type: "text" as const, label: "Budget <USD>", placeholder: "", required: false, visible: true, order: 150, locked: false, maxLength: 300, custom: true }];
    await sendContactNotification(m, { ...lead, customFields: JSON.stringify({ custom_budget: "10k &amp; up", custom_gone: "kept" }), botCheck: "unverified" }, fields);
    const html = m.send.mock.calls[0][0].html;
    expect(html).toMatch(/Budget &lt;USD&gt;<\/td><td[^>]*>10k &amp; up</);
    expect(html).toMatch(/custom_gone<\/td><td[^>]*>kept</);
    expect(html).toMatch(/Bot check<\/td><td[^>]*>unverified</);
  });

  it("routes support requests to support@ and parses subject/priority", async () => {
    const m = mailer();
    await sendContactNotification(m, { ...lead, source: "support", company: "Login broken [Priority: High]" });
    const msg = m.send.mock.calls[0][0];
    expect(msg.to).toBe("support@hbdr.com");
    expect(msg.subject).toBe("Support Request: Login broken — Jane Doe");
    expect(msg.html).toContain("High");
  });

  // The API stores text HTML-escaped once; escaping again showed "Pub&#x27;s" in the inbox
  it("shows stored text once-escaped in the body and plain in the subject", async () => {
    const m = mailer();
    await sendContactNotification(m, { ...lead, name: "Jane O&#x27;Brien", company: "Pub&#x27;s &amp; Co" });
    const msg = m.send.mock.calls[0][0];
    expect(msg.html).toContain("Jane O&#x27;Brien");
    expect(msg.html).not.toContain("&amp;#x27;");
    expect(msg.subject).toBe("New Lead: Jane O'Brien - Pub's & Co");
  });

  it("returns false instead of throwing when the binding rejects", async () => {
    const m = mailer(vi.fn().mockRejectedValue(new Error("E_SENDER_NOT_VERIFIED")));
    expect(await sendContactNotification(m, lead)).toBe(false);
  });
});
