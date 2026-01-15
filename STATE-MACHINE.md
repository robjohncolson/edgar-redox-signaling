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

## External Links

All external links (YouTube videos, references, PDFs) use standard `target="_blank"` behavior:

- **YouTube embeds**: Inline iframes, no state change
- **Reference links**: Open in new tab
- **PDF links**: Open in new tab with `rel="noopener"`
- **LaTeX download**: Triggers browser download (`download` attribute)

## Summary

The application has minimal interactive state:

1. **QR Modal**: Binary open/closed state controlled by CSS class
2. **Section animations**: One-time CSS animations on page load
3. **External navigation**: Standard browser behavior (no internal state)

This simplicity is intentional—the focus is on content presentation, not complex interactivity.
