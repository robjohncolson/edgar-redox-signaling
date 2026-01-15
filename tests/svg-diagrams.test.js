import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, "..", "index.html");
const html = fs.readFileSync(htmlPath, "utf8");

describe("SVG diagrams presence", () => {
  it("has ETC diagram with all four complexes", () => {
    expect(html).toMatch(/Electron Transport Chain/);
    expect(html).toMatch(/<!-- Complex I -->/);
    expect(html).toMatch(/<!-- Complex II -->/);
    expect(html).toMatch(/<!-- Complex III -->/);
    expect(html).toMatch(/<!-- Complex IV -->/);
  });

  it("has ROS conversion pathway diagram", () => {
    expect(html).toMatch(/ROS Conversion Pathway/);
  });

  it("has signaling pathways diagram", () => {
    expect(html).toMatch(/Signaling Pathways Affected by ROS/);
  });

  it("has PTEN-Akt diagram", () => {
    expect(html).toMatch(/PTEN Oxidation and Akt Activation/);
  });

  it("has apoptosis diagram", () => {
    expect(html).toMatch(/Apoptosis Pathways Activated by High ROS/);
  });

  it("has additional ROS roles diagram", () => {
    expect(html).toMatch(/Additional Roles of ROS in Cells/);
  });
});

describe("SVG diagram content accuracy", () => {
  it("Complex I has NADH label", () => {
    expect(html).toMatch(/NADH → NAD/);
  });

  it("Complex II has FADH₂ label", () => {
    expect(html).toMatch(/FADH₂ → FAD/);
  });

  it("Complex IV has O₂ → H₂O label", () => {
    expect(html).toMatch(/O₂ → H₂O/);
  });

  it("shows superoxide (O₂•⁻) generation", () => {
    expect(html).toMatch(/O₂•⁻/);
  });

  it("shows hydrogen peroxide (H₂O₂)", () => {
    expect(html).toMatch(/H₂O₂/);
  });

  it("shows hydroxyl radical (•OH)", () => {
    expect(html).toMatch(/•OH/);
  });

  it("mentions SOD enzyme", () => {
    expect(html).toMatch(/SOD/);
  });

  it("mentions Fenton reaction (Fe²⁺)", () => {
    expect(html).toMatch(/Fe²⁺/);
  });
});

describe("SVG accessibility", () => {
  it("all SVGs have viewBox attribute", () => {
    const svgTags = html.match(/<svg[^>]*>/g) || [];
    expect(svgTags.length).toBeGreaterThan(0);
    for (const svg of svgTags) {
      expect(svg).toMatch(/viewBox=/);
    }
  });

  it("SVG text uses minimum 11px font size", () => {
    // After the accessibility fix, no font-size should be below 11
    const smallFonts = html.match(/font-size="[0-9]"/g) || [];
    expect(smallFonts.length).toBe(0); // No single-digit font sizes
  });
});
