import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("QR Modal structure", () => {
  it("has QR modal element with correct ID", () => {
    expect(html).toMatch(/id="qrModal"/);
  });

  it("has QR button in header", () => {
    expect(html).toMatch(/<button[^>]*class="qr-btn"/);
  });

  it("QR button triggers modal open", () => {
    expect(html).toMatch(/onclick="[^"]*qrModal[^"]*classList\.add\('active'\)/);
  });

  it("has close button in modal", () => {
    expect(html).toMatch(/class="qr-modal-close"/);
  });

  it("close button removes active class", () => {
    expect(html).toMatch(/onclick="[^"]*qrModal[^"]*classList\.remove\('active'\)/);
  });
});

describe("QR codes", () => {
  it("has GitHub repo QR code", () => {
    expect(html).toMatch(/api\.qrserver\.com[^"]*github\.com\/robjohncolson\/edgar-redox-signaling/);
  });

  it("has live site QR code", () => {
    expect(html).toMatch(/api\.qrserver\.com[^"]*robjohncolson\.github\.io/);
  });

  it("has two QR code images", () => {
    const qrImages = html.match(/api\.qrserver\.com\/v1\/create-qr-code/g) || [];
    expect(qrImages.length).toBe(2);
  });
});

describe("QR Modal interactivity", () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  it("modal starts hidden (no active class)", () => {
    const modal = document.getElementById("qrModal");
    expect(modal.classList.contains("active")).toBe(false);
  });

  it("clicking QR button adds active class", () => {
    const button = document.querySelector(".qr-btn");
    const modal = document.getElementById("qrModal");
    button.click();
    expect(modal.classList.contains("active")).toBe(true);
  });

  it("clicking close button removes active class", () => {
    const modal = document.getElementById("qrModal");
    modal.classList.add("active");
    const closeBtn = document.querySelector(".qr-modal-close");
    closeBtn.click();
    expect(modal.classList.contains("active")).toBe(false);
  });
});
