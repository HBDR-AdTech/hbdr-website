import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderContactFormSection } from "../components/contact-form";
import type { FormConfig } from "../../services/form-config";

export function renderContactPage(form: FormConfig): string {
  const content = `
  ${renderPageHero("Contact", "Get In Touch", "Tell us about your site and how you sell ads today. Include your monthly pageviews, your ad server (Google Ad Manager or AdSense) and a link to your ads.txt file so the first reply can be specific.")}

  ${renderContactFormSection(form)}`;

  return renderLayout({
    title: "Contact Us - HBDR",
    description: "Contact HBDR to learn how our header bidding and ad monetization solutions can maximize your publisher revenue.",
    canonicalPath: "/contact",
    bodyContent: content,
  });
}

