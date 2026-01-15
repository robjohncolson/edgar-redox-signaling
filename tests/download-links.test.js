import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");

describe("Download links", () => {
  const html = fs.readFileSync(htmlPath, "utf8");

  it("has link to revised PDF", () => {
    expect(html).toMatch(/href="[^"]*redox_signaling_revised\.pdf"/);
  });

  it("has link to LaTeX source", () => {
    expect(html).toMatch(/href="[^"]*redox_signaling_revised\.tex"/);
  });

  it("has link to Edgar's original PDF", () => {
    expect(html).toMatch(/href="[^"]*edgar_bio_apper\.pdf"/);
  });

  it("LaTeX link has download attribute", () => {
    expect(html).toMatch(/<a[^>]*href="[^"]*\.tex"[^>]*download/);
  });

  it("PDF links open in new tab", () => {
    const pdfLinks = html.match(/<a[^>]*href="[^"]*\.pdf"[^>]*>/g) || [];
    expect(pdfLinks.length).toBeGreaterThan(0);
    for (const link of pdfLinks) {
      expect(link).toMatch(/target="_blank"/);
    }
  });
});
