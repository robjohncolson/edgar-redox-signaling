import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("Chat panel structure", () => {
  it("has chat modal element with correct ID", () => {
    expect(html).toMatch(/id="chatModal"/);
  });

  it("has chat button in header", () => {
    expect(html).toMatch(/<button[^>]*class="chat-btn"/);
  });

  it("chat button calls openChat function", () => {
    expect(html).toMatch(/onclick="openChat\(\)"/);
  });

  it("has chat input textarea", () => {
    expect(html).toMatch(/id="chatInput"/);
  });

  it("has chat send button", () => {
    expect(html).toMatch(/id="chatSend"/);
  });

  it("has chat messages container", () => {
    expect(html).toMatch(/id="chatMessages"/);
  });

  it("has typing indicator", () => {
    expect(html).toMatch(/id="chatTyping"/);
  });
});

describe("Chat suggestions", () => {
  it("has suggestion buttons", () => {
    const suggestions = html.match(/class="chat-suggestion"/g) || [];
    expect(suggestions.length).toBeGreaterThanOrEqual(4);
  });

  it("has ROS suggestion", () => {
    expect(html).toMatch(/What is ROS\?/);
  });

  it("has PTEN suggestion", () => {
    expect(html).toMatch(/How does PTEN work\?/);
  });

  it("has Fenton reaction suggestion", () => {
    expect(html).toMatch(/Explain the Fenton reaction/);
  });
});

describe("Chat configuration", () => {
  it("has CHAT_CONFIG object", () => {
    expect(html).toMatch(/const CHAT_CONFIG/);
  });

  it("has serverUrl in config", () => {
    expect(html).toMatch(/serverUrl:/);
  });

  it("has Railway URL pattern", () => {
    expect(html).toMatch(/\.up\.railway\.app/);
  });
});

describe("Chat functions", () => {
  it("defines openChat function", () => {
    expect(html).toMatch(/function openChat\(\)/);
  });

  it("defines closeChat function", () => {
    expect(html).toMatch(/function closeChat\(\)/);
  });

  it("defines sendMessage function", () => {
    expect(html).toMatch(/async function sendMessage\(\)/);
  });

  it("defines addMessage function", () => {
    expect(html).toMatch(/function addMessage\(content, role\)/);
  });

  it("defines setTyping function", () => {
    expect(html).toMatch(/function setTyping\(isTyping\)/);
  });
});

describe("Chat interactivity", () => {
  let dom;
  let document;

  beforeEach(() => {
    dom = new JSDOM(html, { runScripts: "dangerously" });
    document = dom.window.document;
  });

  it("chat modal starts hidden (no active class)", () => {
    const modal = document.getElementById("chatModal");
    expect(modal.classList.contains("active")).toBe(false);
  });

  it("clicking chat button adds active class", () => {
    const button = document.querySelector(".chat-btn");
    const modal = document.getElementById("chatModal");
    // Trigger the onclick
    dom.window.openChat();
    expect(modal.classList.contains("active")).toBe(true);
  });

  it("closeChat removes active class", () => {
    const modal = document.getElementById("chatModal");
    modal.classList.add("active");
    dom.window.closeChat();
    expect(modal.classList.contains("active")).toBe(false);
  });

  it("chat input exists and is empty initially", () => {
    const input = document.getElementById("chatInput");
    expect(input).not.toBeNull();
    expect(input.value).toBe("");
  });
});

describe("Chemical formula formatting", () => {
  it("addMessage formats H2O2", () => {
    expect(html).toMatch(/\.replace\(\/H2O2\/g/);
  });

  it("addMessage formats O2", () => {
    expect(html).toMatch(/\.replace\(\/O2\/g/);
  });

  it("addMessage formats Fe2+", () => {
    expect(html).toMatch(/\.replace\(\/Fe2\\\+\/g/);
  });
});
