import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";
import { LEGAL_ENTITY, p, list, mail, table, contactBlock, renderLegalDoc } from "./common";

// The cookie table lists only what was measured on hbdr.com or quoted from Cloudflare's docs
// (docs/research/legal.md). A cookie the site starts to set must be added here in the same change.
export const MEASURED_COOKIES = [
  {
    name: "CF_AppSession",
    setBy: "Cloudflare Access",
    where: "Set when you open an admin address (such as /admin); for 24 hours your browser then sends it with every request to hbdr.com",
    purpose: "Security token that protects the staff sign-in",
    duration: "24 hours",
  },
  {
    name: "CF_Authorization",
    setBy: "Cloudflare Access",
    where: "Admin area only, after an HBDR staff member signs in",
    purpose: "Proves the staff member signed in and may open the admin area",
    duration: "The sign-in session: 24 hours",
  },
];

export function renderGdprCookiePolicyPage(): string {
  const sections = [
    {
      id: "summary", title: "Summary", testid: "gdpr-section-summary",
      body: list([
        "Public pages on hbdr.com set no cookies.",
        "The site uses no analytics, advertising or tracking cookies, and its own code stores nothing in your browser's local storage.",
        "Only the admin area, which is for HBDR staff, sets cookies. Cloudflare Access sets them to protect the sign-in.",
        "Because there is nothing to accept or refuse, the site shows no cookie banner.",
      ]),
    },
    {
      id: "cookie-policy", title: "Cookies on This Site", testid: "gdpr-section-cookies",
      body: `
        ${p(`A cookie is a small text file a website stores in your browser. We checked every public page of hbdr.com for the response header that sets a cookie, and did the same for a contact and a support form sent to a test copy of the site. None set one.`)}
        ${p(`The admin area sets the cookies in the table below. You will only see them if you open an admin address, and only HBDR staff can sign in.`)}`,
    },
    {
      id: "cookie-details", title: "Cookie Details", testid: "gdpr-section-cookie-table",
      body: `
        ${table({
          testid: "cookie-table",
          head: ["Cookie", "Set by", "Where", "Purpose", "Duration"],
          rows: MEASURED_COOKIES.map((c) => [c.name, c.setBy, c.where, c.purpose, c.duration]),
          mono: [0],
        })}
        <h3>Cloudflare security checks</h3>
        ${p(`Cloudflare's network sits in front of this site. If Cloudflare decides to challenge a request (for example, one that looks automated), it can set a cookie called <span class="mono">cf_clearance</span> to remember that the challenge was passed. We did not see this cookie on normal visits.`)}
        <h3>Turnstile bot check</h3>
        ${p(`HBDR can switch on Cloudflare Turnstile to keep bots off the contact and support forms. It is used only while it is switched on. Then the forms load a script from challenges.cloudflare.com. Cloudflare says Turnstile processes signals such as your IP address, TLS fingerprint and browser user agent to tell people from bots, and that it does not use them to identify, profile or target anyone.`)}`,
    },
    {
      id: "third-party-requests", title: "Files Loaded From Other Services", testid: "gdpr-section-third-party",
      body: `
        ${p(`Your browser downloads some files from other services when it shows a page. Each service receives your IP address and browser details with that request. We measured that none of them set a cookie.`)}
        ${table({
          testid: "third-party-table",
          head: ["Service", "Address", "What it serves", "Pages"],
          rows: [
            ["Google Fonts", "fonts.googleapis.com, fonts.gstatic.com", "The site's fonts (Archivo, Inter, Geist Mono)", "Every page"],
            ["jsDelivr", "cdn.jsdelivr.net", "Alpine.js, which runs forms, menus and calculators", "Every page"],
            ["cdnjs (Cloudflare)", "cdnjs.cloudflare.com", "GSAP, which animates the home page", "Home page"],
            ["Cloudflare Turnstile", "challenges.cloudflare.com", "The bot check", "Contact and support forms, only while switched on"],
          ],
        })}`,
    },
    {
      id: "how-to-manage-cookies", title: "How to Manage Cookies", testid: "gdpr-section-manage",
      body: `
        ${p(`You can see and delete cookies in your browser's settings. Blocking cookies does not change how the public pages work. Blocking them on the admin area stops the staff sign-in.`)}
        ${p(`The site does not act on Do Not Track or Global Privacy Control signals, because it does no tracking, selling or sharing for them to stop. See the <a href="/privacy-policy#us-state-privacy-rights" class="text-[var(--accent)] underline underline-offset-2">US state privacy section</a> of the Privacy Policy.`)}`,
    },
    {
      id: "gdpr", title: "GDPR", testid: "gdpr-section-compliance",
      body: `
        ${p(`This section is for visitors in the European Economic Area and the UK. ${LEGAL_ENTITY} is the controller of the personal information collected through this site.`)}
        <h3>Legal basis for each use</h3>
        ${table({
          testid: "gdpr-basis-table",
          head: ["Purpose", "Information", "Legal basis"],
          rows: [
            ["Reply to your enquiry and discuss working together", "Your contact form answers", "Steps you ask for before a contract (Art. 6(1)(b)), and our legitimate interest in answering business enquiries (Art. 6(1)(f))"],
            ["Answer your support request", "Your support form answers", "Our contract with you, if you are a customer (Art. 6(1)(b)); otherwise our legitimate interest in helping you (Art. 6(1)(f))"],
            ["Keep a record of business enquiries", "Form submissions, with no set deletion date", "Our legitimate interest in keeping business records (Art. 6(1)(f))"],
            ["Protect the forms from spam and abuse", "IP address, submission counts, the Turnstile check while it is on", "Our legitimate interest in keeping the site secure (Art. 6(1)(f))"],
            ["Run and secure the website", "Request logs, kept up to 7 days", "Our legitimate interest in running a secure website (Art. 6(1)(f))"],
          ],
        })}
        <h3>Your rights</h3>
        ${p(`Under the GDPR you can ask us to:`)}
        ${list([
          "Confirm whether we hold your personal data and give you a copy (access).",
          "Correct data that is wrong or incomplete (rectification).",
          "Delete your data (erasure).",
          "Limit how we use your data (restriction).",
          "Give you your data in a machine-readable format (portability).",
          "Stop using your data where we rely on legitimate interests (objection).",
        ])}
        ${p(`Each right has limits set by the GDPR. To make a request, email ${mail("link-gdpr-rights-email")}.`)}
        <h3>Complaints</h3>
        ${p(`You can complain to a data protection supervisory authority, in particular in the country where you live or work, or where you think the problem happened.`)}
        <h3>Transfers outside Europe</h3>
        ${p(`${LEGAL_ENTITY} is based in the United States. Information you send through this site is processed by HBDR and by the service providers listed in the <a href="/privacy-policy#information-sharing-and-disclosure" class="text-[var(--accent)] underline underline-offset-2">Privacy Policy</a> in the countries where they operate.`)}`,
    },
    {
      id: "contact", title: "Contact", testid: "gdpr-section-contact",
      body: `
        ${p(`Questions about cookies, this policy or your data:`)}
        ${contactBlock("link-gdpr-contact-email")}`,
    },
  ];

  const content = `
  ${renderPageHero("Legal", "GDPR & Cookie Policy", "The cookies hbdr.com actually sets, the services your browser contacts, and your rights under the GDPR.")}
  ${renderLegalDoc({
    testid: "gdpr-cookie-content",
    updatedTestid: "gdpr-last-updated",
    intro: `This policy lists the cookies hbdr.com sets and the other services your browser contacts when you visit. It also explains how the GDPR applies to the information you send us. Every cookie listed was either measured on the live site or is documented by Cloudflare.`,
    sections,
  })}`;

  return renderLayout({
    title: "GDPR & Cookie Policy - HBDR",
    description: "hbdr.com sets no cookies on public pages and runs no analytics or ad tracking. The cookies the admin sign-in uses, the services your browser contacts, and your GDPR rights.",
    canonicalPath: "/gdpr-cookie-policy",
    bodyContent: content,
  });
}
