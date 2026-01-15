const fs = require("fs");
const path = require("path");
const { describe, it, expect } = require("vitest");

const htmlPath = path.join(__dirname, "..", "index.html");

function getIframeSrcs(html) {
  const srcs = [];
  const iframeSrcRegex = /<iframe[^>]*\ssrc="([^"]+)"[^>]*>/gi;
  let match;

  while ((match = iframeSrcRegex.exec(html)) !== null) {
    srcs.push(match[1]);
  }

  return srcs;
}

describe("YouTube embed links", () => {
  it("uses embed URLs for every iframe", () => {
    const html = fs.readFileSync(htmlPath, "utf8");
    const srcs = getIframeSrcs(html);

    expect(srcs.length).toBeGreaterThan(0);
    for (const src of srcs) {
      expect(src.startsWith("https://www.youtube.com/embed/")).toBe(true);
    }
  });

  it("does not contain watch URLs in the HTML", () => {
    const html = fs.readFileSync(htmlPath, "utf8");
    expect(html).not.toMatch(/youtube\.com\/watch\?v=/i);
  });
});
