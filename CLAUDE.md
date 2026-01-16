# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an AP Biology research paper presentation on **Redox Signaling** by Edgar Chavez Lopez. The project converts a student research paper into an interactive web presentation with an AI tutor chat feature.

## Files

- `index.html` - Single-file web app with the complete presentation (HTML, CSS, embedded SVG diagrams, chat UI)
- `redox_signaling_revised.pdf` - Revised PDF version of the paper
- `redox_signaling_revised.tex` - LaTeX source for the revised paper
- `edgar_bio_apper.pdf` - Original student research paper
- `STATE-MACHINE.md` - Documentation of interactive state machines (QR modal, chat panel)
- `railway-server/` - Express server for AI chat functionality

## Development

**Frontend:** No build step required. Open `index.html` directly in a browser.

**Railway Server (for AI chat):**
```bash
cd railway-server
npm install
cp .env.example .env  # Add your GROQ_API_KEY
npm start             # Runs on http://localhost:3000
```

## Testing

```bash
npm install       # Install dependencies (first time only)
npm test          # Run all tests (73 tests)
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
| `chat-panel.test.js` | AI chat UI, suggestions, functions, interactivity |

## Architecture

### Frontend (index.html)

The HTML file is self-contained with:
- Embedded CSS using CSS custom properties for theming (dark theme with cyan/blue/purple accents)
- Inline SVG diagrams for biological pathways (ETC, ROS conversion, signaling cascades, PTEN-Akt)
- Embedded YouTube iframes for educational videos
- Google Fonts loaded via CDN (Playfair Display, Source Sans 3, JetBrains Mono)
- QR code modal for sharing (uses api.qrserver.com for dynamic QR generation)
- AI chat modal with typing indicator, suggestions, and message history

### Railway Server (railway-server/)

Express server providing AI chat via Groq API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/ai/status` | GET | AI availability and rate limit status |
| `/api/ai/chat` | POST | Send message, get AI response |

**Environment Variables:**
- `GROQ_API_KEY` - Required for AI functionality (get at console.groq.com)
- `PORT` - Server port (default: 3000)

**System Prompt:** The server includes a comprehensive system prompt with:
- Full paper content as context
- Key concepts (ROS types, ETC, concentration effects, PTEN-Akt mechanism)
- All paper references
- Teaching style guidelines

### Key CSS Classes

- `.chem` - Chemical formula styling (monospace, orange)
- `.diagram-container` - Pathway diagram wrapper
- `.concept-box` / `.concept-box.warning` / `.concept-box.info` - Callout boxes
- `.video-card` - YouTube video embed containers
- `.concentration-bar` / `.conc-zone` - ROS concentration gradient visualization
- `.qr-modal-overlay` / `.qr-modal` - QR code sharing modal
- `.chat-modal-overlay` / `.chat-modal` - AI chat modal
- `.chat-message.user` / `.chat-message.assistant` - Chat message bubbles

### Content Structure

Sections follow the paper's structure: Introduction → Nature of ROS → Concentration-Dependent Signals → PTEN-Akt Example → High ROS and Apoptosis → Other Functions → Conclusion → References

## Deployment

**Frontend:** Deploy to GitHub Pages, Netlify, or any static host.

**AI Chat Backend:** Uses shared `curriculum_render` Railway server at `curriculumrender-production.up.railway.app`. The `/api/ai/chat` endpoint is defined in `curriculum_render/railway-server/server.js`.

**Standalone Server (optional):** The `railway-server/` folder contains a standalone Express server if you want to deploy separately:
1. Push `railway-server/` to Railway.app
2. Set `GROQ_API_KEY` environment variable
3. Update `CHAT_CONFIG.serverUrl` in `index.html` with deployed URL
