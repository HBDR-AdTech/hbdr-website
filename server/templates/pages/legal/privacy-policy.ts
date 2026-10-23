import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";
import { renderSpecList } from "../../components/blueprint";
import { CONTACT_EMAIL } from "../../../config";
import { LEGAL_ENTITY, LEGAL_ADDRESS, p, list, link, mail, table, contactBlock, renderLegalDoc } from "./common";

// Every statement here is sourced in docs/research/legal.md (code line, measured header or quoted page)
export function renderPrivacyPolicyPage(): string {
  const sections = [
    {
      id: "who-we-are", title: "Who We Are", testid: "privacy-section-who",
      body: `
        ${p(`${LEGAL_ENTITY} ("HBDR", "we", "us") runs this website, hbdr.com. HBDR decides how the personal information collected through this site is used, so HBDR is responsible for it.`)}
        <div class="mb-6">${renderSpecList([
          { label: "Legal entity", value: LEGAL_ENTITY },
          { label: "Address", value: LEGAL_ADDRESS },
          { label: "Privacy questions", value: mail("link-privacy-email-who") },
        ])}</div>
        ${p(`This policy covers this website only. HBDR's services for publishers run under separate signed agreements, which have their own data terms.`)}`,
    },
    {
      id: "information-we-collect", title: "Information We Collect", testid: "privacy-section-collect",
      body: `
        <h3>What you send us</h3>
        ${p(`You send us information only when you fill in a form. The <a href="/contact" class="text-[var(--accent)] underline underline-offset-2">contact form</a> asks for:`)}
        ${list([
          "Your name, work email and company name (always required)",
          "Your monthly ad impressions (always required)",
          "Phone number and role (optional)",
          "Inventory type (website, mobile app, CTV / OTT), your domain, bundle ID or app URL, and your ads.txt or app-ads.txt URL",
          "App store URLs (optional, for apps and CTV)",
          "Your current monetization, top traffic region, timeline and how you heard about us (some optional)",
          "A message, if you write one",
          "Answers to any extra questions HBDR adds to the form later",
        ])}
        ${p(`HBDR can change which questions the form shows. The form you see is the current list.`)}
        ${p(`The <a href="/support" class="text-[var(--accent)] underline underline-offset-2">support form</a> asks for your name, email, a subject, a priority and a description of the problem.`)}
        <h3>What your browser sends</h3>
        ${p(`When you send a form, we record the IP address your request came from. We use it to stop spam and abuse, and we keep it with your submission.`)}
        ${p(`To limit spam, the site counts form submissions from each IP address (for IPv6, from each /64 network) over 15 minutes. More than 5 in that window are refused.`)}
        ${p(`Like any web server, the site's host records each request it handles (for example the page address, the time and the result) in short-lived logs. These logs can also hold your name and email address when a form notification is sent.`)}
        <h3>What we do not collect</h3>
        ${list([
          "No analytics: the site runs no analytics or session-recording tools.",
          "No advertising: the site has no ad tags, tracking pixels or advertising cookies.",
          "No accounts or payments: you cannot sign up or pay on this site.",
          `No cookies on public pages. See the <a href="/gdpr-cookie-policy" class="text-[var(--accent)] underline underline-offset-2">GDPR &amp; Cookie Policy</a> for the full list.`,
        ])}`,
    },
    {
      id: "how-we-use-your-information", title: "How We Use Your Information", testid: "privacy-section-use",
      body: `
        ${list([
          "To reply to your enquiry and talk with you about working together.",
          "To answer your support request.",
          "To decide whether your site or app fits HBDR's services (for example from your traffic, inventory type and current setup).",
          "To protect the forms from spam and abuse (IP address, submission counts and, when it is switched on, a bot check).",
          "To run, fix and secure the website (request logs).",
        ])}
        ${p(`We do not use your information for advertising, and we do not build profiles of visitors.`)}`,
    },
    {
      id: "information-sharing-and-disclosure", title: "Who Receives Your Information", testid: "privacy-section-sharing",
      body: `
        ${p(`We do not sell your personal information, and we do not share it for cross-context behavioral advertising. These service providers handle it for us:`)}
        ${table({
          testid: "privacy-processors-table",
          head: ["Provider", "What it does for this site", "What it receives"],
          rows: [
            ["Cloudflare", "Hosts the site (Workers), stores form submissions (D1), sends form notifications (Email Sending), keeps request logs, protects the admin area (Access), serves the animation library on the home page (cdnjs) and, when switched on, runs the Turnstile bot check", "Everything you send on a form, your IP address and browser details"],
            ["Google", `Hosts HBDR's mailboxes (${CONTACT_EMAIL} and support@hbdr.com), where form notifications arrive; serves the site's fonts (Google Fonts)`, "The form notification, which includes your answers and IP address; your IP address and browser details when your browser loads the fonts"],
            ["jsDelivr", "Serves the Alpine.js script the site uses for forms, menus and calculators", "Your IP address and browser details when your browser loads the script"],
          ],
        })}
        ${p(`Google Fonts, jsDelivr and cdnjs see your IP address because your browser downloads files from them. We measured that none of them set a cookie when they serve these files.`)}
        ${p(`We will disclose information if a law, court order or government request requires it.`)}`,
    },
    {
      id: "how-long-we-keep-it", title: "How Long We Keep It", testid: "privacy-section-retention",
      body: `
        ${table({
          testid: "privacy-retention-table",
          head: ["Information", "How long"],
          rows: [
            ["Form submissions, including your IP address, and HBDR's offline backup copies of them", "No set deletion date: HBDR keeps them as its record of business enquiries"],
            ["Spam-limit count for your IP address", "15 minutes, then removed the next time anyone sends a form"],
            ["Request logs at Cloudflare", "Up to 7 days"],
            ["Database restore history at Cloudflare (D1 Time Travel)", "30 days"],
          ],
        })}`,
    },
    {
      id: "data-security", title: "Data Security", testid: "privacy-section-security",
      body: `
        ${list([
          "The site is served only over HTTPS.",
          "Form submissions are read only by HBDR staff, in HBDR's mailboxes and in the admin area. The admin area sits behind Cloudflare Access, and the site checks each staff sign-in itself.",
          "The site can send form notifications only to HBDR's own mailboxes.",
          "Form input is checked and length-limited before it is stored.",
        ])}
        ${p(`No system is perfectly secure. If you think your information is at risk, email ${mail("link-privacy-email-security")}.`)}`,
    },
    {
      id: "your-rights-and-choices", title: "Your Rights", testid: "privacy-section-rights",
      body: `
        ${p(`Depending on where you live, the law may give you the right to ask for a copy of your information, to correct it, to delete it, to limit or object to how we use it, or to receive it in a portable format. These rights have limits set by each law.`)}
        ${p(`To make a request, email ${mail("link-privacy-email-rights")}. Visitors in the European Economic Area and the UK can read the legal bases we rely on and how to complain to a data protection authority in the <a href="/gdpr-cookie-policy#gdpr" class="text-[var(--accent)] underline underline-offset-2">GDPR section</a>.`)}`,
    },
    {
      id: "us-state-privacy-rights", title: "US State Privacy Rights", testid: "privacy-section-us-states",
      body: `
        ${p(`California's Consumer Privacy Act (CCPA, as amended by the CPRA) and similar laws in other US states give residents rights over their personal information. This section describes this website in those terms.`)}
        ${table({
          testid: "privacy-us-categories-table",
          head: ["Category", "What we collect", "Source"],
          rows: [
            ["Identifiers", "Name, email address, phone number (optional), IP address", "You, and your browser"],
            ["Professional information", "Company name, role (optional)", "You"],
            ["Business information you give us", "Domain or app, ads.txt URL, monthly impressions, current monetization, traffic region, timeline, how you heard about us, your message", "You"],
            ["Internet activity", "Request logs, kept up to 7 days", "Your browser"],
          ],
        })}
        ${p(`We use these categories only for the purposes listed above, and we disclose them only to the service providers listed above. We do not ask for sensitive personal information.`)}
        <h3>No sale or sharing</h3>
        ${p(`We do not sell personal information. We do not share it for cross-context behavioral advertising, and we do not use it for targeted advertising.`)}
        <h3>Global Privacy Control</h3>
        ${p(`Your browser may send a Global Privacy Control (GPC) signal, which asks a site not to sell or share your personal information. This site does not sell or share personal information and sets no advertising cookies, so there is nothing for the signal to switch off. The site works the same with or without it.`)}
        <h3>Your requests</h3>
        ${p(`Where these laws apply, you can ask to know what we hold about you, to get a copy, to correct it or to delete it. The law does not allow a business to treat you differently because you used these rights. Email ${mail("link-privacy-email-us")} to make a request.`)}`,
    },
    {
      id: "children-s-privacy", title: "Children", testid: "privacy-section-children",
      body: p(`This site is for publishers and other businesses. It is not directed to children, and the forms ask for business details.`),
    },
    {
      id: "changes-to-this-policy", title: "Changes to This Policy", testid: "privacy-section-changes",
      body: p(`When the way this site handles personal information changes, we update this page and its "Last updated" date.`),
    },
    {
      id: "contact-us", title: "Contact Us", testid: "privacy-section-contact",
      body: `
        ${p(`Questions about this policy or your information:`)}
        ${contactBlock("link-privacy-email")}`,
    },
  ];

  const content = `
  ${renderPageHero("Legal", "Privacy Policy", "What this website collects, why, who receives it and how long it is kept.")}
  ${renderLegalDoc({
    testid: "privacy-policy-content",
    updatedTestid: "privacy-last-updated",
    intro: `This policy describes what hbdr.com actually does with personal information. In short: we collect what you type into the contact and support forms, plus your IP address. We use it to reply to you and to stop spam. We set no cookies on public pages, run no analytics and show no ads.`,
    sections,
  })}`;

  return renderLayout({
    title: "Privacy Policy - HBDR",
    description: "What hbdr.com collects through its contact and support forms, why, who receives it, how long it is kept, and your rights under GDPR and US state privacy laws.",
    canonicalPath: "/privacy-policy",
    bodyContent: content,
  });
}
