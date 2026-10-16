import { renderLayout } from "../../layout";
import { renderPageHero } from "../../components/hero";

export function renderGdprCookiePolicyPage(): string {
  const content = `
  ${renderPageHero("Legal", "GDPR & Cookie Policy", "Our commitment to data protection, GDPR compliance, and transparent cookie usage across our platform.")}

  <section class="bp-section legal" data-testid="gdpr-cookie-content">
    <div class="bp-wrap bp-grid12">
      <nav class="legal-toc" aria-label="On this page">
        <span class="bp-eyebrow">Contents</span>
        <ol>
          <li><a href="#gdpr-compliance"><span class="mono">01</span>GDPR Compliance</a></li>
          <li><a href="#cookie-policy"><span class="mono">02</span>Cookie Policy</a></li>
          <li><a href="#cookie-details"><span class="mono">03</span>Cookie Details</a></li>
          <li><a href="#how-to-manage-cookies"><span class="mono">04</span>How to Manage Cookies</a></li>
          <li><a href="#contact-our-dpo"><span class="mono">05</span>Contact Our DPO</a></li>
        </ol>
      </nav>
      <div class="legal-doc">
      <div class="legal-intro" data-testid="gdpr-last-updated">
        <p class="text-[var(--text-muted)] text-sm">Last Updated: February 2026</p>
        <p class="text-[var(--text-muted)] mt-4 leading-relaxed">This policy explains how HBDR complies with the General Data Protection Regulation (GDPR) and describes our use of cookies and similar tracking technologies. It applies to all visitors and users of our website and platform.</p>
      </div>

      <section class="legal-sec" id="gdpr-compliance" data-testid="gdpr-section-compliance">
        <h2><span class="mono">01</span>GDPR Compliance</h2>

        <h3>Legal Basis for Processing</h3>
        <p class="text-[var(--text-muted)] leading-relaxed mb-4">Under the GDPR, we process personal data based on one or more of the following legal bases:</p>
        <ul class="list-disc pl-6 text-[var(--text-muted)] space-y-2 mb-6">
          <li><strong class="text-white/80">Consent:</strong> Where you have given clear, informed consent for us to process your data for a specific purpose (e.g., marketing communications, non-essential cookies).</li>
          <li><strong class="text-white/80">Contractual Necessity:</strong> Where processing is necessary to perform our contract with you, such as providing ad monetization services and managing your publisher account.</li>
          <li><strong class="text-white/80">Legitimate Interests:</strong> Where processing is necessary for our legitimate business interests, such as fraud prevention, platform security, and service improvement, provided these interests do not override your rights.</li>
          <li><strong class="text-white/80">Legal Obligation:</strong> Where processing is necessary to comply with applicable laws, regulations, or legal proceedings.</li>
        </ul>

        <h3>Data Subject Rights</h3>
        <p class="text-[var(--text-muted)] leading-relaxed mb-4">If you are located in the European Economic Area (EEA) or United Kingdom, you have the following rights under the GDPR:</p>
        <ul class="list-disc pl-6 text-[var(--text-muted)] space-y-2 mb-6">
          <li><strong class="text-white/80">Right of Access:</strong> Obtain confirmation of whether we process your personal data and request a copy of it.</li>
          <li><strong class="text-white/80">Right to Rectification:</strong> Request correction of inaccurate or incomplete personal data.</li>
          <li><strong class="text-white/80">Right to Erasure:</strong> Request deletion of your personal data under certain circumstances.</li>
          <li><strong class="text-white/80">Right to Restriction:</strong> Request that we restrict processing of your data in certain situations.</li>
          <li><strong class="text-white/80">Right to Data Portability:</strong> Receive your personal data in a structured, commonly used, machine-readable format.</li>
          <li><strong class="text-white/80">Right to Object:</strong> Object to processing based on legitimate interests or direct marketing.</li>
          <li><strong class="text-white/80">Right to Withdraw Consent:</strong> Withdraw previously given consent at any time without affecting the lawfulness of prior processing.</li>
          <li><strong class="text-white/80">Right to Lodge a Complaint:</strong> File a complaint with your local data protection supervisory authority.</li>
        </ul>

        <h3>Data Protection Officer</h3>
        <p class="text-[var(--text-muted)] leading-relaxed mb-6">For all GDPR-related inquiries, data subject access requests, or complaints, please contact our Data Protection Officer at <a href="mailto:contact@hbdr.com" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-gdpr-dpo-email">contact@hbdr.com</a>. We will respond to verified requests within 30 days.</p>

        <h3>International Data Transfers</h3>
        <p class="text-[var(--text-muted)] leading-relaxed">When we transfer personal data outside the EEA, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by the European Commission, adequacy decisions, or other lawful transfer mechanisms. Our programmatic advertising partners and demand-side platforms operate globally; data shared during real-time bidding auctions may be processed in various jurisdictions. We contractually require all partners to maintain GDPR-compliant data protection standards.</p>
      </section>

      <section class="legal-sec" id="cookie-policy" data-testid="gdpr-section-cookies">
        <h2><span class="mono">02</span>Cookie Policy</h2>

        <h3>What Are Cookies?</h3>
        <p class="text-[var(--text-muted)] leading-relaxed mb-6">Cookies are small text files stored on your device when you visit a website. They serve various functions such as remembering your preferences, analyzing site usage, and enabling personalized advertising. Cookies may be "session" cookies (deleted when you close your browser) or "persistent" cookies (remaining on your device for a set period).</p>

        <h3>Types of Cookies We Use</h3>

        <dl class="legal-terms">
          <div>
            <dt>Essential Cookies</dt>
            <dd>Required for basic website functionality, security, and authentication. These cookies cannot be disabled as they are necessary for the site to function properly.</dd>
          </div>
          <div>
            <dt>Analytics Cookies</dt>
            <dd>Help us understand how visitors interact with our website by collecting anonymous usage statistics. This data helps us improve our platform and user experience.</dd>
          </div>
          <div>
            <dt>Advertising & Targeting Cookies</dt>
            <dd>Used by our advertising partners to build a profile of your interests and deliver relevant ads across websites. As an ad tech platform, these cookies are integral to the programmatic advertising ecosystem.</dd>
          </div>
          <div>
            <dt>Functional Cookies</dt>
            <dd>Enable enhanced functionality and personalization, such as remembering your settings, language preferences, and dashboard configurations.</dd>
          </div>
        </dl>
      </section>

      <section class="legal-sec" id="cookie-details" data-testid="gdpr-section-cookie-table">
        <h2><span class="mono">03</span>Cookie Details</h2>
        <div class="bp-table-wrap">
          <table class="bp-table" data-testid="cookie-table">
            <thead>
              <tr>
                <th scope="col">Cookie Name</th>
                <th scope="col">Type</th>
                <th scope="col">Purpose</th>
                <th scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="mono">_hbdr_session</td>
                <td>Essential</td>
                <td>Maintains authenticated session state</td>
                <td>Session</td>
              </tr>
              <tr>
                <td class="mono">_hbdr_csrf</td>
                <td>Essential</td>
                <td>Cross-site request forgery protection</td>
                <td>Session</td>
              </tr>
              <tr>
                <td class="mono">_hbdr_consent</td>
                <td>Essential</td>
                <td>Stores cookie consent preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td class="mono">_ga</td>
                <td>Analytics</td>
                <td>Google Analytics visitor identification</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td class="mono">_ga_*</td>
                <td>Analytics</td>
                <td>Google Analytics session persistence</td>
                <td>2 years</td>
              </tr>
              <tr>
                <td class="mono">_gid</td>
                <td>Analytics</td>
                <td>Google Analytics session identification</td>
                <td>24 hours</td>
              </tr>
              <tr>
                <td class="mono">_pbjs_userid_*</td>
                <td>Advertising</td>
                <td>Prebid.js user identification for header bidding</td>
                <td>30 days</td>
              </tr>
              <tr>
                <td class="mono">__gads</td>
                <td>Advertising</td>
                <td>Google advertising cookie for ad delivery</td>
                <td>13 months</td>
              </tr>
              <tr>
                <td class="mono">_hbdr_prefs</td>
                <td>Functional</td>
                <td>Stores dashboard and UI preferences</td>
                <td>1 year</td>
              </tr>
              <tr>
                <td class="mono">_hbdr_tz</td>
                <td>Functional</td>
                <td>Timezone detection for reporting</td>
                <td>30 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="legal-sec" id="how-to-manage-cookies" data-testid="gdpr-section-manage">
        <h2><span class="mono">04</span>How to Manage Cookies</h2>
        <p class="text-[var(--text-muted)] leading-relaxed mb-4">You can control and manage cookies through several methods:</p>
        <ul class="list-disc pl-6 text-[var(--text-muted)] space-y-2 mb-4">
          <li><strong class="text-white/80">Browser Settings:</strong> Most browsers allow you to view, manage, and delete cookies through their settings. Consult your browser's help documentation for specific instructions.</li>
          <li><strong class="text-white/80">Opt-Out Tools:</strong> For advertising cookies, you can use industry opt-out tools such as the Digital Advertising Alliance's opt-out page (optout.aboutads.info) or the Network Advertising Initiative's opt-out page (optout.networkadvertising.org).</li>
          <li><strong class="text-white/80">Google Ad Settings:</strong> Manage your Google advertising preferences at adssettings.google.com.</li>
          <li><strong class="text-white/80">Do Not Track:</strong> We honor Do Not Track (DNT) signals sent by your browser.</li>
        </ul>
        <p class="text-[var(--text-muted)] leading-relaxed">Please note that disabling certain cookies may affect the functionality of our platform and limit your ability to use some features.</p>
      </section>

      <section class="legal-sec" id="contact-our-dpo" data-testid="gdpr-section-contact">
        <h2><span class="mono">05</span>Contact Our DPO</h2>
        <p class="text-[var(--text-muted)] leading-relaxed mb-6">For any questions about this GDPR & Cookie Policy, to exercise your data rights, or to raise a data protection concern, please contact our Data Protection Officer:</p>
        <div class="space-y-3 text-[var(--text-muted)]">
          <p><strong class="text-white/80">HBDR Data Protection Officer</strong></p>
          <p>1200 Brickell Ave Ste 1950, Miami, FL 33131</p>
          <p>Email: <a href="mailto:contact@hbdr.com" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-gdpr-contact-email">contact@hbdr.com</a></p>
          <p>Phone: <a href="tel:+17866756080" class="text-[var(--accent)] underline underline-offset-2" data-testid="link-gdpr-contact-phone">(786) 675-6080</a></p>
        </div>
      </section>
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "GDPR & Cookie Policy - HBDR",
    description: "HBDR GDPR compliance and cookie policy. Learn about our data protection practices, your rights, and how we use cookies across our ad tech platform.",
    canonicalPath: "/gdpr-cookie-policy",
    bodyContent: content,
  });
}

