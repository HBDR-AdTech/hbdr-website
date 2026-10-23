import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";
import { LEGAL_ENTITY, p, list, contactBlock, renderLegalDoc } from "./common";

// Terms of use for the website only; publisher commercial terms live in signed agreements (D-029)
export function renderTermsPage(): string {
  const sections = [
    {
      id: "acceptance-of-terms", title: "About These Terms", testid: "terms-section-acceptance",
      body: `
        ${p(`${LEGAL_ENTITY} ("HBDR", "we", "us") runs hbdr.com. These terms cover your use of this website. By using the site you agree to them. If you do not agree, please do not use the site.`)}
        ${p(`Our <a href="/privacy-policy" class="text-[var(--accent)] underline underline-offset-2">Privacy Policy</a> explains what happens to information you send us.`)}`,
    },
    {
      id: "services-description", title: "This Site and HBDR's Services", testid: "terms-section-services",
      body: `
        ${p(`This site describes HBDR's header bidding and ad monetization services for publishers of websites, mobile apps and CTV / OTT channels.`)}
        ${p(`HBDR provides those services only under a separate signed agreement with each publisher. That agreement sets the revenue share, payment terms and every other commercial term. If it conflicts with these terms, the agreement wins.`)}
        ${p(`Nothing on this site is an offer, a contract or a promise of results. HBDR does not guarantee revenue.`)}`,
    },
    {
      id: "calculators-and-examples", title: "Calculators and Examples", testid: "terms-section-calculators",
      body: `
        ${p(`The free <a href="/tools" class="text-[var(--accent)] underline underline-offset-2">publisher calculators</a> give estimates from simple, illustrative models and the numbers you enter. The auction and timeout demos on this site use labelled example data.`)}
        ${p(`These estimates and examples are not quotes, forecasts or promises of what you will earn. Your results depend on your traffic, your audience, the market and many other things. Do not rely on them alone to make business decisions.`)}`,
    },
    {
      id: "intellectual-property", title: "Content and Trademarks", testid: "terms-section-ip",
      body: `
        ${p(`The text, design, graphics and HBDR name and logo on this site belong to ${LEGAL_ENTITY} or to those who license them to us.`)}
        ${p(`You may read the site, link to it and share its pages. You may not copy, republish or sell its content as your own without our written permission.`)}
        ${p(`Other companies' names and logos on this site belong to their owners. They appear to identify the platforms and partners HBDR works with.`)}`,
    },
    {
      id: "acceptable-use", title: "Acceptable Use", testid: "terms-section-acceptable-use",
      body: `
        ${p(`When you use this site, do not:`)}
        ${list([
          "Try to get into the admin area or any part of the site you are not authorized to use.",
          "Attack, overload or probe the site, or try to get around its security or spam limits.",
          "Send automated, bulk or spam form submissions.",
          "Send false information or information about another person without their permission.",
          "Use the site for anything unlawful.",
        ])}`,
    },
    {
      id: "information-and-links", title: "Blog, Information and Links", testid: "terms-section-links",
      body: `
        ${p(`The blog and other pages give general information about ad technology. They are not legal, financial or tax advice.`)}
        ${p(`The site links to other websites, such as industry standards and vendor documentation. We do not control those sites and are not responsible for them.`)}`,
    },
    {
      id: "no-warranty", title: "No Warranty", testid: "terms-section-warranty",
      body: p(`We work to keep this site accurate and available, but we provide it "as is" and "as available". To the fullest extent the law allows, we make no warranties about the site, its content or the calculators, express or implied, including warranties of accuracy, fitness for a particular purpose and non-infringement.`),
    },
    {
      id: "limitation-of-liability", title: "Limitation of Liability", testid: "terms-section-liability",
      body: p(`To the fullest extent the law allows, ${LEGAL_ENTITY} is not liable for any indirect, incidental, special, consequential or punitive damages, or for any lost revenue, profit or data, that come from your use of this website or your reliance on its content or calculators. Some places do not allow these limits, so they may not all apply to you.`),
    },
    {
      id: "governing-law", title: "Governing Law", testid: "terms-section-governing-law",
      body: `
        ${p(`These terms are governed by the laws of the State of Florida, United States, without regard to its conflict of law rules.`)}
        ${p(`Any dispute about these terms or this website will be decided only in the state or federal courts in Miami-Dade County, Florida. You agree to the jurisdiction of those courts.`)}`,
    },
    {
      id: "changes-to-terms", title: "Changes to These Terms", testid: "terms-section-changes",
      body: p(`We may change these terms or the site. When we change the terms, we update this page and its "Last updated" date. The terms in force when you use the site apply to that use.`),
    },
    {
      id: "contact-information", title: "Contact", testid: "terms-section-contact",
      body: `
        ${p(`Questions about these terms:`)}
        ${contactBlock("link-terms-email")}`,
    },
  ];

  const content = `
  ${renderPageHero("Legal", "Terms & Conditions", "The terms for using hbdr.com. Publisher services run under separate signed agreements.")}
  ${renderLegalDoc({
    testid: "terms-content",
    updatedTestid: "terms-last-updated",
    intro: `These terms cover the hbdr.com website: its pages, blog and free calculators. They do not cover HBDR's publisher services, which run under a separate signed agreement.`,
    sections,
  })}`;

  return renderLayout({
    title: "Terms & Conditions - HBDR",
    description: "The terms for using hbdr.com, its blog and free publisher calculators. HBDR's publisher services run under separate signed agreements.",
    canonicalPath: "/terms",
    bodyContent: content,
  });
}
