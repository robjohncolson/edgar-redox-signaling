# State Machine Documentation

This document describes the interactive state machines in the Redox Signaling presentation.

## QR Modal State Machine

The QR code modal is the primary interactive component. It follows a simple two-state machine.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌──────────┐                      ┌──────────┐          │
│    │          │  click QR button     │          │          │
│    │  CLOSED  │─────────────────────▶│   OPEN   │          │
│    │          │                      │          │          │
│    └──────────┘◀─────────────────────└──────────┘          │
│                   click X button                            │
│                   click overlay                             │
│                   (outside modal)                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### States

| State  | CSS Class       | Description                          |
|--------|-----------------|--------------------------------------|
| CLOSED | (no class)      | Modal hidden, `display: none`        |
| OPEN   | `.active`       | Modal visible, `display: flex`       |

### Transitions

| From   | To     | Trigger                              | Action                           |
|--------|--------|--------------------------------------|----------------------------------|
| CLOSED | OPEN   | Click "QR Codes" button              | Add `.active` class to `#qrModal`|
| OPEN   | CLOSED | Click close button (×)               | Remove `.active` class           |
| OPEN   | CLOSED | Click overlay (outside modal)        | Remove `.active` class           |

### Implementation

```javascript
// Open modal
document.getElementById('qrModal').classList.add('active')

// Close modal
document.getElementById('qrModal').classList.remove('active')

// Close on overlay click (only if clicking overlay itself, not modal content)
onclick="if(event.target === this) this.classList.remove('active')"
```

### Initial State

The modal starts in the **CLOSED** state. The overlay element has no `.active` class on page load.

```html
<div id="qrModal" class="qr-modal-overlay">
  <!-- No .active class = CLOSED state -->
</div>
```

## Page Navigation (Scroll)

The page uses standard browser scroll behavior with CSS animations triggered on initial load.

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│    ┌──────────┐                      ┌──────────┐          │
│    │          │  page load           │          │          │
│    │  LOADING │─────────────────────▶│ ANIMATED │          │
│    │          │                      │          │          │
│    └──────────┘                      └──────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Section Animations

Each `<section>` element has a staggered `fadeInUp` animation on page load:

| Section | Animation Delay |
|---------|-----------------|
| 1       | 0s              |
| 2       | 0.1s            |
| 3       | 0.2s            |
| 4       | 0.3s            |
| 5       | 0.4s            |

### Animation CSS

```css
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

section {
    animation: fadeInUp 0.6s ease forwards;
}
```

## AI Chat Panel State Machine

The AI chat panel allows students to ask questions about redox signaling.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│  MODAL STATE (outer)                                                         │
│                                                                              │
│    ┌──────────┐  click "Ask AI"    ┌──────────┐                             │
│    │  CLOSED  │───────────────────▶│   OPEN   │                             │
│    └──────────┘◀───────────────────└──────────┘                             │
│                  click X / overlay                                           │
│                                                                              │
│  CHAT STATE (inner, when OPEN)                                              │
│                                                                              │
│    ┌──────────┐  user sends msg    ┌──────────┐  response     ┌──────────┐ │
│    │   IDLE   │───────────────────▶│ LOADING  │──────────────▶│   IDLE   │ │
│    └──────────┘                    └──────────┘               └──────────┘ │
│         │                               │                                    │
│         │  click suggestion             │  error                            │
│         └───────────────────────────────┼──────────────────────────────────▶│
│                                         │               (show error message) │
│                                         └──────────────────────────────────▶│
│                                                           (return to IDLE)   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Modal States

| State  | CSS Class       | Description                          |
|--------|-----------------|--------------------------------------|
| CLOSED | (no class)      | Modal hidden, `display: none`        |
| OPEN   | `.active`       | Modal visible, `display: flex`       |

### Chat States

| State   | UI Indicator            | Send Button | Description                    |
|---------|-------------------------|-------------|--------------------------------|
| IDLE    | Input enabled           | Enabled     | Waiting for user input         |
| LOADING | Typing indicator active | Disabled    | Waiting for AI response        |

### Transitions

| From    | To      | Trigger                   | Action                                    |
|---------|---------|---------------------------|-------------------------------------------|
| CLOSED  | OPEN    | Click "Ask AI Tutor"      | `openChat()` - add `.active` class        |
| OPEN    | CLOSED  | Click X / overlay         | `closeChat()` - remove `.active` class    |
| IDLE    | LOADING | User sends message        | `sendMessage()` - show typing indicator   |
| LOADING | IDLE    | AI responds               | Display response, hide typing indicator   |
| LOADING | IDLE    | Error occurs              | Display error message, hide indicator     |

### Implementation

```javascript
// Modal control
function openChat() {
    document.getElementById('chatModal').classList.add('active');
    document.getElementById('chatInput').focus();
}

function closeChat() {
    document.getElementById('chatModal').classList.remove('active');
}

// Chat state control
function setTyping(isTyping) {
    document.getElementById('chatTyping').classList.toggle('active', isTyping);
    document.getElementById('chatSend').disabled = isTyping;
    chatState.isLoading = isTyping;
}
```

### chatState Object

```javascript
const chatState = {
    messages: [],      // Array of {role: 'user'|'assistant', content: string}
    isLoading: false   // True when waiting for AI response
};
```

### Server Communication

The chat panel communicates with a Railway-hosted Express server:

```
Client                          Server
  │                               │
  │  POST /api/ai/chat            │
  │  {message, history}           │
  │──────────────────────────────▶│
  │                               │ Groq API call
  │                               │ (llama-3.3-70b)
  │  {response, _provider}        │
  │◀──────────────────────────────│
  │                               │
```

### Error States

| Error                | Display                              | Recovery           |
|----------------------|--------------------------------------|--------------------|
| Network failure      | Error message in chat                | User can retry     |
| Server unavailable   | "Couldn't connect to AI tutor"       | User can retry     |
| Rate limited (429)   | "Too many requests, please wait"     | Auto-recovers      |

## External Links

All external links (YouTube videos, references, PDFs) use standard `target="_blank"` behavior:

- **YouTube embeds**: Inline iframes, no state change
- **Reference links**: Open in new tab
- **PDF links**: Open in new tab with `rel="noopener"`
- **LaTeX download**: Triggers browser download (`download` attribute)

## Summary

The application has three interactive state machines:

1. **QR Modal**: Binary open/closed state controlled by CSS class
2. **AI Chat Panel**: Modal state + chat state (idle/loading) with server communication
3. **Section animations**: One-time CSS animations on page load
4. **External navigation**: Standard browser behavior (no internal state)

The chat panel adds conversational AI capability while maintaining the focus on educational content presentation.
