# Trasmambang — Design Tokens & Style Guide
## Reference: [Hydra Template](https://hydra-template.framer.website/)

**Goal:** Adapt Hydra's clean, editorial, spacious design language to the homestay context — without changing any existing content.

---

## Analysis: Hydra vs Current Site

| Aspect | Current Site | Hydra Reference | Gap |
|--------|-------------|-----------------|-----|
| **Typography** | Inter + Karla, inconsistent sizing | Geist + Inter, strict hierarchy with tight letter-spacing | Needs font upgrade + consistent scale |
| **Spacing** | Tight, varies per section (`py-12` to `py-20`) | Very generous, 120–180px vertical section gaps | Need much more whitespace |
| **Colors** | Olive/khaki primary (HSL 57°), many grays | Near-black + white + single accent color | Simplify palette drastically |
| **Layout** | `max-w-7xl` (896px) container | 1200–1800px containers | Wider layout |
| **Cards** | `aspect-video`, `rounded-lg`, no shadow | Full-width, editorial, border-separated | Remove rounded card pattern |
| **Buttons** | Default shadcn, `size="lg"` | Pill-shaped, minimal, high contrast | Redesign CTA buttons |
| **Animations** | Gallery carousel only | Subtle transforms on scroll | Add entrance animations |
| **Navigation** | Sticky, minimal, `border-b` | Fixed, floating, clean | Refine nav design |
| **Hero** | `text-5xl`, image right side | Full-viewport, large text, confident | Make bolder |
| **Sections** | Tight vertical rhythm | Dramatic breathing room between sections | Double/triple spacing |

---

## Font System

### Recommended Fonts

Replace current Karla with Geist for a more modern feel. Keep Inter for body.

```
Primary (Headings):  Geist          → weights: 400, 500, 700
Secondary (Body):    Inter          → weights: 400, 500, 600
Mono (Accents):      Geist Mono     → weight: 400 (for labels, booking codes)
```

### Type Scale

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-1` | 64px / `text-6xl` | 400 | 1.1 | -0.04em | Hero heading |
| `display-2` | 48px / `text-5xl` | 400 | 1.1 | -0.03em | Section headings |
| `heading-1` | 36px / `text-4xl` | 500 | 1.2 | -0.02em | Sub-section titles |
| `heading-2` | 24px / `text-2xl` | 500 | 1.3 | -0.01em | Card titles, feature names |
| `body-lg` | 20px / `text-xl` | 400 | 1.6 | 0 | Hero description, lead text |
| `body` | 16px / `text-base` | 400 | 1.6 | 0 | Default body text |
| `body-sm` | 14px / `text-sm` | 500 | 1.5 | 0 | Nav links, captions |
| `label` | 12px / `text-xs` | 500 | 1.4 | 0.05em | Uppercase labels, tags |
| `mono` | 14px / `text-sm` | 400 | 1.5 | 0.02em | Booking codes, numbers |

### Key Typography Rules (from Hydra)
- **Tight letter-spacing on headings** (-0.04em to -0.02em) — creates editorial feel
- **Light weight headings** (400, not 700) — modern, confident, less aggressive
- **Generous line-height on body** (1.6) — improved readability
- **Uppercase tracking on labels** (0.05em) — subtle, sophisticated

---

## Color Palette

Simplify from the current olive/khaki system to a cleaner, high-contrast palette inspired by Hydra.

### Core Colors

| Token | Hex | HSL | Usage |
|-------|-----|-----|-------|
| `--bg-primary` | `#FFFFFF` | 0 0% 100% | Page background |
| `--bg-secondary` | `#F5F5F5` | 0 0% 96% | Section alternating background |
| `--bg-dark` | `#122023` | 170 33% 10% | Dark sections (footer, CTA) |
| `--text-primary` | `#1E1E1F` | 240 3% 12% | Headings, primary text |
| `--text-secondary` | `#6B6B6B` | 0 0% 42% | Body text, descriptions |
| `--text-muted` | `#999999` | 0 0% 60% | Captions, labels |
| `--text-on-dark` | `#FFFFFF` | 0 0% 100% | Text on dark backgrounds |
| `--accent` | `#E1FCAD` | 84 93% 83% | Accent highlight (Hydra green) |
| `--border` | `#DADADA` | 0 0% 85% | Borders, dividers |
| `--border-subtle` | `#99999952` | — | Subtle card separators |

### Adapting Accent Color to Trasmambang

Hydra uses a green accent (`#E1FCAD`). For a Jogja homestay, consider:

| Option | Hex | Vibe |
|--------|-----|------|
| Keep Hydra green | `#E1FCAD` | Fresh, modern, nature |
| Warm terracotta | `#E8C4A0` | Javanese earth tone, warm |
| Soft gold | `#F0DFA0` | Premium, hospitality |
| Current olive refined | `#C4CC8C` | Keep brand continuity |

> **Recommendation:** Warm terracotta `#E8C4A0` — feels Javanese, warm, and hospitality-appropriate. But keep green if you want maximum Hydra fidelity.

---

## Spacing System

### Section Spacing (Vertical)

Hydra uses dramatically generous spacing. Adapt for homestay:

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `section-gap` | 120px | `py-[120px]` | Between major sections |
| `section-gap-sm` | 80px | `py-20` | Between related sections |
| `content-gap` | 64px | `gap-16` | Between content blocks within a section |
| `element-gap` | 32px | `gap-8` | Between cards, items |
| `component-gap` | 24px | `gap-6` | Between related elements |
| `text-gap` | 16px | `gap-4` | Between text blocks |
| `micro-gap` | 8px | `gap-2` | Between icon + label, inline items |

### Container Widths

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `container-wide` | 1440px | `max-w-[1440px]` | Full-width sections (gallery) |
| `container` | 1200px | `max-w-[1200px]` | Default content container |
| `container-narrow` | 800px | `max-w-[800px]` | Text-heavy sections (FAQ, booking form) |

### Horizontal Padding

| Breakpoint | Value | Tailwind |
|------------|-------|----------|
| Mobile | 20px | `px-5` |
| Tablet (md) | 40px | `px-10` |
| Desktop (lg) | 64px | `px-16` |

**Key difference from current:** Your container is `max-w-7xl` (1024px). Hydra uses 1200–1800px. Widening to `max-w-[1200px]` gives the design more room to breathe.

---

## Component Tokens

### Buttons

**Primary CTA (Book Now)**
```
Background:       var(--bg-dark) → #122023
Text:             white
Padding:          14px 32px
Border-radius:    100px (full pill)
Font:             body-sm (14px), weight 500, uppercase, tracking 0.05em
Hover:            opacity 0.85 + slight scale(1.02)
Transition:       all 200ms ease
```

**Secondary / Ghost**
```
Background:       transparent
Border:           1px solid var(--border)
Text:             var(--text-primary)
Padding:          14px 32px
Border-radius:    100px (full pill)
Hover:            background var(--bg-secondary)
```

### Cards / Feature Blocks

Hydra doesn't use "card" patterns — it uses **sectioned layouts with border dividers**:

```
Pattern:          Vertical or horizontal sections, divided by 1px border
Border:           1px solid var(--border) on right or bottom
Padding:          32px–64px internal
Background:       transparent (no card background)
Shadow:           none
Border-radius:    0px (no rounding on content blocks)
```

**Current → New:** Remove `rounded-lg`, `shadow`, card backgrounds. Replace with border-separated editorial blocks.

### Navigation

```
Position:         fixed, top 16px, centered
Background:       white / rgba(255,255,255,0.9) with backdrop-blur
Padding:          12px 24px
Border-radius:    100px (pill nav bar)
Border:           1px solid var(--border-subtle)
Z-index:          50
Links:            body-sm, weight 500, text-secondary → hover text-primary
Logo:             heading-2 weight 500
```

### Section Pattern

```
Full-width background  →  constrained content inside
─────────────────────────────────────────────────
│                                                 │  py-[120px]
│    ┌──── container (1200px) ────────────┐      │
│    │                                     │      │
│    │  Section label (label, uppercase)   │      │  mb-4
│    │  Section heading (display-2)        │      │  mb-8
│    │  Section description (body-lg)      │      │  mb-16
│    │                                     │      │
│    │  ┌────┬────┬────┐                   │      │
│    │  │    │    │    │  Content grid     │      │
│    │  │    │    │    │  gap-8            │      │
│    │  └────┴────┴────┘                   │      │
│    └─────────────────────────────────────┘      │
│                                                 │
─────────────────────────────────────────────────
```

---

## Animation Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `fade-up` | `translateY(30px) → 0, opacity 0 → 1` | Section entrance |
| `fade-in` | `opacity 0 → 1` | Image reveal |
| `duration-default` | `600ms` | Standard animation speed |
| `duration-slow` | `900ms` | Hero, large elements |
| `easing` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Smooth deceleration |
| `stagger` | `100ms` between children | Card grids, list items |

Framer Motion config:
```tsx
const sectionVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  }
}

const staggerContainer = {
  visible: {
    transition: { staggerChildren: 0.1 }
  }
}
```

---

## Image Treatment

| Pattern | Style |
|---------|-------|
| Hero image | Full-width, `brightness(0.5)` overlay, text on top |
| Feature/gallery images | No rounded corners (`rounded-none`), edge-to-edge within container |
| Aspect ratios | `16:10` for hero, `4:3` for features, `1:1` for grid |
| Hover effect | Subtle `scale(1.03)` on 400ms transition |

---

## Section-by-Section Mapping

### What Changes Per Section (Design Only, No Content)

| Section | Current | Hydra-Inspired Change |
|---------|---------|----------------------|
| **Header** | Sticky, `border-b`, left-aligned logo | Fixed floating pill nav, centered, backdrop-blur |
| **Hero** | `text-5xl`, image beside text, `py-12` | Full-viewport height, `text-6xl`, text over dark image, `min-h-screen` |
| **Why Section** | 3-column cards with `rounded-lg` images | 3-column editorial blocks with border dividers, no card styling |
| **Gallery** | Infinite carousel, auto-scroll | Keep carousel (it's good), but remove rounded corners on images |
| **Facilities** | Grid with icons | Keep grid, increase spacing, use label typography for category headers |
| **Location** | Embedded Google Maps + text | Keep as-is, increase section padding |
| **FAQ** | Accordion, tight spacing | Increase spacing, wider accordion items, border-bottom separated |
| **CTA** | Image with overlay, centered text | Full-bleed dark section, larger text, more dramatic spacing |
| **Footer** | 3-column, standard | Wide editorial footer with border-top, more whitespace |

---

## Tailwind Config Changes Needed

```ts
// New/changed values in tailwind.config.ts
{
  fontFamily: {
    sans: ['var(--font-geist)', ...fontFamily.sans],  // Replace Inter as default
    body: ['var(--font-inter)', ...fontFamily.sans],   // Inter for body text
    mono: ['var(--font-geist-mono)', ...fontFamily.mono],
  },
  letterSpacing: {
    tighter: '-0.04em',  // display headings
    tight: '-0.02em',    // section headings
    wide: '0.05em',      // uppercase labels
  },
  maxWidth: {
    container: '1200px',
    'container-wide': '1440px',
    'container-narrow': '800px',
  },
  // Colors will be updated in globals.css CSS variables
}
```

---

## CSS Variable Updates (globals.css)

```css
:root {
  /* Backgrounds */
  --background: 0 0% 100%;          /* #FFFFFF */
  --background-secondary: 0 0% 96%; /* #F5F5F5 */

  /* Text */
  --foreground: 240 3% 12%;         /* #1E1E1F */
  --muted-foreground: 0 0% 42%;     /* #6B6B6B */

  /* Accent — choose one */
  --accent: 24 60% 77%;             /* #E8C4A0 terracotta */
  /* --accent: 84 93% 83%;          /* #E1FCAD hydra green */

  /* Surfaces */
  --card: 0 0% 100%;
  --card-foreground: 240 3% 12%;

  /* Borders */
  --border: 0 0% 85%;               /* #DADADA */

  /* Dark mode for CTA/footer sections */
  --bg-dark: 170 33% 10%;           /* #122023 */
}
```

---

## Implementation Priority

1. **Fonts** — swap Karla → Geist, install Geist Mono
2. **Spacing** — increase all section `py-*` to match Hydra's generous rhythm
3. **Container** — widen from `max-w-7xl` to `max-w-[1200px]`
4. **Colors** — update CSS variables to simplified palette
5. **Typography** — apply letter-spacing and weight rules
6. **Hero** — full-viewport redesign with text-over-image
7. **Cards → Editorial blocks** — remove rounded corners, add border dividers
8. **Buttons** — pill shape, uppercase, tracking
9. **Navigation** — floating pill nav
10. **Animations** — scroll-triggered fade-up on all sections
