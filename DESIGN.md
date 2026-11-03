---
name: Camilo Avila Portfolio
description: High-assurance developer portfolio design system featuring obsidian navy surfaces, electric mint telemetry, and crisp monospace typography
colors:
  primary: "#64ffda"
  primary-hover: "#4cd8b8"
  neutral-bg: "#0a192f"
  neutral-surface: "#112240"
  neutral-surface-accent: "#1d3461"
  neutral-text: "#ccd6f6"
  neutral-muted: "#8892b0"
  border: "#233554"
typography:
  display:
    fontFamily: "Calibre, Inter, San Francisco, -apple-system, sans-serif"
    fontSize: "4.375rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Calibre, Inter, San Francisco, -apple-system, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Calibre, Inter, San Francisco, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Calibre, Inter, San Francisco, -apple-system, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "SF Mono, Fira Code, Fira Mono, Roboto Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.05em"
rounded:
  sm: "3px"
  md: "4px"
  lg: "8px"
  xl: "12px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  xxl: "80px"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "rgba(100, 255, 218, 0.08)"
    textColor: "{colors.primary-hover}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  card:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.lg}"
    padding: "24px"
  tag:
    backgroundColor: "rgba(100, 255, 218, 0.1)"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "2px 10px"
  input:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.neutral-text}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
---

# Design System: Camilo Avila Portfolio

## Overview

**Creative North Star: "The Developer's Dossier"**

"The Developer's Dossier" embodies a classic, minimalist dark developer portfolio rooted in quiet elegance, structural clarity, and high-contrast typography. Instead of flashy marketing ornament or decorative noise, every element communicates technical rigor, reliability, and precision. It draws inspiration from iconic developer workspaces—subdued darkroom canvas layers, terminal monospace telemetry, and focused phosphor mint accents.

The aesthetic establishes an authoritative, calm demeanor: content and code metrics lead the eye, while surfaces step down into deep obsidian navy backgrounds. Subtle interactive feedback—tactile outline buttons, faint reactive cursor glows, and micro-elevation lifts—reassures the user without breaking their focus.

**Key Characteristics:**
- **Calm, High-Contrast Palette:** Deep obsidian navy canvases (`#0a192f`) accented by purposeful electric mint (`#64ffda`) and legible silver slate (`#ccd6f6`).
- **Telegraphic Monospace Anchors:** Monospace fonts are consistently leveraged for technical metadata, numeric section counters, skill badges, and action buttons.
- **Architectural Surface Hierarchy:** Depth is created through flat tonal layering and 1px structural borders, augmented by reactive cursor glow rather than blurry drop shadows.
- **Scannable Density:** Structured cards and horizontal tab flows enable rapid parsing by hiring managers and engineering leads.

## Colors

The palette relies on a disciplined dark theme where high-chroma electric mint acts as a deliberate focal point against deep navy foundational tones.

### Primary
- **Electric Mint** (`#64ffda`): Reserved strictly for primary action outlines, active state indicators, section numbering, and interactive links.
- **Seafoam Hover** (`#4cd8b8`): Transition hover state for interactive mint targets.

### Neutral
- **Deep Obsidian Navy** (`#0a192f`): Root page background and low-level canvas backdrop.
- **Midnight Surface** (`#112240`): Card surfaces, elevated panels, modal backgrounds, and input backgrounds.
- **Steel Navy Accent** (`#1d3461`): Active tabs, secondary panel highlights, and elevated hover backgrounds.
- **Subtle Navy Border** (`#233554`): 1px structural borders dividing cards, inputs, and section rules.
- **Light Silver Slate** (`#ccd6f6`): High-contrast primary body text, titles, and major headings.
- **Cool Slate** (`#8892b0`): Secondary descriptive text, subheadings, and muted metadata.

### Named Rules
**The Ten-Percent Mint Rule.** Electric Mint is strictly allocated to ≤10% of any viewport. Its power comes from restraint; when everything glows, nothing is important.
**The Dual-Navy Contrast Rule.** Content panels must always sit on Midnight Surface (`#112240`) when placed over Deep Obsidian Navy (`#0a192f`), never directly on the root background without a defining boundary.

## Typography

**Display Font:** `Calibre`, `Inter`, `San Francisco`, `-apple-system`, `system-ui`, `sans-serif`
**Body Font:** `Calibre`, `Inter`, `San Francisco`, `-apple-system`, `system-ui`, `sans-serif`
**Label/Mono Font:** `SF Mono`, `Fira Code`, `Fira Mono`, `Roboto Mono`, `monospace`

**Character:** A dual-engine typographical system combining crisp, human-scale sans-serif for comfortable reading with sharp, monospace telemetry for technical markers, code identifiers, and section dividers.

### Hierarchy
- **Display** (600 weight, `clamp(38px, 7vw, 70px)`, 1.1 line-height, -0.02em tracking): Hero name statement; authoritative, high-impact introductory focal point.
- **Headline** (600 weight, `clamp(24px, 5vw, 32px)`, 1.2 line-height): Section titles (`h2.section-heading`), flanked by a leading monospace index number (`01.`, `02.`) and an extending horizontal border line.
- **Title** (600 weight, 1.25rem / 20px, 1.4 line-height): Card headers, company names, and subsection titles.
- **Body** (400 weight, 1rem / 16px, 1.6 line-height, max line length ~70ch): Core descriptive copy, experience bullets, and explanations.
- **Label** (400 weight, 0.875rem / 14px, 0.05em tracking): Monospace tags, button labels, form labels, and code pills.

### Named Rules
**The Monospace Provenance Rule.** Any piece of text indicating index sequence, technical category, code token, or system state must render in the monospace font stack.
**The Section Anchor Rule.** Every section heading must carry an electric mint monospace number prefix followed by a horizontal 1px rule extending toward the margin.

## Layout

The layout uses a constrained centered column grid that prioritizes scannable vertical progression across desktop and mobile viewports.

- **Container:** Max width of 1000px centered horizontally with `0 auto` margin and 24px horizontal gutters on desktop (`padding: 0 24px`), reducing to 16px on tablets and 12px on mobile viewports.
- **Vertical Spacing:** Generous section rhythm of 80px top/bottom padding on desktop (`padding: 80px 0`), condensing to 60px on tablets and 50px on mobile devices.
- **Hero Staging:** Dedicated top padding of 160px on desktop (100px on mobile) to provide breathable whitespace below the fixed navigation.
- **Responsive Fluidity:** Section headings use CSS `clamp()` to scale fluidly from 24px to 32px; the Experience section dynamically transitions from a vertical tab list on desktop to an overflow-x touch-scrolling horizontal tab strip on mobile (`max-width: 768px`).

## Elevation & Depth

Surfaces rely on flat architectural tonal stepping and reactive luminescence rather than traditional dropped shadows. Depth is established through distinct background luminosities bordered by 1px crisp dividers.

### Shadow Vocabulary
- **Glow Ambient** (`box-shadow: 0 0 12px rgba(100, 255, 218, 0.3)`): Dynamic radial light trail rendered by `@codaworks/react-glow` when the cursor moves across cards and tag groups.
- **Card Hover Elevation** (`transform: translateY(-2px); border-color: var(--accent)`): Physical response to cursor presence, shifting the card upwards by 2px and illuminating its border with mint green.

### Named Rules
**The Luminance-Over-Shadow Rule.** Never use heavy, dark blur shadows (`box-shadow: 0 20px 40px #000`) to create elevation. Create depth through background value shifts (`#0a192f` -> `#112240`) and selective mint border highlight.
**The Flat-At-Rest Rule.** All cards and containers remain completely flat at rest. Motion and glow appear only as an intentional response to user hovering or input focus.

## Shapes

The geometric silhouette is sharp, clean, and utilitarian, featuring minimal edge rounding that preserves an engineered feel.

- **Pills / Tags:** Subtle 3px radius (`border-radius: 3px`) for dense skill badges and category chips.
- **Buttons & Inputs:** Crisp 4px radius (`border-radius: 4px`), providing a tactile, structured perimeter.
- **Cards & Dialogs:** Modest 8px radius (`border-radius: 8px`) with 1px border (`#233554`).
- **Chatbot Container:** Soft 12px radius (`border-radius: 12px`) distinguishing the conversational assistant from static grid cards.

## Components

### Buttons
Tactile and telegraphic monospace outlines.
- **Shape:** 4px border radius (`border-radius: 4px`).
- **Primary:** Transparent background with 1px solid Electric Mint border (`1px solid #64ffda`), text color `#64ffda`, padding `12px 28px` (or `10px 20px` mobile).
- **Hover / Focus:** Faint mint background fill (`rgba(100, 255, 218, 0.08)`), transition `all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1)`.
- **Disabled:** Opacity 0.6 with `cursor: not-allowed`.

### Chips (Tags / Skills)
Compact, scannable skill tags for rapid competency review.
- **Style:** Background `rgba(100, 255, 218, 0.1)`, text color `#64ffda`, padding `2px 10px`, font size `12px`, monospace font.
- **Hover / Glow:** Illuminates with `box-shadow: 0 0 12px rgba(100, 255, 218, 0.3)` and `rgba(100, 255, 218, 0.2)` under active cursor tracking.

### Cards / Containers
Structured midnight surfaces for grouping skills, certifications, and experience.
- **Corner Style:** 8px radius (`border-radius: 8px`).
- **Background:** Midnight Surface (`#112240`).
- **Border:** 1px solid Subtle Navy Border (`1px solid #233554`).
- **Internal Padding:** 24px on desktop (`padding: 24px`), 16px on mobile.
- **Interaction:** Shifts `translateY(-2px)` with border color shifting to `#64ffda` on hover.

### Inputs / Fields
Utilitarian text inputs and message areas for form submissions and chat queries.
- **Style:** Background `#112240`, 1px border `#233554`, 4px radius, text color `#ccd6f6`, placeholder `#8892b0`, padding `12px 16px`.
- **Focus:** Border color transitions smoothly to Electric Mint (`#64ffda`), outline none.

### Navigation & Section Headings
Integrated anchor points with monospace indexing.
- **Section Heading:** Large sans-serif title with prepended mint monospace number (`01.`, `02.`) and an appended 300px horizontal divider line (`#233554`).
- **Experience Tabs:** Vertical tab list on desktop with 2px left border; active tab highlights in Electric Mint (`#64ffda`) and background `#112240`. On mobile, stacks into a smooth horizontal touch-scrolling rail.

### Signature Component: Inline AI Resume Assistant
An integrated conversational interface situated directly below the Hero section.
- **Container:** Centered max-width 700px, `#112240` background, 12px radius, 1px `#233554` border, 20px padding.
- **Message Thread:** Max height 300px scrollable area with custom navy scrollbar. User messages align right in deep steel navy; AI responses align left with formatted markdown, code blocks, and mint bold highlights.
- **Input Bar:** Integrated text input with inline directional submit button (`→`), autofocusing on load.

## Do's and Don'ts

### Do:
- **Do** maintain the 1000px maximum content width on desktop to guarantee reading comfort and visual structure.
- **Do** prefix major section headings with numeric monospace counters and trailing border rules.
- **Do** reserve Electric Mint (`#64ffda`) strictly for interactive elements, code tokens, and active highlights.
- **Do** use 1px solid `#233554` borders to establish clean structural boundaries between tonal layers.
- **Do** preserve full keyboard accessibility and visible focus rings on all interactive targets.

### Don't:
- **Don't** use heavy, blurry drop shadows (`box-shadow: 0 10px 30px rgba(0,0,0,0.5)`); maintain flat tonal layering.
- **Don't** introduce extraneous bright accent colors (e.g. bright red, purple, orange) that clash with the electric mint terminal aesthetic.
- **Don't** crowd content on mobile; ensure tab rails and tables enable horizontal touch scrolling without page overflow.
- **Don't** use full-saturation mint backgrounds for buttons; preserve the clean transparent outline button aesthetic.
