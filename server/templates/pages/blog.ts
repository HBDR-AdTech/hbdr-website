import { SITE_URL } from "../../config";
import { sanitizeText } from "../../middleware/sanitize";
import { renderLayout } from "../layout";
import { renderPageHero } from "../components/hero";
import { renderCTASection } from "../components/cta";
import { BlogPostData, formatDate, estimateReadTime } from "../components/blog-helpers";
import { renderEyebrow } from "../components/blueprint";

export function renderBlogPage(posts: BlogPostData[]): string {
  const categories = Array.from(new Set(posts.map(p => p.category)));

  const postCards = posts.map(post => {
    const readTime = estimateReadTime(post.content);
    return `
    <article class="post-row"
             data-category="${sanitizeText(post.category)}"
             data-search="${sanitizeText(`${post.title} ${post.excerpt}`.toLowerCase())}"
             x-show="(!activeCategory || activeCategory === $el.dataset.category) && (!searchQuery || $el.dataset.search.includes(searchQuery.toLowerCase()))"
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0"
             x-transition:enter-end="opacity-100"
             data-testid="blog-card-${post.slug}">
      <div class="post-row-meta">
        <span class="mono">${formatDate(post.publishedAt)}</span>
        <span class="post-cat" data-testid="badge-category">${post.category}</span>
      </div>
      <div class="post-row-main">
        <a href="/blog/${post.slug}" data-testid="link-blog-post-${post.slug}">
          <h2>${post.title}</h2>
        </a>
        <p class="line-clamp-3">${post.excerpt}</p>
        <span class="post-row-author">${post.author}</span>
      </div>
      <div class="post-row-aside">
        ${post.coverImage ? `<img src="${post.coverImage}" alt="${post.title}" loading="lazy" />` : ""}
        <span class="mono">${readTime} min read</span>
        <a href="/blog/${post.slug}" class="post-more" data-testid="link-read-more-${post.slug}">
          Read More
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </a>
      </div>
    </article>
  `;
  }).join("");

  const categoryFilters = categories.map(cat => `
    <button data-cat="${sanitizeText(cat)}" @click="activeCategory = activeCategory === $el.dataset.cat ? '' : $el.dataset.cat"
            :class="activeCategory === $el.dataset.cat ? 'is-active' : ''"
            class="post-filter"
            data-testid="filter-${cat.toLowerCase().replace(/\s+/g, '-')}">
      ${cat}
    </button>
  `).join("");

  const content = `
  ${renderPageHero("Blog", "Insights & Updates", "Expert perspectives on header bidding, ad monetization, and the future of programmatic advertising.")}

  <section class="bp-section bp-section-tight" data-testid="blog-listing" x-data="{ activeCategory: '', searchQuery: '' }">
    <div class="bp-wrap">
      <div class="post-toolbar">
        <div class="relative post-search">
          <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="search" aria-label="Search articles" x-model="searchQuery" placeholder="Search articles..."
                 class="glass-input w-full pl-11 pr-4 py-3 text-sm" data-testid="input-blog-search" />
        </div>

        <div class="post-filters" data-testid="blog-filters">
          <button @click="activeCategory = ''"
                  :class="!activeCategory ? 'is-active' : ''"
                  class="post-filter"
                  data-testid="filter-all">
            All Posts
          </button>
          ${categoryFilters}
        </div>
      </div>

      <div class="post-list">
        ${postCards}
      </div>
    </div>
  </section>

  ${renderCTASection("Want to learn more?", "Contact Us")}`;

  return renderLayout({
    title: "Blog - HBDR",
    description: "Read the latest insights on header bidding, ad monetization, and programmatic advertising from the HBDR team.",
    canonicalPath: "/blog",
    bodyContent: content,
  });
}

export function renderBlogPostPage(post: BlogPostData, relatedPosts?: BlogPostData[]): string {
  const tagsList = post.tags ? post.tags.split(",").map(t => t.trim()).filter(Boolean) : [];
  const tagsHtml = tagsList.map(tag => `<li>${tag}</li>`).join("");

  const readTime = estimateReadTime(post.content);

  const showUpdated = post.updatedAt && post.publishedAt &&
    new Date(post.updatedAt).toDateString() !== new Date(post.publishedAt).toDateString();

  const relatedSection = relatedPosts && relatedPosts.length > 0 ? `
  <section class="bp-section">
    <div class="bp-wrap">
      <div class="bp-head bp-grid12"><div><h2 data-testid="related-posts-heading">Related Articles</h2></div></div>
      <ul class="res-cols post-related">
        ${relatedPosts.slice(0, 3).map(rp => `
        <li>
          <a href="/blog/${rp.slug}" class="group" data-testid="related-post-${rp.slug}">
            ${rp.coverImage ? `<img src="${rp.coverImage}" alt="${rp.title}" loading="lazy" />` : ""}
            <span class="post-cat">${rp.category}</span>
            <h3 class="group-hover:text-[var(--accent)]">${rp.title}</h3>
            <p class="line-clamp-3">${rp.excerpt}</p>
            <span class="mono">${formatDate(rp.publishedAt)} &middot; ${estimateReadTime(rp.content)} min read</span>
          </a>
        </li>`).join("")}
      </ul>
    </div>
  </section>
  ` : "";

  const content = `
  <article data-testid="blog-post-${post.slug}">
    <header class="bp-hero post-hero">
      <div class="bp-wrap bp-grid12">
        <a href="/blog" class="post-back" data-testid="link-back-to-blog">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
          Back to Blog
        </a>
        ${renderEyebrow(post.category)}
        <h1 data-testid="text-post-title">${post.title}</h1>
        <p class="bp-lede">${post.excerpt}</p>
      </div>
    </header>

    <div class="bp-section bp-section-tight">
      <div class="bp-wrap bp-grid12">
        <aside class="post-aside">
          <dl class="bp-spec">
            <div><dt>Author</dt><dd data-testid="text-post-author">${post.author}</dd></div>
            <div><dt>Published</dt><dd class="mono">${formatDate(post.publishedAt)}</dd></div>
            ${showUpdated ? `<div><dt>Updated</dt><dd class="mono">${formatDate(post.updatedAt)}</dd></div>` : ""}
            <div><dt>Read time</dt><dd class="mono">${readTime} min read</dd></div>
          </dl>
          ${tagsList.length > 0 ? `
          <div class="post-tags">
            <span class="mono">Tags:</span>
            <ul>${tagsHtml}</ul>
          </div>` : ""}
        </aside>

        <div class="post-body">
          ${post.coverImage ? `
          <img src="${post.coverImage}" alt="${post.title}" class="post-cover" />` : ""}

          <div class="prose-content" data-testid="blog-post-content">
            ${post.content}
          </div>

          <a href="/blog" class="post-more post-back-bottom" data-testid="link-back-to-blog-bottom">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
            Back to All Posts
          </a>
        </div>
      </div>
    </div>
    ${relatedSection}
  </article>

  ${renderCTASection("Ready to maximize your ad revenue?", "Get Started")}`;

  return renderLayout({
    title: `${post.title} - HBDR Blog`,
    description: post.excerpt,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    bodyContent: content,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "author": { "@type": "Person", "name": post.author },
      "datePublished": post.publishedAt,
      ...(post.updatedAt ? { "dateModified": post.updatedAt } : {}),
      ...(post.coverImage ? { "image": post.coverImage } : {}),
      "publisher": {
        "@type": "Organization",
        "name": "HBDR",
        "logo": { "@type": "ImageObject", "url": `${SITE_URL}/assets/HBDR_Logo_Pack_all_sizes_-_2_1770577514801.jpeg` }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `${SITE_URL}/blog/${post.slug}`
      }
    },
  });
}
