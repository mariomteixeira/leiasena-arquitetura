---
name: Léia Sena Arquitetura
description: Cream field, one brand navy, Didone lettering; the /bio hub in the brand's own material.
colors:
  navy: "#313c59"
  cream: "#F4F1EA"
  navy-muted: "rgba(49, 60, 89, 0.8)"
  cream-outline: "rgba(244, 241, 234, 0.55)"
  ice-white: "#ddd9ce"
  near-black: "#171717"
typography:
  headline:
    fontFamily: "Bodoni Moda, Didot, 'Bodoni 72', serif"
    fontSize: "1.55rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Bodoni Moda, Didot, 'Bodoni 72', serif"
    fontSize: "1.3rem"
    fontWeight: 400
    lineHeight: 1.25
    letterSpacing: "0.025em"
  body:
    fontFamily: "Geist, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
rounded:
  full: "9999px"
spacing:
  xs: "10px"
  sm: "12px"
  md: "20px"
  lg: "24px"
  xl: "28px"
  xxl: "32px"
components:
  pill-link:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.cream}"
    typography: "{typography.title}"
    rounded: "{rounded.full}"
    padding: "0 52px 0 12px"
    height: "60px"
  pill-link-icon-disc:
    backgroundColor: "transparent"
    textColor: "{colors.cream}"
    rounded: "{rounded.full}"
    size: "40px"
  pill-link-icon-disc-hover:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.navy}"
  avatar:
    rounded: "{rounded.full}"
    size: "112px"
  logo:
    textColor: "{colors.navy}"
    width: "112px"
---

# Design System: Léia Sena Arquitetura

## Overview

**Creative North Star: "The Letterpressed Calling Card"**

The system is the brand's own stationery turned into a screen: a warm cream field, a single committed navy taken from the logo, and Didone lettering (Bodoni Moda) that echoes the logo's own serifs. Nothing is added that the logo does not already contain. Depth comes from ink on paper, not from surfaces stacked on surfaces: there are no cards, no gradients, no glass, no second accent. The one signature object is the full-width navy pill, a solid stamp of ink with a circled outline icon at the left, a serif label centered, and a chevron at the right.

Density is low and deliberate. One column, one centered stack, everything sized to fit a 390×844 or 360×780 phone without scrolling. The page arrives once, as a single orchestrated entrance (elements rise 18px in sequence while the portrait ring draws itself), then goes still; motion afterward is limited to small tactile responses on the pills. Type has two voices only: Bodoni for the words that identify the architect (her title, the link labels) and Geist Sans for the one paragraph of running text.

Confirmed rejections, evidenced by the build: the generic white-card Linktree list; a second accent color; icon glyph fonts; any font besides Bodoni Moda and Geist.

**Key Characteristics:**
- Cream ground, navy ink, cream reversed out of navy; three combinations and no more.
- Bodoni Moda for identity and labels, Geist Sans for body; no uppercase display, no eyebrows.
- Fully round geometry: circular portrait, circular ring, circular icon discs, capsule pills.
- Flat surfaces; the pill's soft navy-tinted shadow is the only depth in the system.
- One staggered entrance (900ms rise, 1400ms ring draw), then rest; reduced-motion disables all of it.
- Safe-area-aware single column, max width 420px, touch targets 60px tall.

## Colors

One navy, one cream, and translucent versions of each; the palette is a two-ink print job.

### Primary
- **Brand Navy** (`{colors.navy}`, the logo's blue): the only chromatic color. Fills every pill, colors the masked logo and the portrait ring via `currentColor`, and is the text color for the heading. Everything that is not cream is this navy.
- **Navy Muted** (`{colors.navy-muted}`, navy at 80% opacity): the running paragraph. The single step down in the type hierarchy is done with opacity, not a second gray.

### Neutral
- **Cream** (`{colors.cream}`): the /bio ground (set on `<main>` and on `body` for the route), the `theme-color`, and the text and icon color reversed out of navy pills. Observed: it is written as a literal in `app/bio/page.tsx` and `layout.tsx`, not yet declared in the `@theme` block of `app/globals.css`; the frontmatter value is the one the build ships.
- **Cream Outline** (`{colors.cream-outline}`, cream at 55%): the 1px ring around the pill's icon disc at rest. On hover the disc fills solid cream and the icon inverts to navy.
- **Ice White** (`{colors.ice-white}`) and **Near Black** (`{colors.near-black}`): the incumbent site's ground and foreground (`--background` / `--foreground` in `app/globals.css`). They do not appear on /bio; recorded so new surfaces know the two grounds are siblings, not the same token. Cream is warmer and lighter than ice white by design.

### Named Rules
**The One Ink Rule.** Navy is the only chromatic color on the surface. Hierarchy is made with opacity of navy (80% for body) or of cream (55% for outlines, 60% for the chevron), never with a second hue or a neutral gray.

**The Reversal Rule.** Cream and navy swap roles at the component boundary and nowhere else: cream ground carries navy elements; a navy pill carries cream text and icons; the hovered icon disc reverses again to cream-on-navy. No tints, no mid-tones, no gradients between them.

**The Current-Color Rule.** Brand assets take their color from context. The logo is a CSS mask filled with `currentColor`; the portrait ring is an SVG stroke in `currentColor`; icons are stroked in `currentColor`. Never ship a logo or icon with a baked-in fill.

## Typography

**Display Font:** Bodoni Moda (with Didot, Bodoni 72, serif), loaded via `next/font` as `--font-bodoni-moda`, normal and italic
**Body Font:** Geist Sans (with system-ui, sans-serif), `--font-geist-sans`
**Label/Mono Font:** Geist Mono, `--font-geist-mono`; present in the token layer, not used on /bio

**Character:** A high-contrast Didone doing exactly what the logo's lettering does, paired with a quiet geometric sans that stays out of the way. The serif speaks the name and the actions; the sans carries the one paragraph of credentials. Neither voice is ever set in uppercase on this surface.

### Hierarchy
- **Headline** (Bodoni Moda 400, 1.55rem, line-height 1.25, tracking -0.025em): the architect's title ("Arquiteta e urbanista"). One per surface, directly under the portrait.
- **Title** (Bodoni Moda 400, 1.3rem, tracking +0.025em): the pill label, centered between the icon disc and the chevron. Slightly opened tracking so Bodoni's thin hairlines survive reversed out of navy.
- **Body** (Geist Sans 400, 14.5px, line-height 1.55, navy at 80%): the credentials paragraph, centered, held to the 420px column (about 55ch at this size).

### Named Rules
**The Two Voices Rule.** Bodoni Moda is for identity and calls to action; Geist Sans is for running text. Do not set body copy in Bodoni, and do not set a label or heading in Geist on this surface.

**The Scoped Sans Rule.** `--font-sans` maps to Geist, but the root layout never applies it; only `/bio` opts in with `font-sans` on its layout wrapper. Observed fact: the rest of the site currently renders the platform default sans for body text. Any new surface that wants Geist must apply `font-sans` itself.

## Layout

A single centered column. `<main>` is a full-height (`min-height: 100dvh`) flex column, centered on both axes, with 24px horizontal padding and safe-area-aware vertical padding: `max(2rem, env(safe-area-inset-top))` above and `max(1.75rem, env(safe-area-inset-bottom))` below (`viewport-fit: cover` is set on the route). Inside it, one stack with `max-width: 420px`, `width: 100%`, all children centered and text centered.

Vertical rhythm, top to bottom, as built: logo (112px wide, aspect 5906:4556) → 24px → portrait (112px, ring extends 10px outside it) → 20px → headline → 12px → body → 24px → link list with 10px gaps between 60px pills. The whole stack fits 390×844 and 360×780 without scrolling; that fit is the layout's invariant. There are no breakpoints on /bio: the column simply stops growing at 420px on wider screens.

Spacing tokens in the frontmatter are the steps the surface actually uses (10, 12, 20, 24, 28, 32px); there is no 4px grid doctrine beyond those.

## Elevation & Depth

Flat by default. The ground is one solid cream; the logo, portrait, and text sit directly on it with no container. The only shadow in the system belongs to the pill: a soft, navy-tinted drop pushed downward and pulled in at the edges so it reads as a stamp resting on paper, not a floating card. Depth is otherwise conveyed by reversal (navy on cream, cream on navy) and by the portrait's hairline ring.

### Shadow Vocabulary
- **Pill Rest** (`box-shadow: 0 14px 28px -14px rgba(49, 60, 89, 0.6)`): under every navy pill, at rest and on hover. The tint is the navy itself at 60%, never black.

### Named Rules
**The Ink Shadow Rule.** If a surface needs a shadow, it is the pill shadow, tinted with navy. No black shadows, no hard offsets, no shadows on text, logo, or portrait.

## Shapes

Everything on the surface is a circle or a capsule. The portrait is a full circle (112px, `object-position: 50% 28%` to keep the face centered); its ring is a separate SVG circle 10px outside the image, stroked at 1.5 viewBox units (about 2px rendered) and drawn on entrance. Icon discs are 40px circles with a 1px cream outline. Links are full-height capsules (`border-radius: 9999px`, 60px tall). Icons themselves are authored on a 24px grid with 1.75px strokes, round caps and round joins, rendered at 20px; the chevron is the same stroke at 60% opacity. There are no rectangles with corners on /bio; the only straight edges are the logo's letterforms.

## Components

### Pill Link (signature component)
A solid navy capsule that behaves like a pressed button and reads like a label. Four of them, stacked, identical in construction.
- **Shape:** full capsule (`border-radius: 9999px`), 60px tall, full column width.
- **Color:** navy fill, cream text and icons, Pill Rest shadow.
- **Anatomy:** 12px left padding → 40px icon disc (1px cream-55% outline, 20px stroked icon centered) → label in Title type, centered in the remaining space with 8px side padding → chevron (20px, 60% opacity) absolutely positioned 20px from the right edge; right padding reserved at 52px so the label centers on the pill, not on the leftover space.
- **Hover:** the pill lifts 2px (`translateY(-2px)`, 300ms ease-out); the icon disc fills solid cream and the icon turns navy (300ms color transition); the chevron nudges 4px right.
- **Active:** the pill scales to 0.97.
- **Focus (keyboard):** 2px solid outline in `currentColor`, offset 3px, so the ring is navy on cream around the whole capsule.
- **External links** open in a new tab with `rel="noopener noreferrer"`; internal ones stay in-tab. No visual difference between the two.

### Portrait
- **Shape:** 112px circle, B&W photograph, `object-fit: cover`, `object-position: 50% 28%`.
- **Ring:** SVG circle in `currentColor` (navy), inset -10px around the image, 1.5-unit stroke on a 100-unit viewBox, rotated -90° so the draw starts at 12 o'clock. Uses `pathLength="1"` and the `.bio-draw` class.
- **Motion:** the ring draws over 1400ms starting 300ms after page entrance.

### Logo
- **Rendering:** the vertical lockup (`public/assets/logo/svg/svgs/vertical-azul.svg`) applied as a CSS mask on a `currentColor` block, `role="img"` with the brand name as its label. 112px wide on /bio; aspect ratio fixed at 5906:4556.
- **Color:** inherits navy from the page; recolors with context per the Current-Color Rule.

### Icons
- **Set:** four authored link icons (Instagram, briefcase, globe, chat) plus a right chevron, all in `app/bio/_components/icons.tsx`.
- **Construction:** 24px viewBox, `fill: none`, `stroke: currentColor`, stroke width 1.75, round caps and joins, `aria-hidden`. The chat icon's three dots use a 2.25 stroke so they read at 20px.
- **Usage:** rendered at 20px inside the 40px disc.

### Entrance Motion
One orchestrated entrance shared by every element, driven by two classes and a `--d` delay custom property (`delay(ms)` helper in `app/bio/_lib/motion.ts`).
- **Rise** (`.bio-rise`): from `opacity: 0; translateY(18px)` to rest, 900ms, easing `cubic-bezier(0.16, 1, 0.3, 1)`, `animation-fill-mode: backwards`.
- **Draw** (`.bio-draw`): stroke dash offset 1 → 0, 1400ms, same easing, backwards fill.
- **Stagger as built:** logo 0ms, portrait 120ms, headline 200ms, body 260ms, ring 300ms, pills 380ms + 90ms per pill.
- **Rule:** fill-mode is `backwards`, never `forwards` or `both`, so the resting state is the element's own CSS and hover/active transforms keep working after the entrance.
- **Reduced motion:** `prefers-reduced-motion: reduce` sets `animation: none` on every `bio-*` class; the page appears at rest.

## Do's and Don'ts

### Do:
- **Do** use only navy (`#313c59`) and cream (`#F4F1EA`), with opacity steps of each for hierarchy (navy 80% body, cream 55% outlines, cream 60% chevron).
- **Do** set identity text and link labels in Bodoni Moda (1.55rem headline, 1.3rem labels) and running text in Geist Sans at 14.5px/1.55.
- **Do** keep every interactive target a 60px-tall full-width capsule with the icon-disc / centered-label / chevron anatomy.
- **Do** render the logo and icons in `currentColor` (CSS mask, SVG stroke) so they take the surface's ink.
- **Do** keep the whole surface inside one 420px column that fits 390×844 and 360×780 without scrolling, with safe-area padding on both vertical edges.
- **Do** stage entrance motion through `--d` and the `.bio-rise` / `.bio-draw` classes with `backwards` fill, and honor `prefers-reduced-motion`.
- **Do** give keyboard focus a 2px `currentColor` outline offset 3px.

### Don't:
- **Don't** introduce a second hue, a neutral gray, a gradient, or a translucent "glass" surface; the build has none.
- **Don't** put content in cards or bordered containers on this surface; the ground carries everything directly.
- **Don't** use a black or hard-offset shadow; the only shadow is the navy-tinted Pill Rest.
- **Don't** set Bodoni in uppercase or add an eyebrow/kicker above the headline; the identity stack is logo → portrait → title → paragraph, nothing more.
- **Don't** pull icons from an icon font or a package; author them on the 24px / 1.75-stroke / round-cap grid in `icons.tsx`.
- **Don't** reuse the incumbent site's ice-white ground (`#ddd9ce`) or near-black text on a /bio-world surface; they are the sibling world, not this one.
