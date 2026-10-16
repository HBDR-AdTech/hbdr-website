import { sanitizeText } from "../../middleware/sanitize";
import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { renderSectionHead } from "../components/blueprint";

// Turnstile site key when the operator has it on (D-016); the support form posts to the same checked endpoint
export function renderFaqSupportPage(turnstileSiteKey: string | null = null): string {
  const faqs = [
    { category: "General", items: [
      { q: "What is HBDR and what services do you provide?", a: "HBDR is a global leader in ad monetization and header bidding solutions. We help publishers maximize their advertising revenue through advanced header bidding implementation, Google Ad Exchange (AdX) access, programmatic optimization, display ads, CTV/OTT advertising, in-app ads, and comprehensive yield management services." },
      { q: "What types of publishers does HBDR work with?", a: "We work with publishers of all sizes, from mid-market websites generating 1 million+ monthly pageviews to large enterprise media companies. Our solutions are tailored to web publishers, app developers, CTV/OTT content providers, and digital media companies across all verticals." },
      { q: "How does HBDR's revenue share model work?", a: "HBDR operates on a transparent revenue share model. We take a percentage of the incremental revenue we generate for your properties. There are no setup fees, hidden costs, or minimum commitments. You only pay when we deliver results. Contact our team for specific revenue share details based on your inventory volume." },
      { q: "How long does it take to see revenue improvements?", a: "Most publishers see measurable revenue improvements within the first 2-4 weeks after integration. Our onboarding process typically takes 1-2 weeks, and our optimization algorithms continuously improve performance over the first 60-90 days as they learn your traffic patterns and audience behavior." },
    ]},
    { category: "Technical", items: [
      { q: "What is header bidding and how does it work?", a: "Header bidding is an advanced programmatic advertising technique that allows publishers to offer their ad inventory to multiple demand sources simultaneously before making ad server calls. This creates a unified auction that drives competition among buyers, resulting in higher CPMs and increased fill rates compared to traditional waterfall setups." },
      { q: "Does HBDR support both client-side and server-side header bidding?", a: "Yes, we support both Prebid.js client-side header bidding and server-side bidding (S2S) through Prebid Server. We recommend a hybrid approach for most publishers, using client-side for latency-sensitive environments and server-side for mobile, video, and high-demand-partner configurations." },
      { q: "Will HBDR's implementation affect my site speed?", a: "Our implementation is optimized for minimal latency impact. We use asynchronous loading, lazy initialization, timeout management, and server-side bidding to ensure ad auctions do not block page rendering. Most publishers see less than 100ms added to their total page load time." },
      { q: "What ad formats does HBDR support?", a: "We support all major ad formats including display (standard IAB sizes), native ads, video (instream and outstream), rewarded video, interstitials, rich media, CTV/OTT video ads, and custom high-impact units. Our team will recommend the optimal format mix based on your content and audience." },
    ]},
    { category: "Account & Billing", items: [
      { q: "How do I access my revenue reports and analytics?", a: "All publishers receive access to our real-time analytics dashboard, which includes detailed reporting on impressions, CPMs, fill rates, revenue by demand partner, and more. Reports can be filtered by date range, ad unit, device, geography, and other dimensions. We also support automated report delivery via email." },
      { q: "What are the payment terms and thresholds?", a: "HBDR pays publishers on a Net-60 basis with a minimum payment threshold of $100. Payments are processed via wire transfer or ACH. Detailed payment statements are available in your dashboard, and our finance team is available for any billing inquiries." },
      { q: "Can I use HBDR alongside my existing ad partners?", a: "Absolutely. HBDR is designed to work alongside your existing ad stack. We integrate with your current Google Ad Manager setup and add our demand sources to your existing configuration. Our goal is to complement and enhance your current monetization strategy, not replace it." },
    ]},
    { category: "Integration & Setup", items: [
      { q: "What is the onboarding process like?", a: "Our onboarding process consists of four phases: Discovery (understanding your current setup and goals), Integration (implementing our header bidding wrapper and connecting demand partners), Optimization (fine-tuning configurations and floor prices), and Growth (ongoing optimization and scaling). Most publishers are fully integrated within 1-2 weeks." },
      { q: "Do I need to change my ad server to use HBDR?", a: "No, HBDR works with your existing Google Ad Manager (GAM) setup. We integrate our header bidding solution alongside your current configuration, adding demand without disrupting your existing ad operations. For MCM publishers, we handle the Google partnership integration seamlessly." },
      { q: "What technical resources do I need for integration?", a: "Minimal technical resources are required. Our team handles the majority of the implementation. You will need someone with access to your website's code (to place the header bidding script) and your Google Ad Manager account. For most CMS platforms, integration is as simple as adding a JavaScript snippet." },
      { q: "Does HBDR provide an ads.txt file?", a: "Yes, we provide the necessary ads.txt entries that need to be added to your domain's ads.txt file. This is required for authorized digital selling and ensures that our demand partners can bid on your inventory. Our team will provide the exact lines and assist with implementation." },
    ]},
  ];

  const content = `
  ${renderPageHero("Support", "FAQ & Support", "Find answers to common questions or reach out to our dedicated support team for personalized assistance.")}

  <section class="bp-section" data-testid="faq-section">
    <div class="bp-wrap">${renderSectionHead({ title: "Frequently Asked Questions", lede: "Browse our most common questions organized by category." })}

      ${faqs.map((cat, ci) => `
      <div class="faq-group bp-grid12" data-testid="faq-category-${ci}">
        <h3><span class="mono">${String(ci + 1).padStart(2, "0")}</span>${cat.category}</h3>
        <div class="faq-list" x-data="{ openFaq: null }">
          ${cat.items.map((item, i) => {
            const faqId = `faq-${ci}-${i}`;
            return `
          <div class="faq-item" data-testid="${faqId}">
            <button
              @click="openFaq = openFaq === '${faqId}' ? null : '${faqId}'"
              class="w-full text-left py-5 flex items-center justify-between gap-4 cursor-pointer"
              data-testid="button-${faqId}"
            >
              <span class="font-medium text-[var(--text-primary)]">${item.q}</span>
              <svg class="w-5 h-5 text-[var(--text-muted)] flex-shrink-0 transition-transform duration-300" :class="openFaq === '${faqId}' ? 'rotate-180' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
            </button>
            <div x-show="openFaq === '${faqId}'" x-cloak x-transition:enter="transition ease-out duration-200" x-transition:enter-start="opacity-0 -translate-y-1" x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-150" x-transition:leave-start="opacity-100" x-transition:leave-end="opacity-0">
              <div class="pb-6 pr-8 text-[var(--text-muted)] leading-relaxed max-w-[68ch]">${item.a}</div>
            </div>
          </div>`;
          }).join("")}
        </div>
      </div>`).join("")}
    </div>
  </section>

  <section class="bp-section" data-testid="support-channels-section">
    <div class="bp-wrap">${renderSectionHead({ title: "Support Channels", lede: "Multiple ways to get the help you need, when you need it." })}
      <div class="bp-table-wrap">
        <table class="bp-table support-table">
          <thead><tr><th scope="col">Channel</th><th scope="col">Reach us</th><th scope="col">Service level</th></tr></thead>
          <tbody>
            <tr data-testid="support-channel-email"><td>Email Support</td><td><a href="mailto:support@hbdr.com" class="text-[var(--accent)] hover:underline" data-testid="link-support-email">support@hbdr.com</a></td><td>Response within 24 hours</td></tr>
            <tr data-testid="support-channel-phone"><td>Phone Support</td><td><a href="tel:+17866756080" class="text-[var(--accent)] hover:underline" data-testid="link-support-phone">(786) 675-6080</a></td><td>Mon-Fri, 9am-6pm EST</td></tr>
            <tr data-testid="support-channel-priority"><td>Priority Support</td><td>Enterprise clients</td><td>Response within 4 hours</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section class="bp-section" data-testid="support-form-section">
    <div class="bp-wrap bp-grid12">
      <div class="contact-intro">
        <h2 class="text-[clamp(1.9rem,3.2vw,2.85rem)] leading-[1.06]">Submit a Support Request</h2>
        <p class="text-[var(--text-muted)]">Fill out the form below and our support team will get back to you as soon as possible.</p>
      </div>

      <div class="contact-form-col support-form-frame" data-testid="support-form-card"
           x-data="{
             formData: { name: '', email: '', subject: '', priority: 'Medium', message: '', _hp_website: '' },
             submitting: false,
             submitted: false,
             error: false,
             async submitForm() {
               this.submitting = true;
               this.error = false;
               try {
                 const res = await fetch('/api/contact', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({
                     name: this.formData.name,
                     email: this.formData.email,
                     company: this.formData.subject + ' [Priority: ' + this.formData.priority + ']',
                     impressions: 'support-request',
                     message: this.formData.message,
                     _hp_website: this.formData._hp_website,
                     _source: 'support',
                     turnstileToken: (this.$root.querySelector('[name=cf-turnstile-response]') || {}).value || ''
                   })
                 });
                 if (res.ok) {
                   this.submitted = true;
                 } else {
                   if (window.turnstile) window.turnstile.reset();
                   this.error = {400:'Please check your details and try again.',403:window.turnstile ? 'Verification failed, please retry.' : 'The verification check did not load. Please reload the page and try again, or email us at support@hbdr.com',422:'Please use a permanent email address. Disposable addresses are not accepted.',429:'Too many submissions. Please wait a few minutes and try again.'}[res.status] || 'Something went wrong. Please try again or email us at support@hbdr.com';
                 }
               } catch (e) {
                 this.error = 'Network error. Please try again or email us at support@hbdr.com';
               } finally {
                 this.submitting = false;
               }
             }
           }">
        <div x-show="!submitted">
          <form @submit.prevent="submitForm()" data-testid="support-form">
            <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;" aria-hidden="true" tabindex="-1">
              <label for="hp_support_website">Website</label>
              <input type="text" id="hp_support_website" name="website" x-model="formData._hp_website" autocomplete="off" tabindex="-1" />
            </div>
            <div class="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="input-support-name" class="block text-sm font-medium text-white/60 mb-2">Name</label>
                <input id="input-support-name" type="text" x-model="formData.name" required class="glass-input w-full px-4 py-3.5" placeholder="Your name" data-testid="input-support-name" />
              </div>
              <div>
                <label for="input-support-email" class="block text-sm font-medium text-white/60 mb-2">Email</label>
                <input id="input-support-email" type="email" x-model="formData.email" required class="glass-input w-full px-4 py-3.5" placeholder="you@company.com" data-testid="input-support-email" />
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label for="select-support-subject" class="block text-sm font-medium text-white/60 mb-2">Subject</label>
                <select id="select-support-subject" x-model="formData.subject" required class="glass-select w-full" data-testid="select-support-subject">
                  <option value="" disabled selected>Select a subject</option>
                  <option value="Technical Issue">Technical Issue</option>
                  <option value="Billing Question">Billing Question</option>
                  <option value="Account Help">Account Help</option>
                  <option value="Feature Request">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label for="select-support-priority" class="block text-sm font-medium text-white/60 mb-2">Priority</label>
                <select id="select-support-priority" x-model="formData.priority" class="glass-select w-full" data-testid="select-support-priority">
                  <option value="Low">Low</option>
                  <option value="Medium" selected>Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            <div class="mb-6">
              <label for="textarea-support-description" class="block text-sm font-medium text-white/60 mb-2">Description</label>
              <textarea id="textarea-support-description" x-model="formData.message" required rows="5" class="glass-input w-full px-4 py-3.5" placeholder="Please describe your issue or question in detail..." data-testid="textarea-support-description"></textarea>
            </div>
            ${turnstileSiteKey ? `
            <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
            <div class="cf-turnstile mb-6" data-sitekey="${sanitizeText(turnstileSiteKey)}" data-action="contact" data-theme="dark" data-testid="turnstile-widget"></div>` : ""}
            <button type="submit" class="glass-btn w-full text-center py-4" :disabled="submitting" data-testid="button-submit-support">
              <span x-show="!submitting">Submit Support Request</span>
              <span x-show="submitting" x-cloak class="inline-flex items-center gap-2">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            </button>
            <p x-show="error" x-cloak x-text="error" role="alert" class="text-red-400 text-sm text-center mt-4"></p>
          </form>
        </div>
        <div x-show="submitted" x-cloak class="text-center py-8">
          <div class="w-16 h-16 rounded-full bg-[var(--accent)]/15 flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="text-2xl font-display text-white mb-2">Request Submitted</h3>
          <p class="text-[var(--text-muted)]">Our support team will get back to you within 24 hours. Thank you for reaching out.</p>
        </div>
      </div>
    </div>
  </section>

  ${renderCTASection("Need a custom solution?", "Contact Our Team")}`;

  return renderLayout({
    title: "FAQ & Support - HBDR",
    description: "Find answers to common questions about HBDR's ad monetization and header bidding services. Get support from our dedicated team.",
    canonicalPath: "/support",
    bodyContent: content,
  });
}

