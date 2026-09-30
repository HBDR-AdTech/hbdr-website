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
    expect(msg).toMatchObject({ from: "HBDR Website <noreply@hbdr.com>", to: "contact@hbdr.com", replyTo: "jane@publisher.com" });
    expect(msg.subject).toBe("New Lead: Jane Doe - Publisher Inc");
    expect(msg.html).toContain("10M - 50M");
  });

  it("routes support requests to support@ and parses subject/priority", async () => {
    const m = mailer();
    await sendContactNotification(m, { ...lead, source: "support", company: "Login broken [Priority: High]" });
    const msg = m.send.mock.calls[0][0];
    expect(msg.to).toBe("support@hbdr.com");
    expect(msg.subject).toBe("Support Request: Login broken — Jane Doe");
    expect(msg.html).toContain("High");
  });

  it("escapes submitter HTML in the email body", async () => {
    const m = mailer();
    await sendContactNotification(m, { ...lead, message: "<script>alert(1)</script>" });
    expect(m.send.mock.calls[0][0].html).not.toContain("<script>");
  });

  it("returns false instead of throwing when the binding rejects", async () => {
    const m = mailer(vi.fn().mockRejectedValue(new Error("E_SENDER_NOT_VERIFIED")));
    expect(await sendContactNotification(m, lead)).toBe(false);
  });
});
