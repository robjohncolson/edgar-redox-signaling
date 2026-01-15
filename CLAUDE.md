# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AP Biology research paper presentation on **Redox Signaling** by Edgar Chavez Lopez. The project converts a student research paper into an interactive web presentation.

## Files

- `index.html` - Single-file web app with the complete presentation (HTML, CSS, embedded SVG diagrams)
- `redox_signaling_revised.pdf` - Revised PDF version of the paper
- `redox_signaling_revised.tex` - LaTeX source for the revised paper
- `edgar_bio_apper.pdf` - Original student research paper
- `STATE-MACHINE.md` - Documentation of interactive state machines (QR modal)

## Development

**No build step required.** Open `index.html` directly in a browser.

## Testing

```bash
npm install       # Install dependencies (first time only)
npm test          # Run all tests
npm run test:watch # Run tests in watch mode
```

### Test Coverage

Tests are in `tests/` directory using Vitest + jsdom:

| Test File | What It Covers |
|-----------|----------------|
| `video-embeds.test.js` | YouTube embed URLs use correct format |
| `download-links.test.js` | PDF/LaTeX download links present and correct |
| `qr-modal.test.js` | QR modal structure and open/close behavior |
| `svg-diagrams.test.js` | All 6 SVG diagrams present with correct labels |
| `css-accessibility.test.js` | Color contrast, pointer-events fix, responsive design |

### Architecture

The HTML file is self-contained with:
- Embedded CSS using CSS custom properties for theming (dark theme with cyan/blue/purple accents)
- Inline SVG diagrams for biological pathways (ETC, ROS conversion, signaling cascades, PTEN-Akt)
- Embedded YouTube iframes for educational videos
- Google Fonts loaded via CDN (Playfair Display, Source Sans 3, JetBrains Mono)
- QR code modal for sharing (uses api.qrserver.com for dynamic QR generation)

### Key CSS Classes

- `.chem` - Chemical formula styling (monospace, orange)
- `.diagram-container` - Pathway diagram wrapper
- `.concept-box` / `.concept-box.warning` / `.concept-box.info` - Callout boxes
- `.video-card` - YouTube video embed containers
- `.concentration-bar` / `.conc-zone` - ROS concentration gradient visualization
- `.qr-modal-overlay` / `.qr-modal` - QR code sharing modal

### Content Structure

Sections follow the paper's structure: Introduction → Nature of ROS → Concentration-Dependent Signals → PTEN-Akt Example → High ROS and Apoptosis → Other Functions → Conclusion → References
