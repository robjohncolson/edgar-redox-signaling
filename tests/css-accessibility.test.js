import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("CSS custom properties", () => {
  it("has correct text-secondary color for accessibility", () => {
    // Should be #aeb7c0 after the contrast fix
    expect(html).toMatch(/--text-secondary:\s*#aeb7c0/);
  });

  it("has dark theme background colors", () => {
    expect(html).toMatch(/--bg-primary:\s*#0a0e14/);
    expect(html).toMatch(/--bg-secondary:\s*#111922/);
  });

  it("has accent colors defined", () => {
    expect(html).toMatch(/--accent-cyan:\s*#00d4aa/);
    expect(html).toMatch(/--accent-blue:\s*#58a6ff/);
    expect(html).toMatch(/--accent-purple:\s*#a371f7/);
  });
});

describe("Header accessibility", () => {
  it("header::before has pointer-events: none", () => {
    // This fix prevents the glow overlay from blocking clicks
    expect(html).toMatch(/header::before[\s\S]*?pointer-events:\s*none/);
  });
});

describe("Responsive design", () => {
  it("has mobile media query", () => {
    expect(html).toMatch(/@media\s*\([^)]*max-width:\s*768px/);
  });

  it("has viewport meta tag", () => {
    expect(html).toMatch(/<meta[^>]*name="viewport"[^>]*content="[^"]*width=device-width/);
  });
});

describe("External resources", () => {
  it("loads Google Fonts", () => {
    expect(html).toMatch(/fonts\.googleapis\.com/);
  });

  it("loads Playfair Display font", () => {
    expect(html).toMatch(/Playfair\+Display/);
  });

  it("loads Source Sans 3 font", () => {
    expect(html).toMatch(/Source\+Sans\+3/);
  });

  it("loads JetBrains Mono font", () => {
    expect(html).toMatch(/JetBrains\+Mono/);
  });
});

describe("QR Modal CSS", () => {
  it("modal overlay starts hidden", () => {
    expect(html).toMatch(/\.qr-modal-overlay[\s\S]*?display:\s*none/);
  });

  it("modal becomes visible with active class", () => {
    expect(html).toMatch(/\.qr-modal-overlay\.active[\s\S]*?display:\s*flex/);
  });

  it("modal has backdrop blur", () => {
    expect(html).toMatch(/backdrop-filter:\s*blur/);
  });
});
