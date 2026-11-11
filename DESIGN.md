---
name: SurTec · PETI 2027–2030
description: The engineering drawing of a project-based company; Blanco Técnico drafting paper that flips to a cyanotype on Azul Corporativo when the data integrates.
colors:
  azul-corporativo: "#1a365d"
  azul-corporativo-900: "#0f2443"
  azul-corporativo-950: "#0a1a33"
  azul-integracion: "#0066cc"
  azul-integracion-600: "#0057ad"
  azul-integracion-300: "#6fb2f5"
  azul-integracion-200: "#a9d1fa"
  azul-integracion-100: "#dcebfb"
  gris-estructural: "#4a5568"
  gris-estructural-400: "#718096"
  gris-estructural-200: "#cbd5e0"
  blanco-tecnico: "#f7fafc"
  blanco-tecnico-2: "#edf2f7"
  white: "#ffffff"
  on-dark-2: "#c3d3e8"
  line: "rgba(26, 54, 93, 0.16)"
  line-strong: "rgba(26, 54, 93, 0.32)"
  line-dark: "rgba(169, 209, 250, 0.2)"
  line-dark-strong: "rgba(169, 209, 250, 0.42)"
typography:
  display:
    fontFamily: "'Montserrat Variable', 'Montserrat', 'Segoe UI', sans-serif"
    fontSize: "clamp(2.4rem, min(5vw, 8.2vh), 5.1rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.038em"
  headline:
    fontFamily: "'Montserrat Variable', 'Montserrat', 'Segoe UI', sans-serif"
    fontSize: "clamp(2.05rem, 3.7vw, 3.9rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.032em"
  numeral:
    fontFamily: "'Montserrat Variable', 'Montserrat', 'Segoe UI', sans-serif"
    fontSize: "clamp(3rem, 5.4vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 0.95
    letterSpacing: "-0.04em"
    fontFeature: "tnum"
  title:
    fontFamily: "'Montserrat Variable', 'Montserrat', 'Segoe UI', sans-serif"
    fontSize: "clamp(1.25rem, 1.8vw, 1.7rem)"
    fontWeight: 700
    lineHeight: 1.2
  core-label:
    fontFamily: "'Montserrat Variable', 'Montserrat', 'Segoe UI', sans-serif"
    fontSize: "0.95rem"
    fontWeight: 800
    letterSpacing: "0.16em"
  lede:
    fontFamily: "'Archivo Variable', 'Archivo', 'Segoe UI', sans-serif"
    fontSize: "clamp(1.02rem, 1.2vw, 1.2rem)"
    fontWeight: 400
    lineHeight: 1.6
  body:
    fontFamily: "'Archivo Variable', 'Archivo', 'Segoe UI', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "'Archivo Variable', 'Archivo', 'Segoe UI', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.25
  field-label:
    fontFamily: "'Archivo Variable', 'Archivo', 'Segoe UI', sans-serif"
    fontSize: "0.68rem"
    fontWeight: 600
    letterSpacing: "0.08em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
  frame: "12px"
spacing:
  page-x: "clamp(20px, 5vw, 80px)"
  topbar: "72px"
  column-gap: "clamp(16px, 2vw, 32px)"
  grid-minor: "32px"
  grid-major: "160px"
  section-y: "clamp(96px, 12vw, 168px)"
components:
  button-primary:
    backgroundColor: "{colors.azul-integracion}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.azul-integracion-600}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.azul-corporativo}"
    rounded: "{rounded.md}"
    padding: "0 22px"
    height: "50px"
  button-ghost-hover:
    textColor: "{colors.azul-integracion}"
  button-small:
    padding: "0 16px"
    height: "40px"
  button-hero:
    padding: "0 34px"
    height: "64px"
  node-label:
    backgroundColor: "rgba(247, 250, 252, 0.9)"
    textColor: "{colors.azul-corporativo}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "5px 9px 6px"
  node-label-focus:
    backgroundColor: "{colors.azul-integracion}"
    textColor: "{colors.white}"
  chip:
    backgroundColor: "{colors.blanco-tecnico}"
    textColor: "{colors.azul-corporativo}"
    rounded: "{rounded.sm}"
    padding: "8px 14px"
  flow-node:
    backgroundColor: "{colors.white}"
    textColor: "{colors.azul-corporativo}"
    rounded: "{rounded.md}"
    padding: "11px 12px"
  flow-node-core:
    backgroundColor: "{colors.azul-corporativo}"
    textColor: "{colors.blanco-tecnico}"
    typography: "{typography.core-label}"
    rounded: "{rounded.md}"
    padding: "18px 12px"
  flow-node-trace:
    backgroundColor: "{colors.azul-integracion}"
    textColor: "{colors.white}"
  titleblock-field:
    textColor: "{colors.blanco-tecnico}"
    typography: "{typography.field-label}"
    padding: "12px 14px"
  browser-frame:
    backgroundColor: "{colors.azul-corporativo-950}"
    rounded: "{rounded.frame}"
---

# Design System: SurTec · PETI 2027–2030

## Overview

**Creative North Star: "The Living Plano"**

Every surface is a sheet from the engineering drawing of a company that works by projects. The light phase is Blanco Técnico drafting paper ruled with a fine grid, inked in Azul Corporativo and Gris Estructural with 1px technical strokes. When the story reaches integration, the same drawing turns to its negative: a cyanotype on Azul Corporativo where Azul Integración becomes signal light. The two grounds are one drawing in two exposures, never two brands.

The system is thin-lined, measured and quiet. Structure is drawn, not boxed: hairline rules divide lists and grids, dots mark nodes, rulers carry quantities, and a title block (cajetín) closes the sheet. Display type is Montserrat (the wordmark's voice), tight and heavy; reading text is Archivo with tabular numerals wherever a figure appears. Colour is almost entirely the four brand colours and their soft steps; Azul Integración is reserved for what is connected, active or actionable.

Motion explains the network rather than decorating it. A single persistent Three.js graph changes topology as the visitor scrolls (states 0–5), GSAP scrubs scenes to the scroll position, and every animated idea has a complete static drawing for reduced motion or no WebGL. Official SurTec logos appear as supplied, never redrawn.

**Key Characteristics:**
- Two grounds, one drawing: drafting-grid paper (light) and cyanotype on Azul Corporativo (dark), switched by `data-tone`.
- 1px technical strokes, 32px minor / 160px major drafting grid.
- Montserrat Variable display, Archivo Variable text, tabular numerals for all data.
- One radius family centred on gently squared corners (6px).
- Azul Integración means "connected / active / do this".
- Scroll-scrubbed, explanatory motion with a full static fallback.

## Colors

A four-colour brand palette with soft tints and shades derived from it; no foreign hue carries weight anywhere.

### Primary
- **Azul Corporativo** (azul-corporativo): the ink of the light phase (headings, body text on paper, flow node core, budget bars, trace path) and the ground of the dark phase. Its deeper steps (azul-corporativo-900, azul-corporativo-950) hold the phone body, the browser frame and dark label plates.

### Secondary
- **Azul Integración** (azul-integracion): the signal. Primary buttons, active rail step, lit flow wires and nodes, the goal ruler's target marker, roadmap progress, focus rings, selection. Hover deepens to azul-integracion-600.
- **Cyanotype Blues** (azul-integracion-300, -200, -100): signal on dark (azul-integracion-300 for active modules, focus ring on dark, highlighted words in display lines), cyanotype grid and line colour (azul-integracion-200 at low alpha), and the pale fill under OCR-read fields and ruler targets (azul-integracion-100).

### Neutral
- **Gris Estructural** (gris-estructural): secondary text on paper, inactive cascade dots, the fragmented state of the 3D network.
- **Structural Steps** (gris-estructural-400, -200): scrollbar thumb; idle flow wires and dashed receipt rules.
- **Blanco Técnico** (blanco-tecnico): the paper ground and text on dark. Blanco Técnico 2 (blanco-tecnico-2) is the one-step-greyer ground of the problem scene and the empty track of budget bars.
- **On-dark secondary** (on-dark-2): secondary text on the cyanotype.
- **Drafting lines** (line, line-strong on paper; line-dark, line-dark-strong on cyanotype): every hairline, border and divider. They are Azul Corporativo or azul-integracion-200 at fixed alpha, never grey.

### Named Rules
**The Signal Means Connected Rule.** Azul Integración marks only what is linked, active, measured as a target or clickable. A static decoration in signal blue is a bug.

**The Negative Print Rule.** The dark phase is the same drawing inverted, not a new theme: Azul Corporativo becomes the ground, Blanco Técnico the ink, azul-integracion-300 the signal. Tone flips at the integration point of the story, never per component.

**The Brand-Only Palette Rule.** Every colour is one of the four brand colours or a soft tint/shade of them, including the 3D network's per-state palette.

## Typography

**Display Font:** Montserrat Variable (with Montserrat, Segoe UI, sans-serif)
**Body Font:** Archivo Variable (with Archivo, Segoe UI, sans-serif)

**Character:** Montserrat carries the wordmark's geometric voice at heavy weights with tight negative tracking; Archivo is a sober technical grotesque for reading and labels. Numbers are always tabular so figures line up like a drawing's dimensions.

### Hierarchy
- **Display** (800, clamp(2.4rem, min(5vw, 8.2vh), 5.1rem), line-height 1): the hero title only.
- **Headline** (700, clamp(2.05rem, 3.7vw, 3.9rem), 1.05): scene headings; balanced wrapping. Also the "¿Y si…?" question and the closing line at similar scale.
- **Numeral** (700, clamp(3rem, 5.4vw, 5.6rem), 0.95, tabular): goal values; roadmap years run heavier (800, up to 6rem).
- **Title** (700, clamp(1.25rem, 1.8vw, 1.7rem), 1.2): roadmap phase names, ODS headings, panel titles.
- **Core label** (Montserrat 800, 0.95rem, 0.16em tracking, uppercase): the name of the core entity in a diagram, PROYECTO.
- **Lede** (Archivo 400, clamp(1.02rem, 1.2vw, 1.2rem), 1.6): scene introductions, max 40rem.
- **Body** (Archivo 400, 1.0625rem / 1rem on mobile, 1.6): running text; strong is weight 650.
- **Label** (Archivo 600, 0.8125rem, 1.25): node labels, chips, list items in diagrams; sub-lines at 0.72rem / 500 in the secondary colour.
- **Field label** (Archivo 600, 0.68rem, 0.08em, uppercase): title-block field names only.

### Named Rules
**The Tabular Figures Rule.** Any numeral that is data (goals, years, money, percentages, step numbers) sets with tabular-nums.

**The Two Voices Rule.** Montserrat speaks (titles, numbers, the core entity); Archivo explains (everything read or labelled). Never set paragraphs in Montserrat.

## Layout

A 12-column grid inside full-viewport sticky stages; copy sits in the left 5–6 columns while the 3D network or diagram occupies the right and the space behind. Page side padding is page-x; the right side reserves an extra 48px for the scene rail. The fixed top bar is 72px (60px at 760px and below). Flowing sections use a 1320px container with section-y vertical padding.

Scenes that tell a transformation pin to the viewport and scrub over `--len × 100svh`; diagram scenes (flow, OCR, architecture, roadmap) also pin on desktop and unpin into natural flow at 1023px wide or 620px tall. At 1100px copy widens to 6 columns; at 760px everything stacks to one column, the rail becomes a 2px top progress bar, and long lists collapse. Height-aware queries hide ledes on short desktop viewports rather than shrink type.

The drafting grid is a fixed background (32px minor, 160px major, 1px lines) behind the 3D canvas; opaque scenes repaint it on their own ground.

## Elevation & Depth

The drawing is flat. Depth comes from the 3D network itself, from tonal grounds and from 1px lines; surfaces do not float. Shadows are allowed in two narrow roles: a signal-tinted glow that says "active" (primary button, lit flow node) and the physical drop of device mockups (phone, browser frame, OCR form) that sit on the drawing as objects.

### Shadow Vocabulary
- **Signal lift** (`box-shadow: 0 1px 2px rgba(10, 26, 51, 0.18), 0 8px 20px -10px rgba(0, 102, 204, 0.7)`): primary button at rest.
- **Lit node** (`box-shadow: 0 6px 16px -10px rgba(0, 102, 204, 0.55)`): a flow node that the data pulse has reached.
- **Device drop** (`box-shadow: 0 30px 60px -24px rgba(10, 26, 51, 0.55), 0 2px 6px rgba(10, 26, 51, 0.2)`): the phone mockup; the browser frame uses a deeper version on the cyanotype.
- **Ring marker** (`box-shadow: 0 0 0 4px <ground>, 0 0 0 5px <ink>`): a dimension-style ring around the current cascade dot or OCR-read field.

### Named Rules
**The Flat Drawing Rule.** Panels, lists and diagrams carry no shadow; they are separated by 1px lines. Shadow is a state (active, lit) or a physical object (device), never a card style.

## Shapes

Gently squared corners throughout: 6px on buttons, flow nodes and the core diagram tile; 4px on small labels, chips and form outputs; 8px on isometric plates and the QR tile; 12px on the browser frame. Circles are reserved for nodes (7px list dots, 11px roadmap year markers, 3D points). Lines are 1px by default, 2px only for an active/traced state (rail step, trace chain, ruler target). Dashed lines mean provisional or transversal (receipt rules, the security band).

## Components

### Buttons
Confident, compact, drafting-tool precise.
- **Shape:** gently squared (6px).
- **Primary:** Azul Integración ground, white Archivo 600 text, 50px high, 22px side padding, signal lift shadow. Trailing stroke icon nudges up-right 2px on hover.
- **Hover / Focus:** hover deepens to azul-integracion-600 (pointer devices only); focus is a 2px Azul Integración outline at 3px offset (azul-integracion-300 on dark); press scales to 0.97.
- **Ghost:** transparent with a line-strong 1px border, ink text; hover turns border and text Azul Integración.
- **Sizes:** small (40px, used in the top bar; 36px on mobile with icon hidden) and hero (64px, full width on mobile).

### Chips
- **Style:** Blanco Técnico ground, 1px line border, 4px radius, Archivo 600 at 0.9rem, optional second line in Gris Estructural at 0.75rem. Used for the seven current tools in the static diagram.

### Node Labels
Leader-line labels projected from 3D nodes.
- **Style:** translucent ground (90% Blanco Técnico on paper, 88% azul-corporativo-900 on dark), 1px line border, 4px radius, label type, offset 14px from the node to the right or left.
- **Focus:** an interactive module label fills Azul Integración with white text.
- **Core:** the core entity label drops its box and sets in the core label style beneath the node, growing to clamp(1.4rem, 2.4vw, 2.2rem) when the network converges.

### Lists as Drawings
Cascades, module lists, pipelines and layers are bordered lists, not cards: 1px top/bottom rules, a 7px dot or check marker on the left, and scroll-driven states (dimmed → past → current/on).

### Flow Nodes
White tiles with a line-strong border and 6px radius in a fixed 8-column flow; the PROYECTO core is an Azul Corporativo tile in core label type. States: idle (steel text, faint border) → lit (Azul Integración border, lit node glow) → trace (Azul Integración fill, white text). Wires are SVG paths at 1.25px, gris-estructural-200 idle, Azul Integración lit, Azul Corporativo at 2.25px for the trace back to source.

### Goal Ruler
A dimension ruler under each 2030 goal: 30px tall, 1px Azul Corporativo baseline, ticks every 10% in line-strong, a pale azul-integracion-100 band from the target onward with a 2px Azul Integración edge and a small "meta" tag. It states a target; it never draws progress as achieved.

### Cajetín (Title Block)
The closing credits as an engineering title block: a 4-column grid with a line-dark-strong outer border and line-dark inner rules, field labels in field label style tinted azul-integracion-300, values in Archivo 0.88rem. Collapses to one column on mobile.

### Browser Frame
The mockup window on the cyanotype: azul-corporativo-950 frame, 12px radius, line-dark-strong border, a bar with three muted dots, a centred URL pill and a small primary "try" button; content area at 16:10 (390:720 on mobile).

### Navigation
Fixed top bar with the official isotipo (colour on paper, white on dark), a two-line Montserrat/Archivo title, and a small primary button. Transparent at rest; once scrolled it becomes 86% Blanco Técnico (90% Azul Corporativo on dark) with a 10px backdrop blur and a 1px bottom line. A right-edge rail of 1px ticks marks the ten scenes; the active tick grows to 30×2px in signal blue with its number, and a dark tooltip names the scene on hover/focus.

### 3D Network
One persistent graph through states 0–5: isolated nodes (Azul Corporativo / Gris Estructural on paper) → ring around PROYECTO (Azul Integración spokes) → fragmentation (greyed, severed) → convergence (white core, azul-integracion-300 spokes on the cyanotype) → modules in orbit → stable ecosystem. Ambient and key points use only brand colours; the canvas is transparent over the grid; it is lazy-loaded and absent without WebGL or with reduced motion, where a static diagram takes its place.

## Do's and Don'ts

### Do:
- **Do** draw structure with 1px lines in the line tokens; reserve 2px for active or traced states.
- **Do** keep the drafting grid at 32px / 160px behind every paper and cyanotype surface.
- **Do** use Azul Integración only for what is connected, active, targeted or clickable.
- **Do** flip to the cyanotype (data-tone dark) only at the story's integration point and keep it as the same drawing in negative.
- **Do** set every data figure in tabular numerals and label every goal as a 2030 target (meta).
- **Do** use the ease-out curve cubic-bezier(0.23, 1, 0.32, 1) for state changes (0.2s for controls, 0.3s for list states) and scrub scene timelines to scroll.
- **Do** ship a complete static version for prefers-reduced-motion and for no-WebGL: unpinned stages, static diagrams, every list state shown on.
- **Do** use the official SurTec logo and isotipo files as supplied, colour on paper and white on dark.

### Don't:
- **Don't** redraw, recolour, re-proportion or trace the SurTec logo; it is never reconstructed in SVG or CSS.
- **Don't** introduce a hue outside the four brand colours and their soft steps, in CSS or in the 3D palette.
- **Don't** wrap content in shadowed cards; separation is by line, shadow only for active state or device objects.
- **Don't** set paragraphs in Montserrat or headings in Archivo.
- **Don't** animate for decoration; if motion does not explain a change in the network or data, remove it.
- **Don't** present a goal ruler, number or bar as an achieved result.
