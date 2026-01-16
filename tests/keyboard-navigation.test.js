import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("Escape key handler structure", () => {
  it("has global keydown event listener", () => {
    expect(html).toMatch(/document\.addEventListener\(['"]keydown['"]/);
  });

  it("checks for Escape key", () => {
    expect(html).toMatch(/e\.key\s*===\s*['"]Escape['"]/);
  });

  it("closes chat modal on escape", () => {
    expect(html).toMatch(/chatModal\?\.classList\.contains\(['"]active['"]\)/);
    expect(html).toMatch(/closeChat\(\)/);
  });

  it("closes QR modal on escape", () => {
    expect(html).toMatch(/qrModal\?\.classList\.contains\(['"]active['"]\)/);
    expect(html).toMatch(/qrModal\.classList\.remove\(['"]active['"]\)/);
  });
});

describe("Escape key closes QR modal", () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  });

  it("QR modal closes when escape is pressed while open", () => {
    const qrModal = document.getElementById("qrModal");

    // Open the modal
    qrModal.classList.add("active");
    expect(qrModal.classList.contains("active")).toBe(true);

    // Simulate escape key press
    const event = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    // Modal should be closed
    expect(qrModal.classList.contains("active")).toBe(false);
  });

  it("QR modal stays closed when escape is pressed while closed", () => {
    const qrModal = document.getElementById("qrModal");

    // Ensure modal is closed
    expect(qrModal.classList.contains("active")).toBe(false);

    // Simulate escape key press
    const event = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    // Modal should still be closed
    expect(qrModal.classList.contains("active")).toBe(false);
  });
});

describe("Escape key closes chat modal", () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  });

  it("chat modal closes when escape is pressed while open", () => {
    const chatModal = document.getElementById("chatModal");

    // Open the modal
    window.openChat();
    expect(chatModal.classList.contains("active")).toBe(true);

    // Simulate escape key press
    const event = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    // Modal should be closed
    expect(chatModal.classList.contains("active")).toBe(false);
  });

  it("chat modal stays closed when escape is pressed while closed", () => {
    const chatModal = document.getElementById("chatModal");

    // Ensure modal is closed
    expect(chatModal.classList.contains("active")).toBe(false);

    // Simulate escape key press
    const event = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event);

    // Modal should still be closed
    expect(chatModal.classList.contains("active")).toBe(false);
  });
});

describe("Escape key priority", () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
    window = dom.window;
  });

  it("closes chat modal first when both modals are open", () => {
    const chatModal = document.getElementById("chatModal");
    const qrModal = document.getElementById("qrModal");

    // Open both modals
    qrModal.classList.add("active");
    window.openChat();

    expect(qrModal.classList.contains("active")).toBe(true);
    expect(chatModal.classList.contains("active")).toBe(true);

    // First escape closes chat modal
    const event1 = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event1);

    expect(chatModal.classList.contains("active")).toBe(false);
    expect(qrModal.classList.contains("active")).toBe(true);

    // Second escape closes QR modal
    const event2 = new window.KeyboardEvent("keydown", { key: "Escape" });
    document.dispatchEvent(event2);

    expect(qrModal.classList.contains("active")).toBe(false);
  });

  it("ignores non-escape keys", () => {
    const qrModal = document.getElementById("qrModal");

    // Open modal
    qrModal.classList.add("active");
    expect(qrModal.classList.contains("active")).toBe(true);

    // Press a different key
    const event = new window.KeyboardEvent("keydown", { key: "Enter" });
    document.dispatchEvent(event);

    // Modal should still be open
    expect(qrModal.classList.contains("active")).toBe(true);
  });
});
