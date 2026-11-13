// The five posts that predate the weekly backfill, rewritten under D-006 / D-030 row 14.
// Both dev seeds read this list; seed/blog-legacy-rewrite-2026-10-24.sql carries the same text to production D1
// (server/__tests__/blog-legacy.test.ts fails if the two drift). Sources: docs/research/blog-legacy-posts.md.
export interface LegacyPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  tags: string;
  publishedAt: string;
}

export const LEGACY_POSTS: LegacyPost[] = [
  {
    title: "The Future of Header Bidding: Trends to Watch in 2025",
    slug: "future-of-header-bidding-2025",
    excerpt: "Cookies, server-side auctions, page speed and supply chain checks will shape header bidding in 2025. What each trend means and what to do now.",
    content: `<p>Header bidding is a standard part of how publishers sell display ads. The idea has not changed: ask several buyers for bids before the ad server makes its choice. What is changing is the ground under it. Four trends will shape how publishers run header bidding this year, and each one has a clear next step.</p>
<h2>1. Identity that does not depend on Chrome's cookie plans</h2>
<p>Chrome has planned for years to end third-party cookies. When Safari blocked them in March 2020, WebKit wrote that Chrome had "announced that they'll be shipping it by 2022." That did not happen. On July 22, 2024, Google changed course. It proposed that, "instead of deprecating third-party cookies, we would introduce a new experience in Chrome that lets people make an informed choice that applies across their web browsing." Google said it was discussing this new path with regulators. The details are not final.</p>
<p>Other browsers made their call long ago. WebKit wrote that in Safari, "cookies for cross-site resources are now blocked by default across the board." In June 2022 Mozilla announced that Firefox was rolling out Total Cookie Protection by default, which creates "a separate ‘cookie jar’ for each website you visit."</p>
<p>So readers on Safari and Firefox already arrive without the cross-site cookies that bidders rely on, whatever Chrome decides. That matters for revenue. Prebid.org notes that "DSPs are more likely to bid on impressions where they know something about the history of the user."</p>
<p><strong>What to do:</strong> Review your Prebid User ID module setup. Prebid says the module "supports multiple ways of establishing pseudonymous IDs for users," so that "instead of having several exchanges sync IDs with dozens of demand sources, a publisher can choose to integrate with any of a number of ID schemes." Choose ID providers that your buyers read, run them only with valid consent, and compare bid rates on Safari and Firefox with bid rates on Chrome.</p>
<h2>2. More of the auction moves to the server</h2>
<p>Every client-side bidder adds work in the reader's browser. Prebid's guidance is that "client-side implementations typically use 5 – 15 demand partners. Because of the faster processing speeds, server-side will often have more." Prebid Server, the open-source server version, "can reduce latency and improve page load time."</p>
<p>In some places the server is the only option. Prebid notes that a server-side solution "is required in environments that don't have HTML header sections in which to put JavaScript, such as mobiles apps and Accelerated Mobile Pages (AMP) sites."</p>
<p><strong>What to do:</strong> Keep your strongest partners in the browser and test a move of the long tail to the server. Server-side bidders recognize users through cookie syncing, so watch their bid rates after the move.</p>
<h2>3. Page experience keeps tightening</h2>
<p>On March 12, 2024, Interaction to Next Paint (INP) replaced First Input Delay as a Core Web Vital. Google's target is an INP of 200 milliseconds or less. INP looks at "the latency of all click, tap, and keyboard interactions that occur throughout the lifespan of a user's visit to a page." It does not stop at page load. Header bidding code, ad rendering and ad refresh all run in the same browser as your content, for the whole visit.</p>
<p><strong>What to do:</strong> Check INP in field data from real visitors, not only in lab tests. If INP is poor on templates with many ad slots, test fewer client-side bidders, later loading of slots below the fold, or a move of some bidders to the server.</p>
<h2>4. Buyers can check the supply chain</h2>
<p>Buyers have standard tools to check where an impression came from and who sold it. ads.txt, in IAB Tech Lab's words, lets publishers "publicly declare the companies they authorize to sell their digital inventory." sellers.json lets buyers see who the direct sellers and intermediaries are. The SupplyChain object, carried in the bid request, "enables buyers to see all parties who are selling or reselling a given bid request." The OpenRTB Working Group finalized sellers.json and the SupplyChain object on July 31, 2019.</p>
<p><strong>What to do:</strong> Compare your ads.txt with your active partner list every quarter. Remove lines for partners you no longer use and resellers you cannot identify. Every extra seller in the chain is one more party a buyer has to trust.</p>
<h2>What stays the same</h2>
<p>The goal of header bidding is the same as it was: more competition for each impression, decided fairly and fast. The work for 2025 is to keep the wrapper lean, the identity setup current and the supply chain files clean.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://privacysandbox.com/news/privacy-sandbox-update/">Google, "A new path for Privacy Sandbox on the web" (July 22, 2024)</a></li>
<li><a href="https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/">WebKit, "Full Third-Party Cookie Blocking and More" (March 2020)</a></li>
<li><a href="https://blog.mozilla.org/en/products/firefox/firefox-rolls-out-total-cookie-protection-by-default-to-all-users-worldwide/">Mozilla, "Firefox rolls out Total Cookie Protection by default" (June 14, 2022)</a></li>
<li><a href="https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html">Prebid.org, "pbjs.setConfig: Configure User Syncing"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/modules/userId.html">Prebid.org, "Module: User ID"</a></li>
<li><a href="https://docs.prebid.org/overview/intro.html">Prebid.org, "Introduction to Prebid"</a></li>
<li><a href="https://web.dev/blog/inp-cwv-march-12">web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12" (2024)</a></li>
<li><a href="https://web.dev/articles/vitals">web.dev, "Web Vitals"</a></li>
<li><a href="https://web.dev/articles/inp">web.dev, "Interaction to Next Paint (INP)"</a></li>
<li><a href="https://iabtechlab.com/ads-txt/">IAB Tech Lab, "ads.txt"</a></li>
<li><a href="https://iabtechlab.com/sellers-json/">IAB Tech Lab, "sellers.json"</a></li>
</ul>`,
    author: "HBDR Research",
    category: "Industry Trends",
    tags: "header bidding,identity,prebid server,core web vitals,supply chain",
    publishedAt: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "How Publishers Can Maximize Ad Revenue Without Sacrificing User Experience",
    slug: "maximize-ad-revenue-user-experience",
    excerpt: "Core Web Vitals, ad density limits and lazy loading set the rules. How to fit your ads inside them and keep the impressions you already earn.",
    content: `<p>Every ad slot earns money and costs attention. With too few slots, revenue suffers. With too many, or the wrong kind, the page gets slower and harder to read. The good news is that the limits are written down. Google publishes speed and stability targets, and the Coalition for Better Ads publishes the ad experiences that readers like least. Build your layout inside those limits and you protect the impressions you already have.</p>
<h2>Know the three Core Web Vitals</h2>
<p>Google's web.dev lists three Core Web Vitals and a "good" target for each:</p>
<ul>
<li><strong>Largest Contentful Paint (LCP)</strong> measures loading. "LCP should occur within 2.5 seconds of when the page first starts loading."</li>
<li><strong>Interaction to Next Paint (INP)</strong> measures how fast the page responds to input. The target is that "pages should have a INP of 200 milliseconds or less."</li>
<li><strong>Cumulative Layout Shift (CLS)</strong> measures visual stability. The target is a CLS of 0.1 or less.</li>
</ul>
<p>Google measures each target at "the 75th percentile of page loads, segmented across mobile and desktop devices." So at least three of every four page loads must meet the target. A fast test on office Wi-Fi does not tell you much. Field data from real visitors does.</p>
<p>If your reports still show First Input Delay (FID), they are out of date. INP replaced FID as a Core Web Vital on March 12, 2024.</p>
<h2>Stop ads from pushing content around</h2>
<p>web.dev says it plainly: "Ads are one of the largest contributors to layout shifts on the web." A slot that starts at zero height and grows when the ad arrives pushes the article down. The reader loses their place, and your CLS score goes up.</p>
<p>The fix is to reserve the space before the ad loads. Google's Publisher Tag guide warns that "if you don't reserve sufficient space for the ads being loaded, they can end up displacing visible non-ad content." web.dev suggests a "min-height CSS rule to reserve space." In practice:</p>
<ul>
<li>Give each ad container a minimum height that matches the size it serves most often.</li>
<li>For slots that accept several sizes, use your own delivery data to pick the most likely size.</li>
<li>Take care with slots that collapse when no ad fills them. A slot that changes size after the page shows also moves content. Google's rule: "Slots which are likely to be filled should always start out expanded. Slots which are unlikely to fill should always start out collapsed."</li>
</ul>
<h2>Load ads below the fold when readers get close</h2>
<p>There is no reason to fetch an ad at the end of a long article for a reader who leaves after one paragraph. Google's lazy-loading sample says lazy loading "enables pages to load faster, reduces resource consumption and contention, and improves viewability rate by pausing the requesting and rendering of ads until they approach the user's viewport."</p>
<p>The Google Publisher Tag controls this with two margins. One sets how close a slot must be to the viewport before the tag requests an ad. The other sets how close it must be before the tag renders the ad. Both are percentages of the viewport size. Start with modest margins and test them. If you fetch too late, the slot is still empty when the reader arrives. If you fetch too early, you lose the benefit.</p>
<h2>Respect the density and format limits</h2>
<p>The Coalition for Better Ads built its standards from consumer research into the "least preferred ad experiences." Its mobile web standards list pop-up ads, prestitial ads, ad density higher than 30%, flashing animated ads, auto-playing video ads with sound, postitial ads with countdown, full-screen scrollover ads and large sticky ads.</p>
<p>Ad density has a precise meaning. It is found "by summing the heights of all ads within the main content portion of a mobile page, then dividing by the total height of the main content portion of the page." All ad formats count, sticky ads included. Measure your longest mobile templates with that formula. If ads take more than 30% of the main content's height, remove or space out slots before you add new ones.</p>
<h2>Delay work that does not need to run first</h2>
<p>Not every ad task has to run while the page loads. By default, Prebid.js waits "3 seconds after the auction ends" before it lets bidders run their user-sync pixels. Prebid's documentation notes that publishers "may wish to move ad-related cookie work to much later in the page load after ads and content have loaded." Review which tags fire during page load and move the rest later.</p>
<h2>A short checklist</h2>
<ul>
<li>Check Core Web Vitals in field data, at the 75th percentile, for mobile and desktop separately.</li>
<li>Reserve space for every ad slot.</li>
<li>Lazy-load slots below the fold and tune the margins.</li>
<li>Measure mobile ad density on your longest templates and keep it at or below 30%.</li>
<li>Remove any format on the Better Ads list.</li>
<li>Move tags that are not urgent later in the page load.</li>
</ul>
<p>Speed is part of revenue. Prebid.org notes that when you delay ad serving, "you may lose impressions from users who bounce very quickly." A fast, stable page keeps those impressions.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://web.dev/articles/vitals">web.dev, "Web Vitals" (updated October 31, 2024)</a></li>
<li><a href="https://web.dev/blog/inp-cwv-march-12">web.dev, "Interaction to Next Paint becomes a Core Web Vital on March 12" (2024)</a></li>
<li><a href="https://web.dev/articles/optimize-cls">web.dev, "Optimize Cumulative Layout Shift"</a></li>
<li><a href="https://developers.google.com/publisher-tag/guides/minimize-layout-shift">Google Publisher Tag, "Minimize layout shift"</a></li>
<li><a href="https://developers.google.com/publisher-tag/samples/lazy-loading">Google Publisher Tag, "Lazy loading"</a></li>
<li><a href="https://developers.google.com/publisher-tag/reference">Google Publisher Tag, API reference</a></li>
<li><a href="https://www.betterads.org/standards/">Coalition for Better Ads, "The Initial Better Ads Standards"</a></li>
<li><a href="https://www.betterads.org/mobile-ad-density-higher-than-30/">Coalition for Better Ads, "Ad Density Higher Than 30% [Mobile]"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html">Prebid.org, "pbjs.setConfig: Configure User Syncing"</a></li>
<li><a href="https://docs.prebid.org/overview/intro.html">Prebid.org, "Introduction to Prebid"</a></li>
</ul>`,
    author: "HBDR Research",
    category: "Best Practices",
    tags: "user experience,ad revenue,core web vitals,lazy loading,ad density",
    publishedAt: "2025-01-08T00:00:00.000Z",
  },
  {
    title: "Understanding Programmatic Advertising: A Plain-English Guide for Publishers",
    slug: "understanding-programmatic-advertising-guide",
    excerpt: "What programmatic means, who the players are, how an auction runs, and the files and settings a publisher should check first.",
    content: `<p>Programmatic advertising can sound like a black box. It is not. It is a set of systems that sell your ad space one impression at a time, by rules you control. This guide explains the parts in plain English and ends with a few checks you can make this week.</p>
<h2>What programmatic means</h2>
<p>Prebid.org's glossary defines programmatic ads as ads "delivered either through an open marketplace through an auction, or as a pre-arranged ‘deal’ that was initiated through systems outside of the publisher's ad server." The other kind is direct-sold: ads that your own sales team sells and enters into your ad server.</p>
<p>With programmatic, you do not arrange each sale by hand. You set the rules, connect sources of demand, and let auctions set the price of each impression.</p>
<h2>The players</h2>
<p>A few types of system sit between your page and the advertiser. Each one has a job.</p>
<ul>
<li><strong>Ad server.</strong> It decides what fills each slot. Prebid's glossary calls it "a system that allows a content publisher to manage their portfolio of ads and deliver those ads according to the defined targeting and pacing rules." Google Ad Manager is a common example.</li>
<li><strong>Supply-side platform (SSP) or exchange.</strong> It offers your impressions to many buyers at once and runs the auction for the seller.</li>
<li><strong>Demand-side platform (DSP).</strong> Advertisers and agencies use it to bid on impressions across many sites.</li>
<li><strong>Header bidding wrapper.</strong> Code on your page, such as Prebid.js, that asks several SSPs for bids before the ad server decides.</li>
</ul>
<h2>How an auction runs</h2>
<p>Real-time bidding (RTB) is the engine. IAB Tech Lab describes it as a way of selling media that "allows an individual ad impression to be put up for bid in real-time." The IAB standard for these requests is OpenRTB, which Prebid's glossary calls "a protocol defined and managed by the IAB for transacting programmatic ad auctions."</p>
<p>Prebid.org gives a simplified view of header bidding on a web page, where the ad server makes the final decision:</p>
<ul>
<li>The page starts to load.</li>
<li>"The header bidding code calls out to a set of demand partners asking for bids."</li>
<li>The demand partners reply with their bids.</li>
<li>The ad server is called, with some or all bids attached.</li>
<li>"The ad server considers all available ads that could be displayed, including the header bid(s)," and shows the winner for each slot.</li>
</ul>
<p>All of this happens while the page loads, so time matters. Prebid.org describes the wait for bids as "a delicate balance: too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page."</p>
<h2>First-price auctions</h2>
<p>In September 2019, Google announced it was "transitioning to unified first price auctions for Google Ad Manager." Google reported that in its tests, "first price auctions have created a more competitive market," with "indirect line items (like those from Header Bidding implementations) winning an increased share of impressions." For a publisher, the point is simple: header bids compete with other demand inside the ad server, so the setup of that competition is worth understanding.</p>
<h2>Transparency: ads.txt, sellers.json and the supply chain</h2>
<p>Buyers want to know they are buying real inventory from a seller who is allowed to sell it. Three IAB Tech Lab standards answer that question.</p>
<ul>
<li><strong>ads.txt</strong> is a text file at the root of your domain. IAB Tech Lab calls it "a simple, flexible and secure method that publishers and distributors can use to publicly declare the companies they authorize to sell their digital inventory." Version 1.0 came out in June 2017.</li>
<li><strong>sellers.json</strong> is a file that SSPs and exchanges publish. It lets buyers "discover who the entities are that are either direct sellers of or intermediaries in the selling of digital advertising."</li>
<li><strong>The SupplyChain object</strong> travels in the bid request. It "enables buyers to see all parties who are selling or reselling a given bid request."</li>
</ul>
<p>The OpenRTB Working Group finalized sellers.json and the SupplyChain object on July 31, 2019. Together with ads.txt, they let a buyer trace an impression from your site, through each seller, to the bid.</p>
<h2>What to check this week</h2>
<ul>
<li><strong>Open your ads.txt.</strong> Go to yourdomain.com/ads.txt. Make sure every line belongs to a partner you work with today. Remove lines for partners you have dropped. Add any partner that is missing, with the exact line that partner gives you.</li>
<li><strong>List your demand.</strong> Write down every SSP and exchange that sells your inventory, through header bidding, your ad server or a reseller. If you cannot name who sells your impressions, buyers will have the same problem.</li>
<li><strong>Learn your ad server's view.</strong> Find out which line items and demand channels compete for each slot. Header bids only help if they compete fairly with everything else.</li>
<li><strong>Check the wait.</strong> Ask how long your pages wait for bids, and how that number was chosen.</li>
</ul>
<p>Programmatic is mostly plumbing. A short list of trusted partners, honest files and a well-set auction put your impressions in front of more buyers.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://docs.prebid.org/overview/glossary.html">Prebid.org, "Header Bidding Glossary"</a></li>
<li><a href="https://docs.prebid.org/overview/intro-to-header-bidding.html">Prebid.org, "Introduction to Header Bidding"</a></li>
<li><a href="https://docs.prebid.org/features/timeouts.html">Prebid.org, "Prebid Timeouts"</a></li>
<li><a href="https://iabtechlab.com/standards/openrtb/">IAB Tech Lab, "OpenRTB"</a></li>
<li><a href="https://blog.google/products/admanager/rolling-out-first-price-auctions-google-ad-manager-partners/">Google, "Rolling out first price auctions to Google Ad Manager partners" (September 5, 2019)</a></li>
<li><a href="https://iabtechlab.com/ads-txt/">IAB Tech Lab, "ads.txt"</a></li>
<li><a href="https://iabtechlab.com/sellers-json/">IAB Tech Lab, "sellers.json"</a></li>
</ul>`,
    author: "HBDR Research",
    category: "Education",
    tags: "programmatic,RTB,header bidding,ads.txt,sellers.json,guide",
    publishedAt: "2024-12-20T00:00:00.000Z",
  },
  {
    title: "Client-Side vs. Server-Side Header Bidding: What Moves and What You Trade",
    slug: "hbdr-launches-server-side-bidding-platform",
    excerpt: "Prebid.js runs the auction in the browser; Prebid Server runs it on a server. What you gain in speed and page weight, and what you give up in user matching.",
    content: `<p>Header bidding can run in two places: in the reader's browser or on a server. Prebid supports both, with Prebid.js in the browser and Prebid Server on the server. Many publishers use a mix of the two. This post explains what moves when you go server-side, what you gain, and what you give up.</p>
<h2>Two places to run the auction</h2>
<p>Prebid's glossary draws the line simply. In client-side header bidding, "the auction takes place on the client device of the user. Prebid.js is a client side bidding solution." In server-side header bidding, "the header-bidding auction takes place on a server." The glossary names Prebid Server, Amazon TAM and Google Open Bidding as examples.</p>
<p>In a client-side setup, the browser sends a request to each bidder and waits for each answer. In a server-side setup, Prebid.js sends one request to Prebid Server. Prebid describes its Prebid Server adapter as "a meta-adapter. It's not an actual bidder, but rather a way to get a batch of bids from other bidders with one request." The server calls the bidders and returns their bids in time for Prebid.js to pass them to the ad server.</p>
<h2>What you gain</h2>
<p><strong>Less work in the browser.</strong> Prebid gives a direct example: "if five bidders are moved from the client side to the server side, the browser just makes one request to PBS, which delegates the actual auctions to the server, lightening the load on the user's device."</p>
<p><strong>Room for more demand.</strong> Prebid notes that client-side setups "typically use 5 – 15 demand partners. Because of the faster processing speeds, server-side will often have more."</p>
<p><strong>Reach beyond the web page.</strong> A server-side solution "is required in environments that don't have HTML header sections in which to put JavaScript, such as mobiles apps and Accelerated Mobile Pages (AMP) sites."</p>
<h2>What you give up</h2>
<p><strong>Some user matching.</strong> This is the largest trade-off. Bidders recognize users through their own cookies. Prebid explains: "Many bidders track their bidder-specific user IDs through cookies. Since bidders will generally serve ads from a different domain than where Prebid Server is hosted, those cookies must be consolidated under the Prebid Server domain so that they can be sent to each demand source as part of auction calls."</p>
<p>That process is cookie syncing. Prebid.js calls the server's cookie_sync endpoint, "letting it know which server-side bidders will be participating." The server checks its own cookie to "determine whether any bidders are missing or need to be refreshed," and the browser then runs a sync for each bidder that is missing. Each step depends on cookies set by domains other than your site. WebKit states that Safari's tracking prevention "by default blocks all third-party cookies." So in Safari, cookie-based syncing does not work.</p>
<p>That has a price. Prebid notes that "DSPs are more likely to bid on impressions where they know something about the history of the user." Prebid's User ID module softens the loss: the IDs it creates are passed to server-side bidders too, because "bidRequest.userIdAsEids is made available to Prebid.js adapters and Prebid Server S2S adapters."</p>
<p><strong>Time on the round trip.</strong> Server bids must travel back to the browser before the ad server call. Prebid advises a server timeout lower than the auction timeout, "within the range of 50%-75% of the Auction Timeout." The default is 75%.</p>
<p><strong>A server to run.</strong> "Unlike Prebid.js, Prebid Server is a server. It needs somewhere to run, and that somewhere ought to be scalable, distributed, and fast." You either host it yourself, from the open-source code in Go or Java, or use a hosted service from a company that runs it.</p>
<p><strong>Visibility.</strong> In the browser, you can watch each bid request with your own tools. On the server, you see what the host's logs and reports show. Ask what reporting you get before you move bidders.</p>
<h2>A sensible split</h2>
<p>You do not have to choose one side. Prebid notes that "you can also use a combination of client and server processing to optimize your yield while still reducing latency." One way to decide:</p>
<ul>
<li>Keep in the browser the bidders that win often and depend most on user matching.</li>
<li>Move to the server the bidders that rarely win or that add the most delay.</li>
<li>Run the change as a test. Compare revenue per page view, bid rates and timeout rates, by browser, before and after.</li>
<li>Check your timeouts again after the split changes.</li>
</ul>
<h2>The bottom line</h2>
<p>Server-side header bidding trades some user matching for speed and scale. The right split depends on your readers' browsers, your bidders and how much delay your pages can carry. Measure it on your own traffic before you commit.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://docs.prebid.org/overview/glossary.html">Prebid.org, "Header Bidding Glossary"</a></li>
<li><a href="https://docs.prebid.org/overview/intro.html">Prebid.org, "Introduction to Prebid"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/modules/prebidServer.html">Prebid.org, "Module: Prebid Server Adapter"</a></li>
<li><a href="https://docs.prebid.org/prebid-server/overview/prebid-server-overview.html">Prebid.org, "Prebid Server Overview"</a></li>
<li><a href="https://docs.prebid.org/prebid-server/developers/pbs-cookie-sync.html">Prebid.org, "Prebid Server: Cookie Sync"</a></li>
<li><a href="https://docs.prebid.org/features/timeouts.html">Prebid.org, "Prebid Timeouts"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/modules/userId.html">Prebid.org, "Module: User ID"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html">Prebid.org, "pbjs.setConfig: Configure User Syncing"</a></li>
<li><a href="https://webkit.org/tracking-prevention/">WebKit, "Tracking Prevention in WebKit"</a></li>
</ul>`,
    author: "HBDR Research",
    // Moved from "Product Updates" (D-037): the post teaches; it announces nothing
    category: "Education",
    tags: "server-side bidding,prebid server,prebid.js,cookie sync,latency",
    publishedAt: "2025-02-01T00:00:00.000Z",
  },
  {
    title: "5 Common Header Bidding Mistakes and How to Avoid Them",
    slug: "common-header-bidding-mistakes",
    excerpt: "A guessed timeout, a server timeout that is too long, price buckets that cut bids, too many bidders and a stale ads.txt. How to find and fix each one.",
    content: `<p>Header bidding works best when its settings match how your site and your partners really behave. The five mistakes below share one cause: a setting chosen at launch and never checked again. Each one is cheap to find and cheap to fix.</p>
<h2>Mistake 1: Guessing the timeout</h2>
<p>The auction timeout is how long Prebid waits for bids before it calls the ad server. Prebid.org calls it "a delicate balance: too short, and header bidding won't have enough time to take place; too long, and revenue may go down due to delaying the ad server call to the point where users have left the page." It lists the factors that should set the number: "average user time on page, direct sellthrough, value of different ad channels, and average user network delay."</p>
<p><strong>Fix:</strong> Set the timeout from data. Look at when bids arrive and how many arrive after the cutoff. If a few bidders time out often, Prebid suggests a regional view: "It could be caused by geographic distribution. Try looking at timeout data by geographic region for patterns." Also add a failsafe timeout outside Prebid. It calls the ad server if something breaks, and Prebid says it "should be much larger than the auction timeout."</p>
<h2>Mistake 2: Giving Prebid Server the same timeout as the browser</h2>
<p>Server-side bids must travel from Prebid Server back to the browser before the ad server call. If the server waits as long as the browser does, its bids arrive too late to count. Prebid's guidance is that the server timeout "should probably be within the range of 50%-75% of the Auction Timeout." The default is 75%. How much lower you go "depends on average user network delay."</p>
<p><strong>Fix:</strong> Compare s2sConfig.timeout with your auction timeout. Lower it if many readers are on slow networks or far from your server host.</p>
<h2>Mistake 3: Price buckets that cut your bids</h2>
<p>Prebid puts every bid into a price bucket, and your ad server targets those buckets with line items. Prebid's default "medium" granularity uses $0.10 increments, capped at $20 CPM. Two things can go wrong.</p>
<ul>
<li><strong>Rounding.</strong> "Bids received from your Prebid demand partners are rounded down according to your price granularity." Prebid's own example: with $0.50 buckets, a $2.75 bid reaches the ad server as $2.50 and "could lose to an ad server bidder that bid 2.51." Rounding does not change what the winner pays you. It changes which bid wins.</li>
<li><strong>The cap.</strong> "Bids also round down to reflect the top price in your granularity definition." With a $5.00 cap, a $20.00 bid competes as $5.00. Prebid adds: "This is important to keep in mind for video inventory, which often sells for higher prices than other media types."</li>
</ul>
<p><strong>Fix:</strong> Make sure you have a line item for every bucket your granularity creates, and that the cap sits above the prices you actually receive. Use finer buckets in the price range where most of your bids land.</p>
<h2>Mistake 4: Too many bidders in the browser</h2>
<p>Each client-side bidder adds requests and work on the reader's device. More bidders can mean more competition, but also more delay. Prebid puts it this way: "The fewer demand partners that have the opportunity to bid, the fewer the bids, and therefore the faster the processing. But fewer demand partners also means fewer chances for an optimal bid." It adds that "client-side implementations typically use 5 – 15 demand partners."</p>
<p><strong>Fix:</strong> Rank partners by revenue and win rate. A partner that rarely wins adds delay but little competition. Remove it or move it to Prebid Server. Check user syncs too. By default, Prebid.js waits 3 seconds after the auction ends, then lets every adapter drop up to 5 image-based user syncs. The userSync settings let you limit or delay them.</p>
<h2>Mistake 5: A stale ads.txt</h2>
<p>ads.txt is how publishers "publicly declare the companies they authorize to sell their digital inventory," in IAB Tech Lab's words. If a partner's line is missing, a buyer who checks the file cannot confirm that partner may sell your inventory. If you dropped a partner but kept its line, the file still says that partner is authorized.</p>
<p><strong>Fix:</strong> Compare ads.txt with your partner list after every partner change. Use the exact line each partner gives you, and remove lines for partners you no longer use.</p>
<h2>A quarterly review</h2>
<ul>
<li>Pull bid response times and timeout rates by bidder and by region.</li>
<li>Check s2sConfig.timeout against the auction timeout.</li>
<li>Compare the spread of your bid prices with your price buckets and cap.</li>
<li>Rank bidders and remove the ones that do not earn their place.</li>
<li>Compare ads.txt with your partner list.</li>
</ul>
<p>None of these fixes needs new technology. Each one needs someone to look at the numbers on a schedule.</p>
<h2>Sources</h2>
<ul>
<li><a href="https://docs.prebid.org/features/timeouts.html">Prebid.org, "Prebid Timeouts"</a></li>
<li><a href="https://docs.prebid.org/adops/price-granularity.html">Prebid.org, "Price Granularity"</a></li>
<li><a href="https://docs.prebid.org/dev-docs/publisher-api-reference/setConfig.html">Prebid.org, "pbjs.setConfig"</a></li>
<li><a href="https://docs.prebid.org/overview/intro.html">Prebid.org, "Introduction to Prebid"</a></li>
<li><a href="https://iabtechlab.com/ads-txt/">IAB Tech Lab, "ads.txt"</a></li>
</ul>`,
    author: "HBDR Research",
    category: "Best Practices",
    tags: "header bidding,mistakes,timeouts,price granularity,ads.txt",
    publishedAt: "2025-01-22T00:00:00.000Z",
  },
];
