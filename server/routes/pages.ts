// All public page routes — single source of truth
// Both worker.ts and server/index.ts register these

import type { Hono } from "hono";
import type { IStorage } from "../services/storage";
import { getFormConfig, DEFAULT_FORM_CONFIG } from "../services/form-config";

// Page template imports
import { renderPage } from "../templates/pages/home";
import { renderAboutPage } from "../templates/pages/about";
import { renderHowItWorksPage } from "../templates/pages/how-it-works";
import { renderCareersPage } from "../templates/pages/careers";
import { renderPressPage } from "../templates/pages/press";
import { renderContactPage } from "../templates/pages/contact";
import { renderDashboardPage } from "../templates/pages/dashboard";
import { renderPartnersPage } from "../templates/pages/partners";
import { renderTrustCompliancePage } from "../templates/pages/trust";
import { renderFaqSupportPage } from "../templates/pages/support";

// Solution pages
import { renderHeaderBiddingPage } from "../templates/pages/solutions/header-bidding";
import { renderDisplayAdsPage } from "../templates/pages/solutions/display-ads";
import { renderCtvOttPage } from "../templates/pages/solutions/ctv-ott";
import { renderInAppAdsPage } from "../templates/pages/solutions/in-app-ads";
import { renderMcmPage } from "../templates/pages/solutions/mcm";
import { renderManageAccountPage } from "../templates/pages/solutions/manage-account";
import { renderManageInventoryPage } from "../templates/pages/solutions/manage-inventory";
import { renderOpenBiddingPage } from "../templates/pages/solutions/open-bidding";
import { renderAdExchangePage } from "../templates/pages/solutions/ad-exchange-adx";
import { renderVideoPlayerPage } from "../templates/pages/solutions/video-player";

// Audience pages
import { renderPublishersPage } from "../templates/pages/audience/publishers";
import { renderAdvertisersPage } from "../templates/pages/audience/advertisers";

// Legal pages
import { renderPrivacyPolicyPage } from "../templates/pages/legal/privacy-policy";
import { renderTermsPage } from "../templates/pages/legal/terms";
import { renderGdprCookiePolicyPage } from "../templates/pages/legal/gdpr-cookie-policy";

// Blog pages
import { renderBlogPage, renderBlogPostPage } from "../templates/pages/blog";

// Tools
import { renderPublisherToolsPage } from "../templates/tools/index";

// Error pages
import { render404Page } from "../templates/pages/error";

export function registerPageRoutes(app: Hono<any>, getStorage: (c: any) => IStorage) {
  // The contact form follows the operator's config (D-016). If D1 can't be read the page still renders,
  // with the code's default form; the submission path reads the config again and never falls back.
  const formConfig = (c: any) => getFormConfig(getStorage(c)).catch((error) => {
    console.error("Form config read failed; rendering the default form:", error);
    return DEFAULT_FORM_CONFIG;
  });

  // Static pages
  app.get("/", async (c) => c.html(renderPage(await formConfig(c))));
  app.get("/about", (c) => c.html(renderAboutPage()));
  app.get("/how-it-works", (c) => c.html(renderHowItWorksPage()));
  app.get("/careers", (c) => c.html(renderCareersPage()));
  // Reads the same published-posts query as /blog (one row per published post) and filters in memory.
  // A failed read shows the fact sheet without releases rather than an error page.
  app.get("/press", async (c) => {
    const posts = await getStorage(c).getBlogPosts(true).catch((error) => {
      console.error("press: blog read failed", error);
      return [];
    });
    return c.html(renderPressPage(posts));
  });
  app.get("/contact", async (c) => c.html(renderContactPage(await formConfig(c))));

  // Solutions
  app.get("/solutions/header-bidding", (c) => c.html(renderHeaderBiddingPage()));
  app.get("/solutions/display-ads", (c) => c.html(renderDisplayAdsPage()));
  app.get("/solutions/ctv-ott", (c) => c.html(renderCtvOttPage()));
  app.get("/solutions/in-app-ads", (c) => c.html(renderInAppAdsPage()));
  app.get("/solutions/mcm", (c) => c.html(renderMcmPage()));
  app.get("/solutions/manage-account", (c) => c.html(renderManageAccountPage()));
  app.get("/solutions/manage-inventory", (c) => c.html(renderManageInventoryPage()));
  app.get("/solutions/open-bidding", (c) => c.html(renderOpenBiddingPage()));
  app.get("/solutions/ad-exchange-adx", (c) => c.html(renderAdExchangePage()));
  app.get("/solutions/video-player", (c) => c.html(renderVideoPlayerPage()));

  // Audience & utility
  app.get("/dashboard", (c) => c.html(renderDashboardPage()));
  app.get("/partners", (c) => c.html(renderPartnersPage()));
  app.get("/publishers", (c) => c.html(renderPublishersPage()));
  app.get("/advertisers", (c) => c.html(renderAdvertisersPage()));
  app.get("/trust", (c) => c.html(renderTrustCompliancePage()));
  app.get("/tools", (c) => c.html(renderPublisherToolsPage()));

  // Legal
  app.get("/privacy-policy", (c) => c.html(renderPrivacyPolicyPage()));
  app.get("/terms", (c) => c.html(renderTermsPage()));
  app.get("/gdpr-cookie-policy", (c) => c.html(renderGdprCookiePolicyPage()));
  app.get("/support", async (c) => c.html(renderFaqSupportPage((await formConfig(c)).turnstileSiteKey)));

  // Blog (needs storage)
  app.get("/blog", async (c) => {
    const storage = getStorage(c);
    if ("seedBlogPosts" in storage) await (storage as any).seedBlogPosts();
    const posts = await storage.getBlogPosts(true);
    return c.html(renderBlogPage(posts));
  });

  app.get("/blog/:slug", async (c) => {
    const storage = getStorage(c);
    const slug = c.req.param("slug");
    const post = await storage.getBlogPostBySlug(slug);
    if (!post) return c.html(render404Page(), 404);
    if (post.published !== "true") return c.html(render404Page(), 404);

    // Fetch related posts: same category first, then recent, excluding current
    const allPosts = await storage.getBlogPosts(true);
    const sameCategory = allPosts.filter(p => p.category === post.category && p.slug !== post.slug);
    const otherPosts = allPosts.filter(p => p.category !== post.category && p.slug !== post.slug);
    const relatedPosts = [...sameCategory, ...otherPosts].slice(0, 3);

    return c.html(renderBlogPostPage(post, relatedPosts));
  });
}
