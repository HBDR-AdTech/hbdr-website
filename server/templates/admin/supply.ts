// Admin "Supply" page: hbdr.com /sellers.json and /ads.txt (D-031). Static HTML, like the form settings page:
// everything shown comes from GET /admin/api/supply at runtime and is rendered with x-text / :value,
// so operator and seller text never reaches the markup or an Alpine expression.
import { renderLayout } from "../layout";

const FIELD_LABEL = "block text-sm font-medium text-white/60 mb-2";
const INPUT = "glass-input w-full px-4 py-2 text-sm";
const TH = "py-3 px-4 font-medium";
const TD = "py-3 px-4 text-sm";

const script = `
<script>
  function supplyAdmin() {
    const blankSeller = () => ({ sellerId: '', name: '', domain: '', sellerType: 'PUBLISHER', isConfidential: false, comment: '' });
    const blankLine = () => ({ adSystemDomain: '', accountId: '', relationship: 'RESELLER', certAuthorityId: '', comment: '' });
    return {
      sellers: [], retired: [], lines: [], changes: [],
      settings: { contactEmail: '', contactAddress: '', directLineDomain: '' },
      newSeller: blankSeller(), newLine: blankLine(), editing: null, draft: null, q: '',
      error: '', notice: '', busy: false,
      get shown() {
        const q = this.q.trim().toLowerCase();
        return q ? this.sellers.filter(s => [s.sellerId, s.name, s.domain || ''].some(v => v.toLowerCase().includes(q))) : this.sellers;
      },
      async load() {
        try {
          const res = await fetch('/admin/api/supply');
          if (!res.ok) { this.error = 'Could not load the supply files (' + res.status + ').'; return; }
          const data = await res.json();
          this.sellers = data.sellers; this.retired = data.retired; this.lines = data.lines; this.changes = data.changes;
          this.settings = { contactEmail: data.settings.contact_email || '', contactAddress: data.settings.contact_address || '', directLineDomain: data.settings.direct_line_domain || '' };
        } catch (e) {
          // an expired Access session redirects the fetch to the login page, which fails here
          this.error = 'Could not load the supply files. Reload the page (you may need to sign in again).';
        }
      },
      // every save reloads from the server, so a refused change snaps the controls back to what is stored
      async post(url, body) {
        this.busy = true; this.error = ''; this.notice = '';
        try {
          const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) { this.error = data.message || 'Save failed (' + res.status + ').'; return false; }
          this.notice = 'Saved. /sellers.json and /ads.txt show the change within 60 seconds.';
          return true;
        } catch (e) {
          this.error = 'Network error; nothing was saved.';
          return false;
        } finally {
          this.busy = false;
          await this.load();
        }
      },
      // a blank optional field is sent as null (cleared), not as an empty string the API would refuse
      orNull(v) { return v.trim() === '' ? null : v; },
      async addSeller() {
        const s = this.newSeller;
        const body = { sellerId: s.sellerId, name: s.name, domain: this.orNull(s.domain), sellerType: s.sellerType, isConfidential: s.isConfidential, comment: this.orNull(s.comment) };
        if (await this.post('/admin/api/supply/sellers', body)) this.newSeller = blankSeller();
      },
      edit(s) {
        this.editing = s.sellerId;
        this.draft = { name: s.name, domain: s.domain || '', sellerType: s.sellerType, isConfidential: s.isConfidential, comment: s.comment || '' };
      },
      async saveDraft(s) {
        const d = this.draft;
        const body = { name: d.name, domain: this.orNull(d.domain), sellerType: d.sellerType, isConfidential: d.isConfidential, comment: this.orNull(d.comment) };
        if (await this.post('/admin/api/supply/sellers/' + encodeURIComponent(s.sellerId), body)) this.editing = null;
      },
      async retireSeller(s) {
        if (!confirm('Retire seller ' + s.sellerId + '? It leaves /sellers.json and the ID can never be used again.')) return;
        if (await this.post('/admin/api/supply/sellers/' + encodeURIComponent(s.sellerId) + '/retire')) this.editing = null;
      },
      async addLine() {
        const l = this.newLine;
        const body = { adSystemDomain: l.adSystemDomain, accountId: l.accountId, relationship: l.relationship, certAuthorityId: this.orNull(l.certAuthorityId), comment: this.orNull(l.comment) };
        if (await this.post('/admin/api/supply/lines', body)) this.newLine = blankLine();
      },
      retireLine(l) {
        if (!confirm('Retire this line? Publishers are no longer told to add it.')) return;
        return this.post('/admin/api/supply/lines/' + encodeURIComponent(l.id) + '/retire');
      },
      record(l) { return [l.adSystemDomain, l.accountId, l.relationship].concat(l.certAuthorityId ? [l.certAuthorityId] : []).join(', ') + (l.comment ? ' # ' + l.comment : ''); },
      // settings are changed, never cleared: a blank box is left out of the request
      saveSettings() {
        return this.post('/admin/api/supply/settings', Object.fromEntries(Object.entries(this.settings).filter(([, v]) => v.trim() !== '')));
      },
      when(at) { return new Date(at).toLocaleString(); },
    };
  }
</script>`;

export function renderSupplyPage(): string {
  const content = `
  ${script}
  <div class="min-h-screen" x-data="supplyAdmin()" x-init="load()">

    <nav class="border-b border-white/5 bg-[var(--surface)]/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-6">
            <a href="/" class="text-xl font-semibold text-white" data-testid="link-admin-home">HBDR</a>
            <span class="text-[var(--text-muted)]">|</span>
            <span class="text-white/60 font-medium">Admin Panel</span>
          </div>
          <div class="flex items-center gap-4">
            <a href="/admin/leads" class="text-sm text-[var(--text-muted)] hover:text-white transition-colors" data-testid="link-admin-leads">Leads</a>
            <a href="/admin/blog" class="text-sm text-[var(--text-muted)] hover:text-white transition-colors" data-testid="link-admin-blog">Blog</a>
            <a href="/admin/form" class="text-sm text-[var(--text-muted)] hover:text-white transition-colors" data-testid="link-admin-form">Form</a>
            <a href="/admin/supply" class="text-sm text-[var(--accent)] font-medium" data-testid="link-admin-supply">Supply</a>
            <span class="text-white/10">|</span>
            <a href="/cdn-cgi/access/logout" class="text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors" data-testid="link-admin-logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 class="text-3xl font-semibold text-white" data-testid="heading-supply">sellers.json and ads.txt</h1>
        <p class="text-[var(--text-muted)] mt-1">What <a href="/sellers.json" class="text-[var(--accent)]">/sellers.json</a> and <a href="/ads.txt" class="text-[var(--accent)]">/ads.txt</a> publish. Sellers and lines are retired, never deleted. Edit a seller only to correct the same company's name or domain; a different company always gets a new seller ID. Every change is logged below.</p>
      </div>

      <div x-show="error" x-cloak x-text="error" role="alert" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm" data-testid="text-supply-error"></div>
      <div x-show="notice" x-cloak x-text="notice" class="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-sm"></div>

      <div class="glass-card p-6 space-y-4" data-testid="panel-supply-settings">
        <h2 class="text-lg font-semibold text-white">Settings</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <label class="block">
            <span class="${FIELD_LABEL}">sellers.json contact email</span>
            <input type="email" x-model="settings.contactEmail" maxlength="254" class="${INPUT}" data-testid="input-contact-email" />
          </label>
          <label class="block">
            <span class="${FIELD_LABEL}">sellers.json contact address</span>
            <input type="text" x-model="settings.contactAddress" maxlength="300" class="${INPUT}" data-testid="input-contact-address" />
          </label>
          <label class="block">
            <span class="${FIELD_LABEL}">Domain in each publisher's DIRECT line</span>
            <input type="text" x-model="settings.directLineDomain" maxlength="253" placeholder="headerbiddr.com" class="${INPUT}" data-testid="input-direct-line-domain" />
          </label>
        </div>
        <button @click="saveSettings()" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-save-supply-settings">Save settings</button>
      </div>

      <div class="glass-card p-6 space-y-4" data-testid="panel-add-seller">
        <h2 class="text-lg font-semibold text-white">Add seller</h2>
        <div class="grid md:grid-cols-3 gap-4">
          <label class="block"><span class="${FIELD_LABEL}">Seller ID</span><input type="text" x-model="newSeller.sellerId" maxlength="64" class="${INPUT}" data-testid="input-new-seller-id" /></label>
          <label class="block"><span class="${FIELD_LABEL}">Legal name (the entity HBDR pays)</span><input type="text" x-model="newSeller.name" maxlength="200" class="${INPUT}" data-testid="input-new-seller-name" /></label>
          <label class="block"><span class="${FIELD_LABEL}">Business domain (blank if none)</span><input type="text" x-model="newSeller.domain" maxlength="253" class="${INPUT}" data-testid="input-new-seller-domain" /></label>
          <label class="block">
            <span class="${FIELD_LABEL}">Seller type</span>
            <select x-model="newSeller.sellerType" class="glass-select w-full" data-testid="select-new-seller-type">
              <option value="PUBLISHER">PUBLISHER</option><option value="INTERMEDIARY">INTERMEDIARY</option><option value="BOTH">BOTH</option>
            </select>
          </label>
          <label class="block"><span class="${FIELD_LABEL}">Comment (optional)</span><input type="text" x-model="newSeller.comment" maxlength="200" class="${INPUT}" data-testid="input-new-seller-comment" /></label>
          <label class="flex items-center gap-3 mt-7">
            <input type="checkbox" x-model="newSeller.isConfidential" class="checkbox checkbox-sm checkbox-success" />
            <span class="text-sm text-white/60">Confidential (name and domain left out of /sellers.json)</span>
          </label>
        </div>
        <button @click="addSeller()" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-add-seller">Add seller</button>
      </div>

      <div class="glass-card overflow-hidden">
        <div class="p-6 flex flex-wrap items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-white">Sellers <span class="text-[var(--text-muted)] font-normal" x-text="'(' + sellers.length + ' active)'"></span></h2>
          <input type="search" x-model="q" placeholder="Filter by ID, name or domain" class="glass-input px-4 py-2 text-sm w-72" data-testid="input-seller-filter" />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left" data-testid="table-sellers">
            <thead>
              <tr class="border-b border-white/5 text-[var(--text-muted)] text-xs uppercase tracking-wider">
                <th class="${TH}">Seller ID</th><th class="${TH}">Name</th><th class="${TH}">Domain</th><th class="${TH}">Type</th><th class="${TH}">Confidential</th><th class="${TH}"></th>
              </tr>
            </thead>
            <template x-for="s in shown" :key="s.sellerId">
              <tbody class="border-b border-white/5">
                <tr :data-testid="'seller-row-' + s.sellerId">
                  <td class="${TD} mono text-white" x-text="s.sellerId"></td>
                  <td class="${TD} text-white">
                    <span x-text="s.name"></span>
                    <span x-show="s.comment" class="block text-xs text-[var(--text-muted)]" x-text="s.comment"></span>
                  </td>
                  <td class="${TD} text-white/80" x-text="s.domain || '(none)'"></td>
                  <td class="${TD} text-[var(--text-muted)]" x-text="s.sellerType"></td>
                  <td class="${TD} text-[var(--text-muted)]" x-text="s.isConfidential ? 'yes' : 'no'"></td>
                  <td class="${TD} text-right">
                    <button @click="editing === s.sellerId ? editing = null : edit(s)" class="text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
                            :data-testid="'button-edit-seller-' + s.sellerId" x-text="editing === s.sellerId ? 'Close' : 'Edit'"></button>
                  </td>
                </tr>
                <template x-if="editing === s.sellerId">
                  <tr>
                    <td colspan="6" class="px-4 pb-6">
                      <div class="grid md:grid-cols-3 gap-4">
                        <label class="block"><span class="${FIELD_LABEL}">Legal name</span><input type="text" x-model="draft.name" maxlength="200" class="${INPUT}" /></label>
                        <label class="block"><span class="${FIELD_LABEL}">Business domain</span><input type="text" x-model="draft.domain" maxlength="253" class="${INPUT}" /></label>
                        <label class="block">
                          <span class="${FIELD_LABEL}">Seller type</span>
                          <select x-model="draft.sellerType" class="glass-select w-full">
                            <option value="PUBLISHER">PUBLISHER</option><option value="INTERMEDIARY">INTERMEDIARY</option><option value="BOTH">BOTH</option>
                          </select>
                        </label>
                        <label class="block md:col-span-2"><span class="${FIELD_LABEL}">Comment</span><input type="text" x-model="draft.comment" maxlength="200" class="${INPUT}" /></label>
                        <label class="flex items-center gap-3 mt-7">
                          <input type="checkbox" x-model="draft.isConfidential" class="checkbox checkbox-sm checkbox-success" />
                          <span class="text-sm text-white/60">Confidential</span>
                        </label>
                      </div>
                      <div class="flex items-center gap-4 mt-4">
                        <button @click="saveDraft(s)" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-save-seller">Save</button>
                        <button @click="editing = null" class="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cancel</button>
                        <button @click="retireSeller(s)" :disabled="busy" class="text-sm text-red-400 hover:text-red-300 transition-colors ml-auto" data-testid="button-retire-seller">Retire seller</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </template>
          </table>
        </div>
        <p x-show="!sellers.length" class="p-6 text-sm text-[var(--text-muted)]">No sellers yet.</p>
      </div>

      <div class="glass-card p-6" x-show="retired.length">
        <h2 class="text-lg font-semibold text-white mb-1">Retired sellers</h2>
        <p class="text-sm text-[var(--text-muted)] mb-4">Left out of /sellers.json. Their IDs stay taken for good.</p>
        <ul class="divide-y divide-white/5" data-testid="list-retired-sellers">
          <template x-for="s in retired" :key="s.sellerId">
            <li class="py-3 text-sm grid sm:grid-cols-[160px_1fr_200px] gap-2">
              <span class="mono text-white/80" x-text="s.sellerId"></span>
              <span class="text-white/60 truncate" x-text="s.name + (s.domain ? ' (' + s.domain + ')' : '')"></span>
              <span class="text-[var(--text-muted)]" x-text="'retired ' + when(s.retiredAt)"></span>
            </li>
          </template>
        </ul>
      </div>

      <div class="glass-card p-6 space-y-4" data-testid="panel-ads-txt-lines">
        <div>
          <h2 class="text-lg font-semibold text-white">Partner lines for publishers' ads.txt</h2>
          <p class="text-sm text-[var(--text-muted)] mt-1">The lines every HBDR publisher adds after its own DIRECT line to HBDR. hbdr.com's own /ads.txt is the "no ads" placeholder and does not list these.</p>
        </div>
        <ul class="divide-y divide-white/5" data-testid="list-ads-txt-lines">
          <template x-for="l in lines" :key="l.id">
            <li class="py-3 text-sm flex items-center justify-between gap-4">
              <code class="mono text-white/80 break-all" x-text="record(l)"></code>
              <button @click="retireLine(l)" :disabled="busy" class="text-sm text-red-400 hover:text-red-300 transition-colors shrink-0">Retire</button>
            </li>
          </template>
          <li x-show="!lines.length" class="py-3 text-sm text-[var(--text-muted)]">No partner lines yet.</li>
        </ul>
        <div class="grid md:grid-cols-5 gap-4">
          <label class="block"><span class="${FIELD_LABEL}">Ad system domain</span><input type="text" x-model="newLine.adSystemDomain" maxlength="253" placeholder="google.com" class="${INPUT}" data-testid="input-new-line-domain" /></label>
          <label class="block"><span class="${FIELD_LABEL}">Account ID</span><input type="text" x-model="newLine.accountId" maxlength="100" class="${INPUT}" data-testid="input-new-line-account" /></label>
          <label class="block">
            <span class="${FIELD_LABEL}">Relationship</span>
            <select x-model="newLine.relationship" class="glass-select w-full" data-testid="select-new-line-relationship">
              <option value="RESELLER">RESELLER</option><option value="DIRECT">DIRECT</option>
            </select>
          </label>
          <label class="block"><span class="${FIELD_LABEL}">Cert. authority ID (optional)</span><input type="text" x-model="newLine.certAuthorityId" maxlength="64" class="${INPUT}" data-testid="input-new-line-cert" /></label>
          <label class="block"><span class="${FIELD_LABEL}">Comment (optional)</span><input type="text" x-model="newLine.comment" maxlength="200" class="${INPUT}" data-testid="input-new-line-comment" /></label>
        </div>
        <button @click="addLine()" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-add-line">Add line</button>
      </div>

      <div class="glass-card p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Recent changes</h2>
        <ul class="divide-y divide-white/5" data-testid="list-supply-changes">
          <template x-for="ch in changes" :key="ch.id">
            <li class="py-3 text-sm grid sm:grid-cols-[200px_220px_1fr] gap-2">
              <span class="text-[var(--text-muted)]" x-text="when(ch.at)"></span>
              <span class="text-white/60 truncate" x-text="ch.actor"></span>
              <span class="text-white/80 truncate" x-text="ch.target + ': ' + ch.after" :title="'before: ' + (ch.before ?? '(none)')"></span>
            </li>
          </template>
          <li x-show="!changes.length" class="py-3 text-sm text-[var(--text-muted)]">No changes yet.</li>
        </ul>
      </div>
    </div>
  </div>`;

  return renderLayout({
    title: "sellers.json and ads.txt - HBDR Admin",
    description: "HBDR Admin - sellers.json and ads.txt",
    canonicalPath: "/admin/supply",
    bodyContent: content,
    adminPage: true,
  });
}
