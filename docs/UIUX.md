# UI/UX Guide

## Branding
- **Style:** Notion-inspired, minimalist, greyish
- **Logo:** Simple text (e.g., CollabNote)
- **Accent:** Muted blue or green for highlights

## Color Palette
- Background: #f7f7f8
- Surface: #ffffff
- Border: #e3e3e6
- Text: #222426
- Muted: #888b92
- Accent: #4f8cff (blue) or #4fcf8c (green)

## Fonts
- Primary: Inter, sans-serif
- Code: JetBrains Mono, monospace

## Design Rules
- Lots of whitespace
- Soft, rounded corners
- Subtle drop-shadows
- Toolbar appears on text selection
- Animated presence cursors (colored dots, user initials)
- Responsive, desktop-first
- Minimal icons, no clutter

## Components
- **Editor:** Contenteditable/CodeMirror, Notion-style toolbar
- **Presence:** Avatars, animated cursors
- **Sidebar:** (optional) Doc list, user info
- **Landing:** Hero, features, CTA

---

For implementation, see `/frontend/src/theme.ts` and `/frontend/src/components/`. 