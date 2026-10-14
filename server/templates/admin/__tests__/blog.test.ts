import { describe, it, expect } from "vitest";
import { renderBlogEditorPage } from "../blog";

// What the browser hands Alpine: a single-quoted attribute ends at the first ', then character references are decoded
function xData(html: string): string {
  const raw = html.match(/x-data='([^']*)'/)![1];
  return raw.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot);/gi, (_, ref: string) =>
    ref[0] === "#" ? String.fromCodePoint(ref[1].toLowerCase() === "x" ? parseInt(ref.slice(2), 16) : Number(ref.slice(1)))
      : ({ amp: "&", lt: "<", gt: ">", quot: '"' } as Record<string, string>)[ref.toLowerCase()]);
}

describe("blog editor", () => {
  it("round-trips titles and content with ', </script> and entities into Alpine's formData", () => {
    const post = {
      id: "7", title: "It's </script><script>alert(1)</script>", slug: "its", excerpt: "Pubs' & 'advertisers'",
      content: "<p>Tom &amp; Jerry's</p></script>", coverImage: null, author: "O'Neil", category: "News",
      tags: null, published: "true", publishedAt: null, updatedAt: null,
    };
    const html = renderBlogEditorPage(post);
    expect(html).not.toContain("</script><script>alert(1)");
    const data = new Function(`return (${xData(html)})`)();
    expect(data.formData).toMatchObject({
      title: post.title, excerpt: post.excerpt, content: post.content, author: post.author, published: "true",
    });
  });
});
