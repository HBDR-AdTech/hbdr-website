// Admin "Form settings" page (D-016). Static HTML: everything shown comes from GET /api/form-config at runtime
// and is rendered with x-text / :value, so operator text never reaches the markup or an Alpine expression.
import { renderLayout } from "../layout";

const FIELD_LABEL = "block text-sm font-medium text-white/60 mb-2";
const LOCK_ICON = `<svg class="w-3.5 h-3.5 inline text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>`;

const script = `
<script>
  function formAdmin() {
    return {
      fields: [], changes: [], settings: { turnstileEnabled: false, turnstileSiteKey: '' }, secretSet: false,
      editing: null, draft: null, error: '', notice: '', busy: false,
      newField: { label: '', type: 'text', options: '', required: false },
      async load() {
        try {
          const res = await fetch('/api/form-config');
          if (!res.ok) { this.error = 'Could not load the form settings (' + res.status + ').'; return; }
          const data = await res.json();
          this.fields = data.fields; this.changes = data.changes; this.settings = data.settings; this.secretSet = data.turnstileSecretSet;
        } catch (e) {
          // an expired Access session redirects the fetch to the login page, which fails here
          this.error = 'Could not load the form settings. Reload the page (you may need to sign in again).';
        }
      },
      // every save reloads from the server, so a refused change snaps the controls back to what is stored
      async post(url, body) {
        this.busy = true; this.error = ''; this.notice = '';
        try {
          const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) { this.error = data.message || 'Save failed (' + res.status + ').'; return false; }
          this.notice = 'Saved. Every visitor sees the change within 60 seconds.';
          return true;
        } catch (e) {
          this.error = 'Network error; nothing was saved.';
          return false;
        } finally {
          this.busy = false;
          await this.load();
        }
      },
      save(key, change) { return this.post('/api/form-config/fields/' + encodeURIComponent(key), change); },
      edit(f) {
        this.editing = f.key;
        this.draft = { label: f.label, placeholder: f.placeholder, newOption: '',
          options: f.options && !f.locked ? f.options.map(o => ({ value: o.value, active: o.active })) : null };
      },
      addOption() {
        const value = this.draft.newOption.trim();
        if (value && !this.draft.options.some(o => o.value === value)) this.draft.options.push({ value, active: true });
        this.draft.newOption = '';
      },
      async saveDraft(f) {
        const change = { label: this.draft.label, placeholder: this.draft.placeholder };
        if (this.draft.options) change.options = this.draft.options;
        if (await this.save(f.key, change)) this.editing = null;
      },
      async addField() {
        const body = { label: this.newField.label, type: this.newField.type, required: this.newField.required };
        if (this.newField.type === 'select' || this.newField.type === 'checkboxes') {
          body.options = this.newField.options.split('\\n').map(s => s.trim()).filter(Boolean);
        }
        if (await this.post('/api/form-config/fields', body)) this.newField = { label: '', type: 'text', options: '', required: false };
      },
      saveSettings() {
        return this.post('/api/form-config/settings', { turnstileEnabled: this.settings.turnstileEnabled, turnstileSiteKey: this.settings.turnstileSiteKey });
      },
      when(at) { return new Date(at).toLocaleString(); },
    };
  }
</script>`;

export function renderFormSettingsPage(): string {
  const content = `
  ${script}
  <div class="min-h-screen" x-data="formAdmin()" x-init="load()">

    <nav class="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
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
            <a href="/admin/form" class="text-sm text-[#2BDE73] font-medium" data-testid="link-admin-form">Form</a>
            <span class="text-white/10">|</span>
            <a href="/cdn-cgi/access/logout" class="text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors" data-testid="link-admin-logout">Logout</a>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 class="text-3xl font-semibold text-white" data-testid="heading-form-settings">Form settings</h1>
        <p class="text-[var(--text-muted)] mt-1">The contact form on the home page and /contact. Every change is logged below.</p>
      </div>

      <div x-show="error" x-cloak x-text="error" role="alert" class="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm" data-testid="text-form-error"></div>
      <div x-show="notice" x-cloak x-text="notice" class="p-4 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 text-[var(--accent)] text-sm"></div>

      <div class="glass-card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left" data-testid="table-form-fields">
            <thead>
              <tr class="border-b border-white/5 text-[var(--text-muted)] text-xs uppercase tracking-wider">
                <th class="py-3 px-4 font-medium">Field</th>
                <th class="py-3 px-4 font-medium">Type</th>
                <th class="py-3 px-4 font-medium">Visible</th>
                <th class="py-3 px-4 font-medium">Required</th>
                <th class="py-3 px-4 font-medium">Order</th>
                <th class="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <template x-for="f in fields" :key="f.key">
              <tbody class="border-b border-white/5">
                <tr :class="f.visible ? '' : 'opacity-50'" :data-testid="'field-row-' + f.key">
                  <td class="py-3 px-4">
                    <span class="text-white" x-text="f.label"></span>
                    <span x-show="f.locked" title="Always shown and required">${LOCK_ICON}</span>
                    <span x-show="f.custom" class="text-xs text-[var(--text-muted)] ml-1">custom</span>
                  </td>
                  <td class="py-3 px-4 text-sm text-[var(--text-muted)]" x-text="f.type"></td>
                  <td class="py-3 px-4">
                    <input type="checkbox" class="toggle toggle-sm toggle-success" :checked="f.visible" :disabled="f.locked || busy"
                           @change="save(f.key, { visible: $event.target.checked })" :data-testid="'toggle-visible-' + f.key" />
                  </td>
                  <td class="py-3 px-4">
                    <input type="checkbox" class="toggle toggle-sm toggle-success" :checked="f.required" :disabled="f.locked || busy"
                           @change="save(f.key, { required: $event.target.checked })" :data-testid="'toggle-required-' + f.key" />
                  </td>
                  <td class="py-3 px-4">
                    <input type="number" min="0" class="glass-input w-20 px-2 py-1 text-sm" :value="f.order" :disabled="f.locked || busy"
                           @change="$event.target.value === '' ? load() : save(f.key, { order: Number($event.target.value) })" :data-testid="'input-order-' + f.key" />
                  </td>
                  <td class="py-3 px-4 text-right">
                    <button @click="editing === f.key ? editing = null : edit(f)" class="text-sm text-[var(--accent)] hover:text-[var(--accent-dark)] transition-colors"
                            :data-testid="'button-edit-' + f.key" x-text="editing === f.key ? 'Close' : 'Edit'"></button>
                  </td>
                </tr>
                <template x-if="editing === f.key">
                  <tr>
                    <td colspan="6" class="px-4 pb-6">
                      <div class="grid sm:grid-cols-2 gap-4">
                        <label class="block">
                          <span class="${FIELD_LABEL}">Label</span>
                          <input type="text" x-model="draft.label" maxlength="120" class="glass-input w-full px-4 py-2 text-sm" data-testid="input-edit-label" />
                        </label>
                        <label class="block">
                          <span class="${FIELD_LABEL}">Placeholder</span>
                          <input type="text" x-model="draft.placeholder" maxlength="120" class="glass-input w-full px-4 py-2 text-sm" data-testid="input-edit-placeholder" />
                        </label>
                      </div>
                      <div x-show="draft.options" class="mt-4">
                        <span class="${FIELD_LABEL}">Options <span class="text-[var(--text-muted)] font-normal">(retired options leave the form but stay valid for past and cached submissions)</span></span>
                        <div class="flex flex-wrap gap-2">
                          <template x-for="o in draft.options || []" :key="o.value">
                            <span class="glass-input flex items-center gap-2 px-3 py-1.5 text-sm">
                              <span x-text="o.value" :class="o.active ? 'text-white' : 'line-through text-[var(--text-muted)]'"></span>
                              <button type="button" @click="o.active = !o.active" class="text-xs text-[var(--accent)]" x-text="o.active ? 'Retire' : 'Restore'"></button>
                            </span>
                          </template>
                        </div>
                        <div class="flex gap-2 mt-3">
                          <input type="text" x-model="draft.newOption" maxlength="100" placeholder="New option" @keydown.enter.prevent="addOption()"
                                 class="glass-input px-3 py-1.5 text-sm" data-testid="input-new-option" />
                          <button type="button" @click="addOption()" class="glass-btn-outline text-sm px-4">Add option</button>
                        </div>
                      </div>
                      <div class="flex items-center gap-4 mt-4">
                        <button @click="saveDraft(f)" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-save-field">Save</button>
                        <button @click="editing = null" class="text-sm text-[var(--text-muted)] hover:text-white transition-colors">Cancel</button>
                      </div>
                    </td>
                  </tr>
                </template>
              </tbody>
            </template>
          </table>
        </div>
      </div>

      <div class="grid lg:grid-cols-2 gap-8">
        <div class="glass-card p-6 space-y-4" data-testid="panel-add-field">
          <div>
            <h2 class="text-lg font-semibold text-white">Add custom field</h2>
            <p class="text-sm text-[var(--text-muted)] mt-1">Shown after the built-in fields, before Message. Up to 20. Fields can be hidden but not deleted, so past answers keep their label.</p>
          </div>
          <label class="block">
            <span class="${FIELD_LABEL}">Label</span>
            <input type="text" x-model="newField.label" maxlength="120" class="glass-input w-full px-4 py-2 text-sm" data-testid="input-new-field-label" />
          </label>
          <label class="block">
            <span class="${FIELD_LABEL}">Type</span>
            <select x-model="newField.type" class="glass-select w-full" data-testid="select-new-field-type">
              <option value="text">Short text</option>
              <option value="textarea">Long text</option>
              <option value="select">Dropdown</option>
              <option value="checkboxes">Checkboxes</option>
            </select>
          </label>
          <label class="block" x-show="newField.type === 'select' || newField.type === 'checkboxes'">
            <span class="${FIELD_LABEL}">Options <span class="text-[var(--text-muted)] font-normal">(one per line)</span></span>
            <textarea x-model="newField.options" rows="4" class="glass-input w-full px-4 py-2 text-sm resize-none" data-testid="textarea-new-field-options"></textarea>
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" x-model="newField.required" class="checkbox checkbox-sm checkbox-success" />
            <span class="text-sm text-white/60">Required</span>
          </label>
          <button @click="addField()" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-add-field">Add field</button>
        </div>

        <div class="glass-card p-6 space-y-4" data-testid="panel-turnstile">
          <div>
            <h2 class="text-lg font-semibold text-white">Bot check (Cloudflare Turnstile)</h2>
            <p class="text-sm text-[var(--text-muted)] mt-1">When on, the contact form shows a Turnstile check and the server verifies it before saving the lead. If Cloudflare can't be reached the lead is still saved, marked "Bot check: unverified".</p>
          </div>
          <div class="text-sm text-white/60">
            Worker secret <code>TURNSTILE_SECRET</code>:
            <span x-text="secretSet ? 'set' : 'missing'" :class="secretSet ? 'text-[var(--accent)]' : 'text-amber-400'" data-testid="text-secret-status"></span>
          </div>
          <label class="block">
            <span class="${FIELD_LABEL}">Site key</span>
            <input type="text" x-model="settings.turnstileSiteKey" maxlength="100" placeholder="0x4AAAAAAA..." class="glass-input w-full px-4 py-2 text-sm" data-testid="input-site-key" />
          </label>
          <label class="flex items-center gap-3">
            <input type="checkbox" x-model="settings.turnstileEnabled" class="toggle toggle-sm toggle-success" data-testid="toggle-turnstile" />
            <span class="text-sm text-white/60">On</span>
          </label>
          <button @click="saveSettings()" :disabled="busy" class="glass-btn text-sm px-5 py-2 disabled:opacity-50" data-testid="button-save-turnstile">Save</button>
        </div>
      </div>

      <div class="glass-card p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Recent changes</h2>
        <ul class="divide-y divide-white/5" data-testid="list-form-changes">
          <template x-for="ch in changes" :key="ch.id">
            <li class="py-3 text-sm grid sm:grid-cols-[200px_220px_1fr] gap-2">
              <span class="text-[var(--text-muted)]" x-text="when(ch.at)"></span>
              <span class="text-white/60 truncate" x-text="ch.actor"></span>
              <span class="text-white/80 truncate" x-text="ch.target + ': ' + ch.after" :title="'before: ' + (ch.before ?? '(default)')"></span>
            </li>
          </template>
          <li x-show="!changes.length" class="py-3 text-sm text-[var(--text-muted)]">No changes yet.</li>
        </ul>
      </div>
    </div>
  </div>`;

  return renderLayout({
    title: "Form settings - HBDR Admin",
    description: "HBDR Admin - Contact form settings",
    canonicalPath: "/admin/form",
    bodyContent: content,
    adminPage: true,
  });
}
