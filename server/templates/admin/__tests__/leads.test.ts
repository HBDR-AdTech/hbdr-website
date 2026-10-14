import { describe, it, expect } from "vitest";
import { renderAdminLeadsPage } from "../leads";
import type { ContactLead } from "../../../services/storage";

// Stored text is HTML-escaped; the browser decodes &#x27; back to ' inside an attribute,
// so lead text must never be spliced into the Alpine @click expression
describe("admin leads page", () => {
  it("keeps lead text out of the message button's JS expression", () => {
    const name = "x&#x27;+alert(1)+&#x27;";
    const lead = {
      id: "1", name, email: "a@b.com", company: "C", impressions: "10m-50m", message: "hi&#x27;)",
      ip: null, source: "contact", status: "new", createdAt: new Date(),
      phone: null, inventoryTypes: null, property: null, appStoreUrls: null, adsTxtUrl: null,
      currentSetup: null, role: null, timeline: null, topGeo: null, referral: null, customFields: null, botCheck: null,
    } satisfies ContactLead;
    const html = renderAdminLeadsPage([lead]);
    const click = html.match(/@click="(\$dispatch\('show-message'[^"]*)"/)![1];
    expect(click).not.toContain("alert");
    expect(click).not.toContain("hi");
    expect(html).toContain(`data-name="${name}"`);
  });
});
