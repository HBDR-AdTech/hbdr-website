import { renderLayout } from "../layout";
import { renderBlueprintHero, renderEyebrow, renderActions, renderSection, renderFeatureRows } from "../components/blueprint";

function renderToolCard(id: string, title: string, description: string, alpineData: string, inputs: string, outputs: string): string {
  return `
  <div class="bp-frame calc" data-testid="tool-${id}" x-data="${alpineData}">
    <div class="calc-head">
      <h2 data-testid="title-${id}">${title}</h2>
      <p>${description}</p>
    </div>

    <div class="calc-grid">
      <div class="calc-inputs">
        <div class="calc-label mono">Inputs</div>
        ${inputs}
      </div>

      <div class="calc-results">
        <div class="calc-label mono">Estimated Results</div>
        ${outputs}
      </div>
    </div>
  </div>`;
}

function renderSliderInput(model: string, label: string, min: string, max: string, step: string, unit: string, tooltip: string): string {
  return `
  <div data-testid="input-${model}">
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        ${label}
        <span class="cursor-help text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="${tooltip}">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
      </label>
      <span class="mono text-[var(--text-primary)]" x-text="Number(${model}).toLocaleString() + '${unit}'"></span>
    </div>
    <input type="range" aria-label="${label}" x-model.number="${model}" min="${min}" max="${max}" step="${step}" class="calc-range" />
  </div>`;
}

function renderSelectInput(model: string, label: string, options: {value: string, label: string}[], tooltip: string): string {
  const optionsHtml = options.map(o => `<option value="${o.value}">${o.label}</option>`).join('');
  return `
  <div data-testid="input-${model}">
    <div class="flex items-center justify-between mb-2">
      <label class="text-sm text-[var(--text-secondary)] flex items-center gap-1.5">
        ${label}
        <span class="cursor-help text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors" title="${tooltip}">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        </span>
      </label>
    </div>
    <select aria-label="${label}" x-model="${model}" class="glass-select w-full">
      ${optionsHtml}
    </select>
  </div>`;
}

function renderOutputMetric(label: string, value: string, highlight: boolean = false): string {
  return `
  <div class="calc-metric${highlight ? " is-key" : ""}" data-testid="output-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}">
    <div class="calc-metric-label">${label}</div>
    <div class="calc-metric-value" x-text="${value}"></div>
  </div>`;
}

function renderHbdrUplift(currentExpr: string, projectedExpr: string, fmtFn: string): string {
  return `
  <div class="calc-uplift">
    <div class="calc-label mono">HBDR Uplift Projection</div>
    <div class="calc-uplift-row">
      <div>
        <div class="calc-metric-label">Current Revenue</div>
        <div class="calc-uplift-from" x-text="${fmtFn}(${currentExpr})"></div>
      </div>
      <div class="calc-uplift-arrow" aria-hidden="true">
        <svg viewBox="0 0 64 12"><path class="bp-line" d="M2 6 H60"/><path class="bp-tick" d="M2 1 V11"/><path d="M54 1 L61 6 L54 11" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
        <span class="mono">+35%</span>
      </div>
      <div>
        <div class="calc-metric-label">With HBDR</div>
        <div class="calc-uplift-to" x-text="${fmtFn}(${projectedExpr})"></div>
      </div>
    </div>
  </div>`;
}

export function renderPublisherToolsPage(): string {
  const content = `
  ${renderBlueprintHero({
    testid: "tools-hero",
    eyebrow: "Publisher Tools",
    title: "Revenue Calculators",
    lede: "Model ad revenue for display, header bidding, video, in-app and CTV/OTT. Each calculator multiplies your traffic by a fill rate and a CPM you set. The formulas are written out below the calculators.",
  })}

  <!-- Tab Navigation + Calculators -->
  <section class="bp-section bp-section-tight" data-testid="tools-calculators" x-data="{ activeCalc: 'display' }">
    <div class="bp-wrap">

      <!-- Tab Buttons -->
      <div class="calc-tabs" data-testid="tools-nav">
        <button @click="activeCalc = 'display'"
          :class="activeCalc === 'display' ? 'is-active' : ''"
          class="calc-tab" data-testid="tab-display">
          Display Revenue
        </button>
        <button @click="activeCalc = 'hb'"
          :class="activeCalc === 'hb' ? 'is-active' : ''"
          class="calc-tab" data-testid="tab-hb">
          Header Bidding Uplift
        </button>
        <button @click="activeCalc = 'video'"
          :class="activeCalc === 'video' ? 'is-active' : ''"
          class="calc-tab" data-testid="tab-video">
          Video Player
        </button>
        <button @click="activeCalc = 'inapp'"
          :class="activeCalc === 'inapp' ? 'is-active' : ''"
          class="calc-tab" data-testid="tab-inapp">
          In-App Ads
        </button>
        <button @click="activeCalc = 'ctv'"
          :class="activeCalc === 'ctv' ? 'is-active' : ''"
          class="calc-tab" data-testid="tab-ctv">
          CTV / OTT
        </button>
      </div>

      <!-- ===== 1. DISPLAY AD REVENUE CALCULATOR ===== -->
      <div x-show="activeCalc === 'display'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" data-testid="section-display-calc">
        ${renderToolCard(
          'display',
          'Display Ad Revenue Calculator',
          'Estimate your website display ad revenue based on traffic, ad density, fill rate, CPMs, and market factors like geo, device, vertical, and seasonality.',
          `{
            pageviews: 500000,
            adSlots: 4,
            fillRate: 85,
            viewability: 65,
            baseCpm: 2.50,
            geoMix: 'us',
            deviceSplit: '50-50',
            vertical: 'general',
            season: 'q2',
            get geoMultiplier() { return {us:1, eu:0.75, mixed:0.85, row:0.4}[this.geoMix] || 1 },
            get deviceMultiplier() { return {desktop:1.2, mobile:0.8, '50-50':1.0}[this.deviceSplit] || 1 },
            get verticalMultiplier() { return {finance:2.5, tech:1.8, health:1.6, news:1.2, entertainment:0.9, general:0.7}[this.vertical] || 1 },
            get seasonMultiplier() { return {q1:0.85, q2:1.0, q3:0.95, q4:1.3}[this.season] || 1 },
            get adjustedCpm() { return this.baseCpm * this.geoMultiplier * this.deviceMultiplier * this.verticalMultiplier * this.seasonMultiplier },
            get impressions() { return this.pageviews * this.adSlots },
            get filledImpressions() { return this.impressions * (this.fillRate / 100) },
            get viewableImpressions() { return this.filledImpressions * (this.viewability / 100) },
            get monthlyRevenue() { return (this.filledImpressions / 1000) * this.adjustedCpm },
            get rpm() { return this.pageviews > 0 ? (this.monthlyRevenue / this.pageviews) * 1000 : 0 },
            get effectiveEcpm() { return this.impressions > 0 ? (this.monthlyRevenue / this.impressions) * 1000 : 0 },
            fmt(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') },
            fmtN(n) { return n.toLocaleString() }
          }`,
          [
            renderSliderInput('pageviews', 'Monthly Pageviews', '10000', '10000000', '10000', '', 'Total monthly pageviews on your site'),
            renderSliderInput('adSlots', 'Ad Slots per Page', '1', '10', '1', '', 'Number of ad units displayed on each page'),
            renderSliderInput('fillRate', 'Fill Rate', '20', '100', '1', '%', 'Percentage of ad requests that return a paid ad'),
            renderSliderInput('viewability', 'Viewability Rate', '20', '100', '1', '%', 'Share of filled ads that meet the MRC viewable standard: 50% of pixels in view for 1 continuous second. Shown as viewable impressions; it does not change revenue in this model.'),
            renderSliderInput('baseCpm', 'Base CPM', '0.50', '15.00', '0.10', '', 'Your average CPM before the geo, device, vertical and season multipliers.'),
            renderSelectInput('geoMix', 'Geo Mix', [
              {value: 'us', label: 'US (1.0x)'},
              {value: 'eu', label: 'EU (0.75x)'},
              {value: 'mixed', label: 'Mixed (0.85x)'},
              {value: 'row', label: 'ROW (0.4x)'},
            ], 'Illustrative multiplier for where your visitors are.'),
            renderSelectInput('deviceSplit', 'Device Split', [
              {value: 'desktop', label: 'Desktop (1.2x)'},
              {value: 'mobile', label: 'Mobile (0.8x)'},
              {value: '50-50', label: '50-50 (1.0x)'},
            ], 'Illustrative multiplier for your desktop and mobile mix.'),
            renderSelectInput('vertical', 'Vertical', [
              {value: 'finance', label: 'Finance (2.5x)'},
              {value: 'tech', label: 'Tech (1.8x)'},
              {value: 'health', label: 'Health (1.6x)'},
              {value: 'news', label: 'News (1.2x)'},
              {value: 'entertainment', label: 'Entertainment (0.9x)'},
              {value: 'general', label: 'General (0.7x)'},
            ], 'Illustrative multiplier for your content category.'),
            renderSelectInput('season', 'Seasonality', [
              {value: 'q1', label: 'Q1 (0.85x)'},
              {value: 'q2', label: 'Q2 (1.0x)'},
              {value: 'q3', label: 'Q3 (0.95x)'},
              {value: 'q4', label: 'Q4 (1.3x)'},
            ], 'Illustrative multiplier for the quarter you are modelling.'),
          ].join(''),
          `
          <div class="space-y-6">
            ${renderOutputMetric('Estimated Monthly Revenue', "fmt(monthlyRevenue)", true)}
            <div class="calc-rule"></div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Adjusted CPM', "fmt(adjustedCpm)")}
              ${renderOutputMetric('Page RPM', "fmt(rpm)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Effective eCPM', "fmt(effectiveEcpm)")}
              ${renderOutputMetric('Total Impressions', "fmtN(impressions)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Filled Impressions', "fmtN(filledImpressions)")}
              ${renderOutputMetric('Viewable Impressions', "fmtN(viewableImpressions)")}
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Estimated Annual Revenue', "fmt(monthlyRevenue * 12)", true)}
            <div class="calc-rule"></div>
            ${renderHbdrUplift('monthlyRevenue', 'monthlyRevenue * 1.35', 'fmt')}
            <p class="text-xs text-[var(--text-muted)] mt-4 text-center">Multipliers are illustrative assumptions, not measured benchmarks. Actual results vary.</p>
          </div>`
        )}
      </div>

      <!-- ===== 2. HEADER BIDDING UPLIFT CALCULATOR ===== -->
      <div x-show="activeCalc === 'hb'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" data-testid="section-hb-calc">
        ${renderToolCard(
          'hb-uplift',
          'Header Bidding Uplift Calculator',
          'See how switching from a traditional waterfall to header bidding with HBDR can boost your revenue. Compare side by side.',
          `{
            monthlyImpressions: 2000000,
            currentCpm: 1.80,
            currentFill: 70,
            hbUpliftPct: 40,
            hbFillBoost: 15,
            demandPartners: 15,
            timeout: 1000,
            currentMethod: 'adsense',
            geoMix: 'us',
            get geoMultiplier() { return {us:1, eu:0.75, mixed:0.85, row:0.4}[this.geoMix] || 1 },
            get partnerMultiplier() { return Math.min(1.5, 0.7 + 0.3 * Math.log(this.demandPartners / 5) / Math.log(10)) },
            get methodMultiplier() { return {adsense:1.0, singlessp:0.7, waterfall:0.5}[this.currentMethod] || 1 },
            get bidShare() { return Math.min(1, Math.max(0, (this.timeout - 100) / 1100)) },
            get impressionsKept() { return Math.max(0, 1 - 0.02 * Math.max(0, this.timeout - 300) / 100) },
            get effectiveUpliftPct() { return this.hbUpliftPct * this.partnerMultiplier * this.methodMultiplier * this.bidShare },
            get currentRevenue() { return (this.monthlyImpressions / 1000) * (this.currentCpm * this.geoMultiplier) * (this.currentFill / 100) },
            get hbCpm() { return (this.currentCpm * this.geoMultiplier) * (1 + this.effectiveUpliftPct / 100) },
            get hbFill() { return Math.min(100, this.currentFill + this.hbFillBoost * this.bidShare) },
            get hbRevenue() { return (this.monthlyImpressions * this.impressionsKept / 1000) * this.hbCpm * (this.hbFill / 100) },
            get upliftAmount() { return this.hbRevenue - this.currentRevenue },
            get upliftPercent() { return this.currentRevenue > 0 ? ((this.hbRevenue - this.currentRevenue) / this.currentRevenue) * 100 : 0 },
            fmt(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') },
            fmtPct(n) { return n.toFixed(1) + '%' }
          }`,
          [
            renderSliderInput('monthlyImpressions', 'Monthly Impressions', '100000', '50000000', '100000', '', 'Total ad impressions served per month'),
            renderSliderInput('currentCpm', 'Current Average CPM', '0.50', '10.00', '0.10', '', 'Your current average CPM with waterfall or existing setup'),
            renderSliderInput('currentFill', 'Current Fill Rate', '30', '100', '1', '%', 'Your current ad fill rate percentage'),
            renderSliderInput('hbUpliftPct', 'Expected CPM Uplift', '10', '80', '5', '%', 'Your assumption for how much CPMs rise when more buyers bid in one auction. The model scales it by the partner and current-method factors.'),
            renderSliderInput('hbFillBoost', 'Fill Rate Improvement', '0', '30', '1', '%', 'Your assumption for the extra fill, in percentage points, from more competing buyers. Projected fill is capped at 100%.'),
            renderSliderInput('demandPartners', 'Demand Partners', '5', '50', '1', '', 'Demand partners in the wrapper. The model scales the uplift from 0.7x at 5 partners to 1.0x at 50, on a logarithmic curve.'),
            renderSliderInput('timeout', 'Timeout', '200', '3000', '100', 'ms', 'How long bidders get before the ad server is called. Longer catches more bids (the model assumes they arrive evenly from 100 to 1,200 ms) but costs 2% of impressions per 100 ms over 300 ms, the same assumption as the home timeout explorer.'),
            renderSelectInput('currentMethod', 'Current Method', [
              {value: 'adsense', label: 'AdSense Only (1.0x)'},
              {value: 'singlessp', label: 'Single SSP (0.7x)'},
              {value: 'waterfall', label: 'Waterfall (0.5x)'},
            ], 'Illustrative factor that scales the uplift by how you sell today.'),
            renderSelectInput('geoMix', 'Geo CPM Mix', [
              {value: 'us', label: 'US (1.0x)'},
              {value: 'eu', label: 'EU (0.75x)'},
              {value: 'mixed', label: 'Mixed (0.85x)'},
              {value: 'row', label: 'ROW (0.4x)'},
            ], 'Illustrative multiplier for where your visitors are.'),
          ].join(''),
          `
          <div class="space-y-6">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <div class="text-xs text-[var(--text-muted)] mb-1">Current Monthly Revenue</div>
                <div class="calc-uplift-from line-through" x-text="fmt(currentRevenue)"></div>
              </div>
              <div>
                <div class="text-xs text-[var(--text-muted)] mb-1">With Header Bidding</div>
                <div class="calc-uplift-to" x-text="fmt(hbRevenue)"></div>
              </div>
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Additional Monthly Revenue', "'+' + fmt(upliftAmount)", true)}
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Revenue Uplift', "fmtPct(upliftPercent)")}
              ${renderOutputMetric('New Effective CPM', "fmt(hbCpm)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Bids In Time', "fmtPct(bidShare * 100)")}
              ${renderOutputMetric('Impressions Kept', "fmtPct(impressionsKept * 100)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Current Fill Rate', "fmtPct(currentFill)")}
              ${renderOutputMetric('Projected Fill Rate', "fmtPct(hbFill)")}
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Additional Annual Revenue', "'+' + fmt(upliftAmount * 12)", true)}
            <div class="calc-rule"></div>
            ${renderHbdrUplift('hbRevenue', 'hbRevenue * 1.35', 'fmt')}
            <p class="text-xs text-[var(--text-muted)] mt-4 text-center">Multipliers are illustrative assumptions, not measured benchmarks. Actual results vary.</p>
          </div>`
        )}
      </div>

      <!-- ===== 3. VIDEO PLAYER MONETIZATION CALCULATOR ===== -->
      <div x-show="activeCalc === 'video'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" data-testid="section-video-calc">
        ${renderToolCard(
          'video',
          'Video Player Revenue Calculator',
          'Estimate your video ad revenue across pre-roll, mid-roll, and post-roll placements. Factor in content type, player position, and VAST version.',
          `{
            videoStarts: 300000,
            adPodsPerVideo: 2,
            adsPerPod: 2,
            videoFillRate: 75,
            completionRate: 70,
            videoCpm: 12.00,
            contentType: 'long',
            playerPosition: 'preroll',
            vastVersion: '3.0',
            get contentMultiplier() { return {short:0.7, long:1.3, live:1.5}[this.contentType] || 1 },
            get positionMultiplier() { return {preroll:1.0, inarticle:0.8, sticky:1.2}[this.playerPosition] || 1 },
            get vastMultiplier() { return {'2.0':0.8, '3.0':1.0, '4.x':1.15}[this.vastVersion] || 1 },
            get adjustedVideoCpm() { return this.videoCpm * this.contentMultiplier * this.positionMultiplier * this.vastMultiplier },
            get totalAdSlots() { return this.videoStarts * this.adPodsPerVideo * this.adsPerPod },
            get filledAds() { return this.totalAdSlots * (this.videoFillRate / 100) },
            get completedAds() { return this.filledAds * (this.completionRate / 100) },
            get monthlyRevenue() { return (this.completedAds / 1000) * this.adjustedVideoCpm },
            get effectiveCpmPerStart() { return this.videoStarts > 0 ? (this.monthlyRevenue / this.videoStarts) * 1000 : 0 },
            get revenuePerStart() { return this.videoStarts > 0 ? this.monthlyRevenue / this.videoStarts : 0 },
            fmt(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') },
            fmtN(n) { return n.toLocaleString() }
          }`,
          [
            renderSliderInput('videoStarts', 'Monthly Video Starts', '10000', '5000000', '10000', '', 'Total number of video plays initiated per month'),
            renderSliderInput('adPodsPerVideo', 'Ad Breaks per Video', '1', '5', '1', '', 'Number of ad breaks (pre-roll, mid-roll, post-roll) per video'),
            renderSliderInput('adsPerPod', 'Ads per Break', '1', '4', '1', '', 'Number of ad slots in each ad break/pod'),
            renderSliderInput('videoFillRate', 'Video Fill Rate', '30', '100', '1', '%', 'Percentage of VAST ad requests that return a creative'),
            renderSliderInput('completionRate', 'Ad Completion Rate (VTR)', '30', '100', '1', '%', 'Percentage of video ads watched to completion (view-through rate)'),
            renderSliderInput('videoCpm', 'Base Video CPM', '3.00', '35.00', '0.50', '', 'Your CPM for completed ad views before the content, position and VAST multipliers.'),
            renderSelectInput('contentType', 'Content Type', [
              {value: 'short', label: 'Short-form (0.7x)'},
              {value: 'long', label: 'Long-form (1.3x)'},
              {value: 'live', label: 'Live (1.5x)'},
            ], 'Illustrative multiplier for the kind of video you publish.'),
            renderSelectInput('playerPosition', 'Player Position', [
              {value: 'preroll', label: 'Pre-roll (1.0x)'},
              {value: 'inarticle', label: 'In-article (0.8x)'},
              {value: 'sticky', label: 'Sticky (1.2x)'},
            ], 'Illustrative multiplier for where the player sits on the page.'),
            renderSelectInput('vastVersion', 'VAST Version', [
              {value: '2.0', label: 'VAST 2.0 (0.8x)'},
              {value: '3.0', label: 'VAST 3.0 (1.0x)'},
              {value: '4.x', label: 'VAST 4.x (1.15x)'},
            ], 'VAST 4.1 added Open Measurement for ad verification and VAST 4.2 added SIMID for interactive ads. The multiplier is illustrative.'),
          ].join(''),
          `
          <div class="space-y-6">
            ${renderOutputMetric('Estimated Monthly Revenue', "fmt(monthlyRevenue)", true)}
            <div class="calc-rule"></div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Adjusted Video CPM', "fmt(adjustedVideoCpm)")}
              ${renderOutputMetric('Revenue per Start', "fmt(revenuePerStart)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Completed Ad Views', "fmtN(Math.round(completedAds))")}
              ${renderOutputMetric('Total Ad Slots', "fmtN(totalAdSlots)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Filled Ads', "fmtN(Math.round(filledAds))")}
              ${renderOutputMetric('eCPM per Start', "fmt(effectiveCpmPerStart)")}
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Estimated Annual Revenue', "fmt(monthlyRevenue * 12)", true)}
            <div class="calc-rule"></div>
            ${renderHbdrUplift('monthlyRevenue', 'monthlyRevenue * 1.35', 'fmt')}
            <p class="text-xs text-[var(--text-muted)] mt-4 text-center">Multipliers are illustrative assumptions, not measured benchmarks. Actual results vary.</p>
          </div>`
        )}
      </div>

      <!-- ===== 4. IN-APP AD REVENUE CALCULATOR ===== -->
      <div x-show="activeCalc === 'inapp'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" data-testid="section-inapp-calc">
        ${renderToolCard(
          'inapp',
          'In-App Ad Revenue Calculator',
          'Project your mobile app ad revenue using DAU, session depth, and ad placement data. Factor in platform, ad format mix, and user engagement.',
          `{
            dau: 50000,
            sessionsPerUser: 3,
            adsPerSession: 4,
            inappFillRate: 80,
            inappEcpm: 5.00,
            platform: 'both',
            adFormat: 'mixed',
            engagement: 'mid',
            get platformMultiplier() { return {ios:1.3, android:0.8, both:1.0}[this.platform] || 1 },
            get formatMultiplier() { return {banners:0.5, interstitials:1.5, rewarded:2.5, mixed:1.0}[this.adFormat] || 1 },
            get engagementMultiplier() { return {casual:0.7, mid:1.0, hardcore:1.4}[this.engagement] || 1 },
            get adjustedEcpm() { return this.inappEcpm * this.platformMultiplier * this.formatMultiplier * this.engagementMultiplier },
            get monthlyActiveUsers() { return Math.round(this.dau * 3.2) },
            get dailyImpressions() { return this.dau * this.sessionsPerUser * this.adsPerSession },
            get monthlyImpressions() { return this.dailyImpressions * 30 },
            get filledImpressions() { return this.monthlyImpressions * (this.inappFillRate / 100) },
            get dailyRevenue() { return (this.dailyImpressions * (this.inappFillRate / 100) / 1000) * this.adjustedEcpm },
            get monthlyRevenue() { return this.dailyRevenue * 30 },
            get arpdau() { return this.dau > 0 ? this.dailyRevenue / this.dau : 0 },
            fmt(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') },
            fmtN(n) { return n.toLocaleString() }
          }`,
          [
            renderSliderInput('dau', 'Daily Active Users (DAU)', '1000', '1000000', '1000', '', 'Average number of unique users who open your app daily'),
            renderSliderInput('sessionsPerUser', 'Sessions per User/Day', '1', '10', '1', '', 'Average number of app sessions each user has per day'),
            renderSliderInput('adsPerSession', 'Ad Impressions per Session', '1', '15', '1', '', 'Number of ads shown per session (banners, interstitials, rewarded)'),
            renderSliderInput('inappFillRate', 'Fill Rate', '30', '100', '1', '%', 'Percentage of ad requests filled by demand partners'),
            renderSliderInput('inappEcpm', 'Base eCPM', '0.50', '30.00', '0.50', '', 'Your blended eCPM before the platform, format and engagement multipliers.'),
            renderSelectInput('platform', 'Platform', [
              {value: 'ios', label: 'iOS (1.3x)'},
              {value: 'android', label: 'Android (0.8x)'},
              {value: 'both', label: 'Both (1.0x)'},
            ], 'Illustrative multiplier for your iOS and Android mix.'),
            renderSelectInput('adFormat', 'Ad Format Mix', [
              {value: 'banners', label: 'Banners (0.5x)'},
              {value: 'interstitials', label: 'Interstitials (1.5x)'},
              {value: 'rewarded', label: 'Rewarded (2.5x)'},
              {value: 'mixed', label: 'Mixed (1.0x)'},
            ], 'Illustrative multiplier for your ad format mix.'),
            renderSelectInput('engagement', 'Engagement Tier', [
              {value: 'casual', label: 'Casual (0.7x)'},
              {value: 'mid', label: 'Mid-Core (1.0x)'},
              {value: 'hardcore', label: 'Hardcore (1.4x)'},
            ], 'Illustrative multiplier for how engaged your users are.'),
          ].join(''),
          `
          <div class="space-y-6">
            ${renderOutputMetric('Estimated Monthly Revenue', "fmt(monthlyRevenue)", true)}
            <div class="calc-rule"></div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Adjusted eCPM', "fmt(adjustedEcpm)")}
              ${renderOutputMetric('ARPDAU', "fmt(arpdau)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Daily Revenue', "fmt(dailyRevenue)")}
              ${renderOutputMetric('Monthly Impressions', "fmtN(monthlyImpressions)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Filled Impressions', "fmtN(filledImpressions)")}
              ${renderOutputMetric('Estimated MAU', "fmtN(monthlyActiveUsers)")}
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Estimated Annual Revenue', "fmt(monthlyRevenue * 12)", true)}
            <div class="calc-rule"></div>
            ${renderHbdrUplift('monthlyRevenue', 'monthlyRevenue * 1.35', 'fmt')}
            <p class="text-xs text-[var(--text-muted)] mt-4 text-center">Multipliers are illustrative assumptions, not measured benchmarks. Actual results vary.</p>
          </div>`
        )}
      </div>

      <!-- ===== 5. CTV/OTT REVENUE ESTIMATOR ===== -->
      <div x-show="activeCalc === 'ctv'" x-transition:enter="transition ease-out duration-300" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" data-testid="section-ctv-calc">
        ${renderToolCard(
          'ctv',
          'CTV & OTT Revenue Estimator',
          'Model your Connected TV and OTT streaming ad revenue. Factor in content genre, programmatic vs direct sales mix, and audience targetability.',
          `{
            monthlyStreams: 200000,
            avgStreamMinutes: 25,
            adBreakFrequency: 8,
            adsPerBreak: 2,
            ctvFillRate: 70,
            ctvCpm: 25.00,
            genre: 'entertainment',
            programmaticPct: 70,
            targetability: 5,
            get genreMultiplier() { return {news:1.0, sports:1.4, entertainment:1.1, lifestyle:0.9}[this.genre] || 1 },
            get directPremium() { return 1 + (1 - this.programmaticPct / 100) * 0.4 },
            get targetMultiplier() { return 0.7 + (this.targetability * 0.06) },
            get adjustedCtvCpm() { return this.ctvCpm * this.genreMultiplier * this.directPremium * this.targetMultiplier },
            get adBreaksPerStream() { return Math.floor(this.avgStreamMinutes / this.adBreakFrequency) },
            get totalAdSlots() { return this.monthlyStreams * this.adBreaksPerStream * this.adsPerBreak },
            get filledAds() { return this.totalAdSlots * (this.ctvFillRate / 100) },
            get monthlyRevenue() { return (this.filledAds / 1000) * this.adjustedCtvCpm },
            get revenuePerStream() { return this.monthlyStreams > 0 ? this.monthlyRevenue / this.monthlyStreams : 0 },
            get adLoadMinutes() { return (this.adBreaksPerStream * this.adsPerBreak * 0.5) },
            get adLoadPct() { return this.avgStreamMinutes > 0 ? (this.adLoadMinutes / this.avgStreamMinutes) * 100 : 0 },
            fmt(n) { return '$' + n.toFixed(2).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') },
            fmtN(n) { return n.toLocaleString() },
            fmtPct(n) { return n.toFixed(1) + '%' }
          }`,
          [
            renderSliderInput('monthlyStreams', 'Monthly Stream Sessions', '10000', '5000000', '10000', '', 'Total number of content streams/views per month'),
            renderSliderInput('avgStreamMinutes', 'Avg Stream Duration (min)', '5', '120', '1', '', 'Average length of a viewing session in minutes'),
            renderSliderInput('adBreakFrequency', 'Minutes Between Ad Breaks', '3', '20', '1', '', 'How often an ad break occurs during content playback'),
            renderSliderInput('adsPerBreak', 'Ads per Break', '1', '5', '1', '', 'Number of ads shown in each commercial break'),
            renderSliderInput('ctvFillRate', 'Fill Rate', '30', '100', '1', '%', 'Percentage of CTV ad requests that are filled with a paid ad'),
            renderSliderInput('ctvCpm', 'Base CTV CPM', '8.00', '50.00', '1.00', '', 'Base CPM for CTV/OTT inventory before adjustments'),
            renderSelectInput('genre', 'Content Genre', [
              {value: 'news', label: 'News (1.0x)'},
              {value: 'sports', label: 'Sports (1.4x)'},
              {value: 'entertainment', label: 'Entertainment (1.1x)'},
              {value: 'lifestyle', label: 'Lifestyle (0.9x)'},
            ], 'Illustrative multiplier for your content genre.'),
            renderSliderInput('programmaticPct', 'Programmatic %', '0', '100', '5', '%', 'Share sold programmatically. The model adds a premium of up to 40% for the direct-sold share, as an assumption.'),
            renderSliderInput('targetability', 'Audience Targetability', '1', '10', '1', '', 'How targetable your audience is (1 = broad, 10 = highly specific). The model multiplies CPM by 0.76x at 1 up to 1.3x at 10.'),
          ].join(''),
          `
          <div class="space-y-6">
            ${renderOutputMetric('Estimated Monthly Revenue', "fmt(monthlyRevenue)", true)}
            <div class="calc-rule"></div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Adjusted CTV CPM', "fmt(adjustedCtvCpm)")}
              ${renderOutputMetric('Revenue per Stream', "fmt(revenuePerStream)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Ad Breaks per Stream', "adBreaksPerStream.toString()")}
              ${renderOutputMetric('Total Ad Slots', "fmtN(totalAdSlots)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Ads Filled', "fmtN(Math.round(filledAds))")}
              ${renderOutputMetric('Est. Ad Load', "fmtPct(adLoadPct)")}
            </div>
            <div class="grid grid-cols-2 gap-4">
              ${renderOutputMetric('Ad Minutes per Stream', "adLoadMinutes.toFixed(1) + ' min'")}
              ${renderOutputMetric('Direct Premium', "fmtPct((directPremium - 1) * 100)")}
            </div>
            <div class="calc-rule"></div>
            ${renderOutputMetric('Estimated Annual Revenue', "fmt(monthlyRevenue * 12)", true)}
            <div class="calc-rule"></div>
            ${renderHbdrUplift('monthlyRevenue', 'monthlyRevenue * 1.35', 'fmt')}
            <p class="text-xs text-[var(--text-muted)] mt-4 text-center">Multipliers are illustrative assumptions, not measured benchmarks. Actual results vary.</p>
          </div>`
        )}
      </div>

    </div>
  </section>

  ${renderSection({
    testid: "tools-metrics-section",
    eyebrow: "Definitions",
    title: "The Metrics",
    lede: "Standard definitions from the ad platforms. Compare like with like: fill rate and match rate are different numbers.",
    body: `
      <div class="bp-table-wrap">
        <table class="bp-table" data-testid="tools-metrics-table">
          <thead><tr><th scope="col">Metric</th><th scope="col">Definition</th><th scope="col">Source</th></tr></thead>
          <tbody>
            <tr><td>Page RPM</td><td>Earnings ÷ pageviews × 1,000</td><td class="mono">Google AdSense Help, RPM</td></tr>
            <tr><td>eCPM</td><td>Earnings ÷ impressions × 1,000</td><td class="mono">Google AdMob Help, Glossary</td></tr>
            <tr><td>Fill rate</td><td>Impressions ÷ ad requests</td><td class="mono">Google Ad Manager Help, sell-through report</td></tr>
            <tr><td>Match rate</td><td>Matched requests ÷ ad requests. Not every matched ad is shown, so match rate can run above fill rate.</td><td class="mono">Google AdMob Help, Reports glossary</td></tr>
            <tr><td>Viewable impression, display</td><td>At least 50% of the ad's pixels in view for at least 1 continuous second; 30% for ads of 242,500 pixels or more</td><td class="mono">MRC Viewable Ad Impression Guidelines</td></tr>
            <tr><td>Viewable impression, video</td><td>At least 50% of the ad's pixels in view for at least 2 continuous seconds</td><td class="mono">MRC Viewable Ad Impression Guidelines</td></tr>
            <tr><td>ARPDAU</td><td>Ad earnings ÷ daily active users</td><td class="mono">Google AdMob Help, Glossary</td></tr>
          </tbody>
        </table>
      </div>`,
  })}

  ${renderSection({
    testid: "tools-formulas-section",
    eyebrow: "Method",
    title: "How Each Calculator Works",
    lede: "Each calculator is a short chain of multiplications, so you can trace any result by hand.",
    body: `
      <div class="bp-table-wrap">
        <table class="bp-table" data-testid="tools-formulas-table">
          <thead><tr><th scope="col">Calculator</th><th scope="col">Monthly revenue</th><th scope="col">Notes</th></tr></thead>
          <tbody>
            <tr><td>Display</td><td>Pageviews × ad slots × fill rate ÷ 1,000 × adjusted CPM</td><td>Adjusted CPM = base CPM × geo × device × vertical × season. Viewability is reported but does not change revenue. Effective eCPM divides revenue by all ad requests, filled or not. Page RPM = revenue ÷ pageviews × 1,000.</td></tr>
            <tr><td>Header bidding</td><td>Impressions × impressions kept ÷ 1,000 × new CPM × projected fill</td><td>Bids in time = (timeout − 100 ms) ÷ 1,100 ms, between 0 and 100%. Impressions kept = 1 − 2% per 100 ms of timeout over 300 ms. New CPM = current CPM × geo × (1 + uplift × partner factor × method factor × bids in time). Projected fill = current fill + improvement × bids in time, capped at 100%. Illustrative assumptions, shared with the home timeout explorer.</td></tr>
            <tr><td>Video</td><td>Starts × breaks × ads per break × fill rate × completion rate ÷ 1,000 × adjusted CPM</td><td>Only completed views earn. Adjusted CPM = base CPM × content × position × VAST version.</td></tr>
            <tr><td>In-app</td><td>DAU × sessions × ads per session × fill rate ÷ 1,000 × adjusted eCPM × 30</td><td>Adjusted eCPM = base eCPM × platform × format × engagement. ARPDAU = daily revenue ÷ DAU. MAU is estimated as DAU × 3.2.</td></tr>
            <tr><td>CTV / OTT</td><td>Streams × breaks per stream × ads per break × fill rate ÷ 1,000 × adjusted CPM</td><td>Breaks per stream = stream minutes ÷ minutes between breaks, rounded down. Adjusted CPM = base CPM × genre × direct premium × targetability. Ad load assumes 30-second ads.</td></tr>
          </tbody>
        </table>
      </div>
      <p class="mono text-xs text-[var(--text-muted)] mt-4">Each calculator also shows an HBDR uplift line: the result × 1.35.</p>`,
  })}

  ${renderSection({
    testid: "tools-context-section",
    eyebrow: "Context",
    title: "What Moves the Numbers",
    lede: "Three things a model leaves out that change real results.",
    body: renderFeatureRows([
      { title: "Auction timeout", body: "The timeout is how long header bidding may run before the ad server is called. Too short and bids are lost; too long and the ad server call comes so late that some visitors have left. If you run Prebid Server, set its timeout to 50–75% of the auction timeout so its bids return in time. Source: Prebid.org, Prebid Timeouts." },
      { title: "Viewability", body: "Viewability is measured against the MRC standard: 50% of pixels for 1 continuous second for display, 2 continuous seconds for video. Ads that load but are never scrolled into view count as served, not viewable. Source: MRC Viewable Ad Impression Guidelines." },
      { title: "Video measurement", body: "VAST 4.1 added ad verification through Open Measurement, and VAST 4.2 added SIMID for interactive ads. VAST 4.3 is the latest release listed by IAB Tech Lab, with a 2024 addendum for CTV. Source: IAB Tech Lab, VAST." },
    ]),
  })}

  <section class="bp-section" data-testid="tools-cta-section">
    <div class="bp-wrap bp-grid12 bp-cta">
      <div class="calc-cta-copy">
        ${renderEyebrow("Ready to Go Beyond Estimates?")}
        <h2>Get Your Personalized Revenue Audit</h2>
        <p>The calculators use the numbers you enter and illustrative multipliers. An audit starts from your own reports instead: ad requests, fill rate, CPM by demand partner and viewability by slot. Our team reviews your inventory, traffic and demand stack and shows where revenue is lost.</p>
      </div>
      <div class="bp-actions">
        ${renderActions([
          { label: "Request a Free Audit", href: "/contact", primary: true, testid: "link-tools-contact" },
          { label: "Learn More for Publishers", href: "/publishers", testid: "link-tools-publishers" },
        ])}
        <p class="calc-cta-note">No commitment required. Results typically delivered within 48 hours.</p>
      </div>
    </div>
  </section>`;

  return renderLayout({
    title: "Publisher Revenue Calculators & Tools - HBDR",
    description: "Free ad revenue calculators for publishers. Estimate display, video, in-app, CTV/OTT ad revenue. Model header bidding uplift and optimize your monetization strategy.",
    canonicalPath: "/tools",
    bodyContent: content,
  });
}
