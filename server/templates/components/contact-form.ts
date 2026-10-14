import type { FormConfig, FormField } from "../../services/form-config";
import { sanitizeText as esc } from "../../middleware/sanitize";

const LABEL = "block text-sm font-medium text-white/60 mb-2";
const OPTIONAL = '<span class="text-[var(--text-muted)] font-normal">(optional)</span>';
const INPUT = "glass-input w-full px-4 py-3";

// The ids (and data-testids) the built-in fields have always had
const BUILTIN_IDS: Record<string, string> = {
  name: "input-name", email: "input-email", company: "input-company", phone: "input-phone", role: "select-role",
  impressions: "select-impressions", property: "input-property", adsTxtUrl: "input-ads-txt", appStoreUrls: "textarea-app-stores",
  currentSetup: "select-current-setup", topGeo: "select-top-geo", timeline: "select-timeline", referral: "select-referral",
  message: "textarea-message",
};

// Labels, placeholders and options are operator text: escaped here. Only field keys ([A-Za-z0-9_]) reach Alpine expressions.
// One two-column grid: short fields pair up, checkbox groups and text areas span both columns.
// conditional: App Store URLs, shown only while Mobile app or CTV / OTT is ticked
function renderField(field: FormField, conditional: boolean): string {
  const prefix = field.type === "select" ? "select" : field.type === "textarea" ? "textarea" : "input";
  const id = BUILTIN_IDS[field.key] ?? `${prefix}-${field.key}`;
  const model = `formData.${field.custom ? "custom." : ""}${field.key}`;
  const label = `${esc(field.label)}${field.required ? "" : ` ${OPTIONAL}`}`;
  // a hidden required control would block the browser's submit, so the conditional field is required only while shown
  const required = !field.required ? "" : conditional ? ':required="appStores()"' : "required";
  const placeholder = esc(field.placeholder);

  if (field.type === "checkboxes") {
    const testid = field.key === "inventoryTypes" ? "checkbox-inventory" : `checkbox-${field.key}`;
    return `
                <fieldset class="sm:col-span-2"${field.required ? ` data-required-group data-label="${esc(field.label)}"` : ""}>
                  <legend class="${LABEL}">${esc(field.label)} <span class="text-[var(--text-muted)] font-normal">(select all that apply${field.required ? "" : ", optional"})</span></legend>
                  <div class="flex flex-wrap gap-3">
                    ${field.options!.map((o, i) => !o.active ? "" : `
                    <label class="glass-input flex items-center gap-2 px-4 py-2.5 cursor-pointer has-[:checked]:border-[var(--accent)]">
                      <input type="checkbox" value="${esc(o.value)}" x-model="${model}" class="checkbox checkbox-sm checkbox-success" data-testid="${testid}-${i}" />
                      <span class="text-sm text-white">${esc(o.label ?? o.value)}</span>
                    </label>`).join("")}
                  </div>
                </fieldset>`;
  }
  if (field.type === "select") {
    return `
                <div>
                  <label for="${id}" class="${LABEL}">${label}</label>
                  <select id="${id}" x-model="${model}" class="glass-select w-full" ${required} data-testid="${id}">
                    <option value="">${placeholder}</option>${field.options!.filter((o) => o.active).map((o) => `<option value="${esc(o.value)}">${esc(o.label ?? o.value)}</option>`).join("")}
                  </select>
                </div>`;
  }
  if (field.type === "textarea") {
    return `
                <div class="sm:col-span-2"${conditional ? ' x-show="appStores()" x-cloak x-transition' : ""}>
                  <label for="${id}" class="${LABEL}">${label}</label>
                  <textarea id="${id}" x-model="${model}" placeholder="${placeholder}" rows="${field.key === "message" ? 4 : 3}" maxlength="${field.maxLength}" class="${INPUT} resize-none" ${required} data-testid="${id}"></textarea>
                </div>`;
  }
  return `
                <div>
                  <label for="${id}" class="${LABEL}">${label}</label>
                  <input id="${id}" type="${field.type}" x-model="${model}" placeholder="${placeholder}" maxlength="${field.maxLength}"${field.type === "tel" ? ' autocomplete="tel"' : ""} class="${INPUT}" ${required} data-testid="${id}" />
                </div>`;
}

export function renderContactFormSection(form: FormConfig): string {
  const visible = form.fields.filter((f) => f.visible);
  const conditional = (f: FormField) => f.key === "appStoreUrls" && visible.some((v) => v.key === "inventoryTypes");
  const initial = (f: FormField) => `${f.key}: ${f.type === "checkboxes" ? "[]" : "''"}`;
  // hidden fields are left out entirely: the API ignores them, and an absent field is never "required but blank"
  const formData = [
    ...visible.filter((f) => !f.custom).map(initial),
    `custom: { ${visible.filter((f) => f.custom).map(initial).join(", ")} }`,
    "_hp_website: ''", "_source: 'contact'",
  ].join(", ");
  const siteKey = form.turnstileSiteKey;

  return `
  <section id="contact" class="py-24 lg:py-32" data-testid="contact-section">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-14 lg:mb-16 animate-on-scroll">
        <div class="glass-tag mb-6">Get Started</div>
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-display tracking-tight mb-6 text-gradient">
          Start Monetizing Today
        </h2>
        <p class="text-lg text-[var(--text-muted)] max-w-2xl leading-relaxed">
          Ready to transform your ad revenue? Fill out the form and our team will reach out within 24 hours.
        </p>
      </div>

      <div class="grid lg:grid-cols-5 gap-12">
        <div class="lg:col-span-2 space-y-8 animate-on-scroll lg:sticky lg:top-28 lg:self-start">
          <div>
            <h3 class="text-2xl font-semibold text-white mb-4">Let's Talk Revenue</h3>
            <p class="text-[var(--text-muted)] leading-relaxed">
              Whether you're optimizing existing ads or exploring new monetization opportunities, our experts are here to help.
            </p>
          </div>

          <div class="space-y-6">
            <div class="flex items-start gap-4">
              <div class="icon-tile flex-shrink-0">
                <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <div class="font-semibold text-white">Email Us</div>
                <div class="text-[var(--text-muted)]">contact@hbdr.com</div>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="icon-tile flex-shrink-0">
                <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <div class="font-semibold text-white">Call Us</div>
                <a href="tel:+17866756080" class="text-white/60 hover:text-white transition-colors">(786) 675-6080</a>
              </div>
            </div>

            <div class="flex items-start gap-4">
              <div class="icon-tile flex-shrink-0">
                <svg class="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <div class="font-semibold text-white">Visit Us</div>
                <div class="text-[var(--text-muted)]">1200 Brickell Ave Ste 1950<br/>Miami, FL 33131</div>
              </div>
            </div>
          </div>

          <div class="pt-6 border-t border-white/5">
            <div class="text-sm text-[var(--text-muted)] mb-3">Response time</div>
            <div class="flex items-center gap-2">
              <span class="relative flex h-3 w-3">
                <span class="absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" style="animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 bg-[var(--accent)]"></span>
              </span>
              <span class="font-medium text-white">Usually within 24 hours</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 animate-on-scroll stagger-2">
          <div id="contact-form-container"
               x-data="{
                 formData: { ${formData} },
                 submitting: false,
                 submitted: false,
                 error: false,
                 appStores() { return (this.formData.inventoryTypes || []).some(t => t === 'Mobile app' || t === 'CTV / OTT'); },
                 async submitForm() {
                   this.error = false;
                   for (const group of this.$root.querySelectorAll('[data-required-group]')) {
                     if (!group.querySelector('input:checked')) { this.error = 'Select at least one option for ' + group.dataset.label + '.'; return; }
                   }
                   const body = { ...this.formData };${visible.some(conditional) ? `
                   if (!this.appStores()) delete body.appStoreUrls;` : ""}${siteKey ? `
                   body.turnstileToken = (this.$root.querySelector('[name=cf-turnstile-response]') || {}).value || '';` : ""}
                   this.submitting = true;
                   try {
                     const res = await fetch('/api/contact', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify(body)
                     });
                     if (res.ok) {
                       this.submitted = true;
                     } else {
                       const detail = res.status === 400 ? (await res.json().catch(() => ({}))).message : '';
                       this.error = detail || {400:'Please check your details and try again.',403:window.turnstile ? 'Verification failed, please retry.' : 'The verification check did not load. Please reload the page and try again, or email us at contact@hbdr.com',422:'Please use a permanent email address. Disposable addresses are not accepted.',429:'Too many submissions. Please wait a few minutes and try again.'}[res.status] || 'Something went wrong. Please try again or email us at contact@hbdr.com';
                       if (window.turnstile) window.turnstile.reset();
                     }
                   } catch (e) {
                     this.error = 'Network error. Please try again or email us at contact@hbdr.com';
                   }
                   this.submitting = false;
                 }
               }">

            <div x-show="submitted" x-cloak class="glass-card p-8 text-center" x-transition>
              <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[var(--accent)]/15 mb-4">
                <svg class="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="text-2xl font-semibold text-white mb-2">Message Sent!</h3>
              <p class="text-[var(--text-muted)]">We'll get back to you within 24 hours. Thank you for your interest in HBDR.</p>
            </div>

            <form x-show="!submitted" @submit.prevent="submitForm()" class="glass-card p-6 sm:p-8 space-y-6" data-testid="contact-form">

              <div x-show="error" x-cloak x-text="error" role="alert" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"></div>

              <div style="position:absolute;left:-9999px;top:-9999px;opacity:0;height:0;width:0;overflow:hidden;" aria-hidden="true" tabindex="-1">
                <label for="hp_website">Website</label>
                <input type="text" id="hp_website" name="website" x-model="formData._hp_website" autocomplete="off" tabindex="-1" />
              </div>

              <div class="grid sm:grid-cols-2 gap-6">
                ${visible.map((f) => renderField(f, conditional(f))).join("")}
              </div>
${siteKey ? `
              <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
              <div class="cf-turnstile" data-sitekey="${esc(siteKey)}" data-action="contact" data-theme="dark" data-testid="turnstile-widget"></div>` : ""}

              <button type="submit" :disabled="submitting" class="glass-btn w-full py-4 text-base font-medium flex items-center justify-center gap-2 disabled:opacity-50" data-testid="button-submit-contact">
                <template x-if="!submitting">
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                    Get Your Free Analysis
                  </span>
                </template>
                <template x-if="submitting">
                  <span class="flex items-center gap-2">
                    <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                </template>
              </button>

              <p class="text-center text-sm text-[var(--text-muted)]">
                By submitting, you agree to our <a href="/privacy-policy" class="text-[var(--accent)] hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>`;
}
