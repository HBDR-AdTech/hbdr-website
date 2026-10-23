import { describe, it, expect, beforeAll } from "vitest";
import { Hono } from "hono";
import { registerPageRoutes } from "../pages";
import { MemStorage } from "../../services/mem-storage";
import { TIMEOUT_MODEL, timeoutYield } from "../../templates/pages/home";

const app = new Hono();
const storage = new MemStorage();
let html = "";
beforeAll(async () => {
  await storage.seedBlogPosts();
  registerPageRoutes(app, () => storage);
  html = await (await app.request("/")).text();
});

const at = (ms: number) => timeoutYield(TIMEOUT_MODEL, ms);
const name = (i: number) => (i < 0 ? null : TIMEOUT_MODEL.bidders[i].name);
const money = (v: number) => v.toFixed(2);

// D-026: example model, pages per session = 4.0 × (1 − 2% × (timeout − 300 ms) / 100 ms)
describe("timeout explorer model (D-026)", () => {
  it("at the 1000 ms default Bidder 2 wins and Bidder 5 times out", () => {
    const r = at(1000);
    expect(name(r.winner)).toBe("Bidder 2");
    expect(r.cpm).toBe(4.86);
    expect(r.received).toBe(5);
    expect(r.inTime[4]).toBe(false);
    expect(money(r.pageRpm)).toBe("14.58");
    expect(money(r.pages)).toBe("3.44");
    expect(money(r.sessionRpm)).toBe("50.16");
  });

  it("at 1200 ms the late Bidder 5 bid wins", () => {
    const r = at(1200);
    expect(name(r.winner)).toBe("Bidder 5");
    expect(money(r.cpm)).toBe("5.20");
    expect(r.received).toBe(6);
  });

  it("at 150 ms no bid arrives and the slot is unfilled", () => {
    const r = at(150);
    expect(r.winner).toBe(-1);
    expect(r.received).toBe(0);
    expect(r.pageRpm).toBe(0);
    expect(r.sessionRpm).toBe(0);
  });

  it("at 500 and 1300 ms", () => {
    const a = at(500), b = at(1300);
    expect([name(a.winner), money(a.pageRpm), money(a.pages), money(a.sessionRpm)]).toEqual(["Bidder 3", "10.11", "3.84", "38.82"]);
    expect([name(b.winner), money(b.pageRpm), money(b.pages), money(b.sessionRpm)]).toEqual(["Bidder 5", "15.60", "3.20", "49.92"]);
  });

  // The copy says Session RPM peaks just after the best bidders respond: Bidder 2 answers at 520 ms
  it("Session RPM peaks at 520 ms across the slider range", () => {
    let best = 200;
    for (let ms = 200; ms <= 1500; ms += 10) if (at(ms).sessionRpm > at(best).sessionRpm) best = ms;
    expect(best).toBe(520);
  });
});

describe("timeout explorer server render (D-026)", () => {
  it("renders the finished 1000 ms state, readout values included", () => {
    expect(html).toContain('data-testid="yield-readout"');
    expect(html).toContain('<span data-yield="received">5 of 6</span>');
    expect(html).toContain('<span data-yield="cpm">$4.86</span>');
    expect(html).toContain('data-testid="page-rpm">$14.58</span>');
    expect(html).toContain('<span data-yield="pages">3.44</span>');
    expect(html).toContain('data-testid="session-rpm">$50.16</span>');
    expect(html).toContain(">$4.86 wins</text>");
    expect(html).toContain(">timed out · $5.20 lost</text>");
    expect(html.match(/class="tl-lane is-win"/g)).toHaveLength(1);
    expect(html.match(/class="tl-lane is-out"/g)).toHaveLength(1);
  });

  it("has the labelled slider and the draggable timeout line", () => {
    expect(html).toMatch(/<label for="timeout-slider">Timeout \(ms\)<\/label>/);
    expect(html).toMatch(/<input type="range" id="timeout-slider" min="200" max="1500" step="10" value="1000"[^>]*data-testid="timeout-slider">/);
    expect(html).toContain('<g class="tl-timeout-g" transform="translate(593.33 0)" data-testid="timeout-line">');
    expect(html).toContain('class="tl-handle"');
  });

  it("labels every number as example data", () => {
    expect(html).toContain("Example yield at this timeout");
    expect(html).toContain("Example data: response times, bids and the session model are illustrative.");
  });

  // One source: the page script carries the server's own function and model, and gives the same answers
  it("the page script's model matches the server model at every slider step", () => {
    const tmSrc = html.slice(html.indexOf("var tm = ") + 9, html.indexOf(";\n    var yieldAt = "));
    const fnSrc = html.slice(html.indexOf("var yieldAt = ") + 14, html.indexOf(";\n    var slider = "));
    expect(JSON.parse(tmSrc)).toEqual(TIMEOUT_MODEL);
    const clientYield = new Function("m", "t", `return (${fnSrc})(m, t);`);
    for (let ms = 150; ms <= 1500; ms += 10) expect(clientYield(JSON.parse(tmSrc), ms)).toEqual(at(ms));
  });

  // An inner function would get esbuild keepNames' __name() call in the Worker bundle, which the browser copy cannot resolve
  it("timeoutYield has no inner functions", () => {
    const src = timeoutYield.toString();
    expect(src).toMatch(/^function timeoutYield\(/);
    expect(src.slice(src.indexOf("{") + 1)).not.toMatch(/=>|\bfunction\b/);
  });

  // Interaction is user-driven, so it is wired before the script stops for a missing GSAP
  it("wires the slider and line before the GSAP early return", () => {
    const stop = html.indexOf("if (!window.gsap) return;");
    expect(html.indexOf("slider.addEventListener('input'")).toBeGreaterThan(-1);
    expect(html.indexOf("slider.addEventListener('input'")).toBeLessThan(stop);
    expect(html.indexOf("tline.addEventListener('pointerdown'")).toBeLessThan(stop);
  });
});
