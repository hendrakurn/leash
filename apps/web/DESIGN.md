---
name: Leash Web
description: A paper-ground instrument for on-chain spending mandates, where the refusal is the only loud element in the system.
colors:
  paper: "#f2f1ec"
  ink: "#171818"
  ink-secondary: "rgba(23, 24, 24, 0.72)"
  ink-tertiary: "rgba(23, 24, 24, 0.62)"
  hairline: "rgba(23, 24, 24, 0.16)"
  hairline-strong: "rgba(23, 24, 24, 0.32)"
  dot-ground: "rgba(23, 24, 24, 0.09)"
  ultramarine: "#1520b8"
  ultramarine-hi: "#2e3ae8"
  ultramarine-pale: "#ccdbff"
  refuse: "#c0201a"
  refuse-deep: "#96150f"
  refuse-wash: "rgba(192, 32, 26, 0.07)"
typography:
  display:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "clamp(2.75rem, 8vw, 6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 87"
  headline:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 87"
  title:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "clamp(1.75rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "-0.035em"
    fontVariation: "'wdth' 87"
  body:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
    fontFeature: "'ss01', 'cv01'"
  body-small:
    fontFamily: "Geist Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  value:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "clamp(2rem, 6vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1
  mono-body:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.6875rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.1em"
  stamp:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.02em"
    fontVariation: "'wdth' 87"
rounded:
  none: "0"
  focus: "2px"
spacing:
  row: "12px"
  card: "24px"
  card-lg: "32px"
  gutter: "20px"
  gutter-lg: "32px"
  section: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.ultramarine}"
    textColor: "{colors.paper}"
    typography: "{typography.body-small}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.ultramarine-hi}"
    textColor: "{colors.paper}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-small}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.ink}"
  button-danger:
    backgroundColor: "transparent"
    textColor: "{colors.refuse}"
    typography: "{typography.body-small}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-danger-hover:
    backgroundColor: "{colors.refuse-wash}"
    textColor: "{colors.refuse}"
  button-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.ink-tertiary}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
  button-compact:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "6px 12px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.mono-body}"
    rounded: "{rounded.none}"
    padding: "12px 16px"
    width: "100%"
  card-instrument:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  field-row:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.mono-body}"
    rounded: "{rounded.none}"
    padding: "12px 0"
  meter-track:
    backgroundColor: "{colors.hairline}"
    rounded: "{rounded.none}"
    height: "8px"
    width: "100%"
  meter-fill:
    backgroundColor: "{colors.ultramarine}"
    rounded: "{rounded.none}"
    height: "8px"
  meter-fill-exhausted:
    backgroundColor: "{colors.refuse}"
    rounded: "{rounded.none}"
    height: "8px"
  stamp-refused:
    backgroundColor: "transparent"
    textColor: "{colors.refuse}"
    typography: "{typography.stamp}"
    rounded: "{rounded.none}"
    padding: "10px 20px"
---

# Design System: Leash Web

## Overview

**Creative North Star: "The Stamped Ledger"**

Leash's web surface is a paper document that happens to be live. The ground is a warm off-white with a 4px dot texture pressed into it; everything structural is a 1px hairline; every real number is set in mono and sits in a ruled row. There are no cards floating over anything, no shadows, no rounded corners, no gradient. The page reads as an instrument you could print — an authorization ledger — right up until a payment gets refused, at which point a red stamp lands across the row at a hard −8° tilt and is the single loudest thing the system will ever do.

That imbalance is the design. Approval is deliberately quiet: an ultramarine hairline-weight check icon and a small tracked mono word, nothing more. Refusal is deliberately loud: the full stamp, carrying the contract's own error name (`TargetNotAllowed`, `AmountExceedsCap`, `Revoked`) rather than any phrasing the interface invented. The visual system spends almost all of its force on one moment, and everything else is built quiet enough for that moment to register.

The world is deliberately narrow: two hues (ultramarine and a refusal red) over a paper/ink pair, one display face at a squeezed width, one grotesque, one mono. The confirmed rejections are the dark-neon protocol landing and its three-column feature triptych — the build carries that refusal as a literal comment in its own served markup (`src/app/layout.tsx`). Craft level is benchmarked against a pinned reference (agentcard.sh, recorded in PRODUCT.md), but its identity is explicitly not inherited: the reference has no red and no stamp, and the reference uses 10–16px radii alongside hard 0 where Leash is 0 everywhere.

**Key Characteristics:**
- Paper ground with a 4px dot texture; ink is near-black, never pure black
- Zero shadows, zero radii; depth is hairlines, tint, and one backdrop blur
- Two hues only — ultramarine for the quiet state, red reserved entirely for refusal
- No green anywhere in the system, at all, by construction
- Squeezed display type set very tight (−0.035em, 0.92 line-height) against generous body measure
- Mono is the machine register: on-chain values, contract identifiers, and small uppercase labels
- One authored motion moment (the stamp); everything else is a 0.15s state transition

## Colors

Two hues over a paper/ink pair: an ultramarine that carries structure and the quiet affirmative state, and a refusal red that appears only when the contract has declined something.

### Primary
- **Ultramarine** (`{colors.ultramarine}`): The system's only structural accent. It carries the primary button fill, the meter's remaining-balance bar, the "Authorized" / "Active" / "Settled once" state marks, focus outlines, text selection, and the input focus border. It is never used to mean "success" the way green would — it means *the system is operating normally*.
- **Ultramarine Bright** (`{colors.ultramarine-hi}`): Hover state for filled ultramarine surfaces only (primary button, primary link-button). It is not a second accent.
- **Pale Ultramarine** (`{colors.ultramarine-pale}`): Declared in the token layer and currently unapplied in components. Reserved for a low-emphasis ultramarine fill; do not introduce it as a new decorative surface without a reason.

### Secondary
- **Refusal Red** (`{colors.refuse}`): The stamp, and only things that are literally a contract rejection — the stamp border and word, error names printed from the ABI, the hostile-preset outline on the agent console, the exhausted meter fill, the wrong-network button, and connection error text. This is the most reserved color in the system.
- **Deep Refusal** (`{colors.refuse-deep}`): Declared in the token layer and currently unapplied. Reserved as the pressed/darker step of the refusal; it is not a second red.
- **Refusal Wash** (`{colors.refuse-wash}`): A ~7% tint of the refusal red used as a row background under refused ledger entries, refused agent steps, and the error-vocabulary section. It marks a region as *containing* a refusal without shouting; the stamp does the shouting.

### Neutral
- **Paper** (`{colors.paper}`): The page ground. Also the fill of the instrument panel that sits on the dotted hero, so the panel reads as a card cut out of the same stock rather than a floating surface.
- **Ink** (`{colors.ink}`): All primary text, and the ground in dark mode. Near-black, never `#000`.
- **Ink Secondary** (`{colors.ink-secondary}`): Body prose that supports a heading — the paragraph under every display statement. This is the most common text color on the site after ink itself.
- **Ink Tertiary** (`{colors.ink-tertiary}`): Annotations, footnotes, disabled labels, validation problem lists, "nothing here yet" copy, and the recovery half of every error explanation. Confusingly named in source (`--wt-45` is the *lighter* of the two, `--wt-65` the stronger) — trust the role, not the number.
- **Hairline** (`{colors.hairline}`): The global default border color for every element (`* { border-color: var(--hair) }`). It is also the meter's empty track and the ghost button's hover fill.
- **Hairline Strong** (`{colors.hairline-strong}`): Disabled control borders only.
- **Dot Ground** (`{colors.dot-ground}`): The 1px radial dot on a 4px grid that textures the hero and the closing section. It is a ground, never a fill for a component.

### Named Rules

**The No-Green Rule.** There is no green anywhere in this system, and none may be added. Encoding allow/deny as green-versus-red would make hue the sole carrier of the most important distinction in the product. The affirmative state is ultramarine plus a mono word; the negative state is a stamp that carries word, frame, tilt, and color at once, so the meaning survives being desaturated, printed, or read by someone who cannot separate the two hues.

**The Red-Is-Refusal-Only Rule.** Red never appears as branding, decoration, warning-in-general, or emphasis. If red is on the screen, the chain declined something. The mock-settlement panel on the landing page is deliberately *not* in red for exactly this reason — it contains no refusal.

**The Same-Two-Hues Rule.** Dark mode inverts ground and ink (`{colors.paper}` and `{colors.ink}` swap roles) and re-tints — never re-hues. Dark-mode ultramarine and dark-mode red are lightness tints of the same two hues at the same angles, lifted only enough to clear contrast on dark ground. Substituting a different accent hue for dark mode would break "red exists only as the refusal stamp" the moment the scheme changed. Both schemes ship: the `prefers-color-scheme` media query is the default signal, and `:root[data-theme="light"]` / `:root[data-theme="dark"]` override it in both directions.

## Typography

**Display Font:** Archivo (variable, `wdth` axis at 87) with Geist Sans fallback
**Body Font:** Geist Sans (with `ui-sans-serif`, `system-ui`)
**Label/Mono Font:** Geist Mono (with `ui-monospace`, SFMono-Regular, Menlo)

**Character:** A squeezed, heavy, aggressively tight display voice making flat declarative statements ("Money stays in fiat rails. Spending authority is enforced on-chain.") sitting directly above a neutral, unhurried grotesque and a mono that is never decorative. The display carries the argument; the body explains it; the mono is the machine talking. Geist Sans runs with its `ss01` and `cv01` stylistic sets enabled globally.

**Known substitution:** Archivo at `font-variation-settings: "wdth" 87` stands in for `OT Neue Montreal Semi Squeezed`, the pinned reference's display face. Montreal is commercial (Pangram Pangram) and unlicensed here. If a license is acquired, replace the `--font-display` stack and re-tune `letter-spacing` and the `wdth` setting; the 87 width and −0.035em tracking exist to approximate Montreal's proportions and are not independently meaningful. Geist Sans and Geist Mono are free and require no substitution.

### Hierarchy
- **Display** (700, `{typography.display}`, 0.92): The single full-bleed statement in the first viewport, and the closing call. One per page, maximum, at this size. Always `text-wrap: balance` and always measure-capped between 16ch and 22ch so it breaks into a stacked block rather than a wide banner.
- **Headline** (700, `{typography.headline}`, 0.92): Section openers and interior page `h1`s. Same face, same tracking, same balance behavior.
- **Title** (700, `{typography.title}`, 0.92): Sub-section headings and terse state pages (no mandate found, no deployment). Also the wordmark in the header, at `1.25rem` with slightly tighter tracking (−0.04em).
- **Body** (400, `{typography.body}`, 1.625): The paragraph that follows every heading, in ink-secondary. Capped at 45–48ch.
- **Body Small** (400, `{typography.body-small}`, 1.625): Footnotes, annotations under form fields, the mocked/real lists in the footer, error explanations.
- **Value** (400, `{typography.value}`, 1.0): The remaining-balance figure. Mono, set at display scale, no tracking adjustment. This is the only place mono runs large, and it is always an on-chain number.
- **Mono Body** (400, `{typography.mono-body}`, 1.625): Field values, hashes, addresses, prompt echoes, backend output blocks, and every text input.
- **Label** (400, `{typography.label}`, 0.1em, uppercase, ink-tertiary): The `.mono-label` voice. Every field name, section eyebrow, nav item, metadata line, and status footnote. It is the connective tissue of the entire site.
- **Stamp** (800, `{typography.stamp}`, uppercase, 0.02em): Display face at its heaviest, with the contract's error name set beneath in semibold mono at `0.78rem` / 0.06em. Refusal only.

### Named Rules

**The Mono-Is-Machine Rule.** Mono is a register, not a texture. It is permitted on: real on-chain values (amounts, addresses, hashes, block numbers, mandate IDs, chain IDs), the contract's own identifiers quoted inline in prose (`AuthorizationGranted`, `allowedTargets`, `address[] targets`), the eight error names, machine input and output (the agent prompt textarea, the prompt echo, backend output blocks, every form field that accepts a hex value), and the small uppercase `.mono-label` voice. It is never used to make ordinary prose look technical. No sentence of body copy is ever set in mono.

**The 48ch Rule.** Body measure caps at 48ch or below — the observed set is 40, 42, 45, 46, 47, and 48ch — because `ch` overestimates real measure in a proportional face and 48ch renders closer to a comfortable 65–70 characters. Display measure caps much tighter (16–24ch) so statements break as blocks. *Discrepancy, as built:* one paragraph exceeds this — the revoked/expired explanation on the mandate detail page is capped at 60ch (`src/app/mandate/[id]/page.tsx:127`). Treat 48ch as the rule and that instance as drift to correct, not as precedent.

**The Contract's Own Word Rule.** Refusal text is never paraphrased. `ERROR_COPY` in `src/lib/leash.ts` is a copy system, not a data table: it maps each of the eight ABI errors to a `problem` sentence and a `recovery` sentence, and the interface always prints the raw error name in mono alongside them. `recovery` is allowed to say that nothing can be done — for a revoked mandate that is the correct and intended answer. Never invent a ninth error, and never soften an existing one.

## Layout

A single centered column, `max-width: 76rem`, with `{spacing.gutter}` side padding rising to `{spacing.gutter-lg}` at the `sm` breakpoint. Every page is built from this one `Shell`; there is no secondary container width and no full-bleed content other than section backgrounds and rules, which extend edge-to-edge while their contents stay in the shell.

Vertical rhythm is coarse and consistent: sections run `{spacing.section}` top and bottom, rising to `{spacing.section-lg}` at `sm`. Interior pages open at 64px and the terse states (no mandate, registered confirmation) at 96px. The footer sits 96px below whatever precedes it. Within a section, the ladder is heading → 24px → body → 36–56px → content; hairline-ruled rows are 12px vertical on field lists and 20–32px on ledger rows.

Sections separate with a 1px border, not with whitespace alone, and are visually differentiated by ground rather than by container: the hero and the closing section carry the dot texture, the error-vocabulary section carries the refusal wash, and the rest sit on plain paper. Nothing is nested more than one level.

Content grids are asymmetric and explicit rather than equal-column: `minmax(0,32rem) 1fr` for form-plus-explainer, `1fr 22rem` for detail-plus-sidebar, `16rem 1fr` for term-plus-definition, `auto 1fr auto` for feed rows. Everything collapses to a single stacked column below its breakpoint.

Breakpoints in use are Tailwind's `sm` (640px), `md` (768px), and `lg` (1024px), applied in that order of frequency. The site header is the only element with a distinct mobile composition: it stacks into two rows below `sm` with the wallet control moving up beside the wordmark, so a 390px visitor keeps every route and the deployment status. Deployment status is shown at every width; only the network name is dropped below `md`.

### Named Rules

**The Hairline Grid Rule.** Structure is drawn with 1px hairlines, never with fills, boxes, or spacing alone. A list of facts is a stack of hairline-ruled rows with the label left and the value right; a section boundary is a hairline; a panel is a hairline rectangle. If something needs to be visually separated, rule it.

**The One Column Rule.** There is exactly one container width. Do not introduce a narrower "prose" container or a wider "showcase" container — measure is controlled per-element with `ch` caps inside the single shell.

## Elevation & Depth

This system has no shadows at all. There is not a single `box-shadow` in the codebase, and none should be added. Depth is entirely tonal and linear: a 1px hairline separates planes, the 4px dot ground pushes the hero back behind the paper-filled instrument panel that sits on it, and a ~7% refusal wash marks a region as belonging to a rejection. The instrument panel reads as raised only because it is filled with `{colors.paper}` while the dotted ground behind it is textured — same color, different surface.

The one atmospheric effect in the build is the sticky site header: `backdrop-filter: blur(12px)` over a `color-mix(in srgb, paper 88%, transparent)` fill, so content dissolves under it rather than colliding with its hairline bottom border. That is the entire depth vocabulary.

### Named Rules

**The Zero-Shadow Rule.** Surfaces never lift. If a new component needs to read as separate, give it a hairline border, a ground change, or a tint — never a shadow, never a glow, never an inset highlight.

## Shapes

Everything is a square rectangle. There are no rounded corners anywhere in the component layer — no `rounded-*` utility appears in the codebase, and no radius token above zero is applied to any surface. The sole curve in the system is the 2px radius on the global `:focus-visible` outline, which exists so the focus ring reads as a ring rather than a box corner.

Form is otherwise carried by line weight: 1px hairline for all borders and rules, 1.5px stroke for all icons (drawn on a single 16×16 grid, one weight, no fills, no emoji or glyph substitutes), 3px solid for the stamp's frame. The meter is an 8px unrounded bar. The dot ground is a 1px radial dot on a 4px grid.

### Named Rules

**The Square-Corner Rule.** Radius is 0. The pinned reference mixes 10–16px radii with hard 0; Leash does not inherit that — this system is uniformly square, and a rounded surface would read as imported from somewhere else.

**The One Tilt Rule.** Every element in the system is orthogonal except the refusal stamp, which is rotated −8°. That tilt is the only rotation permitted anywhere; it is what makes the stamp read as pressed onto the document rather than laid out within it.

## Components

### Buttons
- **Shape:** Hard square (`{rounded.none}`), no border on the primary, 1px hairline on the rest.
- **Primary:** Ultramarine fill with paper text at `{components.button-primary.padding}`, `0.875rem` medium weight, and an inline arrow icon where the action leads somewhere. Hover shifts the fill to ultramarine bright; active nudges down 1px.
- **Hover / Focus:** All state transitions are `150ms` on `cubic-bezier(0.22, 1, 0.36, 1)`, and only the properties that actually change are transitioned (`background-color, color, border-color, transform`). Focus is the global 2px ultramarine outline at 2px offset.
- **Ghost:** Hairline border, ink text, hairline-tint fill on hover. The secondary action in a pair.
- **Danger:** Hairline border and text in refusal red, filling with the refusal wash on hover. Used for revocation and for the wrong-network switch — the two destructive/corrective actions.
- **Disabled:** Deliberately *not* an opacity reduction. Disabled drops the fill entirely and becomes a strong-hairline outline with ink-tertiary text, because a 45%-opacity paper label on ultramarine is unreadable and the agent console's send control ships disabled by default.
- **Compact:** A 6px/12px mono-label-scale variant used for the agent console's injection presets and the connected-wallet chip. Hostile presets carry the refusal red border and text; the benign preset does not.
- **Link-as-button:** A separate `ButtonLink` primitive renders the primary treatment on an anchor. Never wrap a button in a link — it nests interactive content and produces two tab stops for one action.

### Cards / Containers
- **Corner Style:** Square (`{rounded.none}`).
- **Background:** `{colors.paper}` when the container sits on the dot ground; otherwise transparent — the border alone defines it.
- **Shadow Strategy:** None. See Elevation & Depth.
- **Border:** 1px hairline on all sides.
- **Internal Padding:** `{spacing.card}` rising to `{spacing.card-lg}` at `sm`.

### Inputs / Fields
- **Style:** 1px hairline box on a transparent ground, `{components.input-field.padding}`, mono text at `0.875rem`, square corners. Unit affixes ("Rp", "hours") sit inside the box in ink-tertiary mono, with the border moving to the wrapper so the affix and the field read as one control.
- **Focus:** The border shifts to ultramarine over 150ms. Note as built: inputs set `outline: none`, so this border shift is their *only* focus indicator and the global 2px focus ring does not apply to them; wrappers use `focus-within` to match. Keep the border shift on any new input, or restore the outline.
- **Error:** Never inline-red on the field itself. Validation problems render as a plain ink-tertiary list beneath the form; a rejected transaction renders as a refusal-red-bordered box containing the raw error name in mono over its `ERROR_COPY` explanation in ink-secondary.
- **Field row (read-only):** The dominant "input" in this product is not editable. `Field` is a hairline-ruled row — mono-label on the left, value right-aligned and truncating, mono by default and opt-out for prose values. Field lists are `<dl>` and the last row drops its rule.

### Navigation
- **Style:** Sticky, hairline-bottomed, backdrop-blurred, 64px tall from `sm` up. The wordmark is the display face at `1.25rem`; every nav item is a mono-label that transitions to full ink on hover. There is no active-state highlight.
- **Mobile:** Two rows below `sm` — wordmark and wallet control on the first, nav and deployment status on the second. Nav is never hidden behind a menu and the deployment status is never hidden at all.
- **Deployment status:** A permanent mono-label in the header showing the network and either the shortened contract address or the literal words `not deployed`. It is part of the navigation, not a banner.

### The Refusal Stamp (signature)
The authored moment of the entire system, and the only element permitted this much force. An inline-flex block with a 3px refusal-red border, rotated −8°, `mix-blend-mode: multiply` on light ground and `screen` on dark, carrying the word (`Refused`, `Revoked`, `Expired`) in the heavy squeezed display face with the contract's own error name in semibold mono beneath it.

Its entrance (`stampIn`, 0.42s on `cubic-bezier(0.22, 1, 0.36, 1)`) starts at 2.4× scale with a 6px blur, resolves to full opacity at 60%, undershoots to 0.94 at 75%, and settles at 1 — a press, not a fade. In a ledger, stamps stagger 140ms apart. A stamp for an event that just happened carries `role="status"` so it is announced; historical evidence on the landing page does not.

**The Evidence-Never-Animates-In Rule.** The stamp is split into two classes on purpose. `.stamp` is the rendered evidence and is always in the server-rendered document — verified in the served HTML, where all three refusals are present with no entrance class. `.stamp-in` is the entrance, added by an IntersectionObserver once the row is in view. With JavaScript disabled, a crawler reading the source, or `prefers-reduced-motion: reduce` set, every refusal is still fully visible and fully legible; only the press is lost. Never make refusal evidence conditional on script, viewport, or motion preference.

### The Meter
An 8px unrounded bar: hairline track, ultramarine fill, switching to refusal red only when the mandate is exhausted, revoked, or expired.

**The Remaining-Not-Spent Rule.** The bar reads *remaining*, never spent. It sits directly under the remaining figure, and a bar filled with the amount spent put a nearly-full bar beneath "Rp8.000 remaining" — the opposite of the truth. It animates from `scaleX(0)` to its ratio over 0.62s and exposes `role="meter"` with `aria-valuenow` set to the remaining amount and a label naming the mandate ceiling.

### The Affirmative Mark
The deliberate opposite of the stamp: a 16px 1.5px-stroke check icon in ultramarine beside a small uppercase mono word (`Authorized`, `Active`, `Settled once`), entering with a 6px `pressIn` and nothing else. It is allowed to be missed. Never grow it, never fill it, never give it a frame, and never make it green.

### The Undeployed State
A full section rendered wherever a surface needs a contract address and there is not one. It uses the world's own grammar at full strength — dot ground, display headline, hairline field list showing the network, chain ID, `not deployed`, and the recorded status `SKIPPED_CREDENTIALS` — plus a primary action back to the evidence that does exist. It is styled as a real state, not as an error or an empty placeholder.

## Do's and Don'ts

### Do:
- **Do** draw structure with 1px hairlines and hairline-ruled rows: label left in mono-label, value right in mono.
- **Do** keep body measure at 48ch or below and display measure at 16–24ch.
- **Do** reserve mono for on-chain values, contract identifiers, machine input/output, and the uppercase label voice.
- **Do** print the contract's own error name in mono next to any refusal, and pull its explanation from `ERROR_COPY`.
- **Do** render refusal evidence server-side and treat animation as enhancement only.
- **Do** make the meter read remaining, and label the ceiling next to it.
- **Do** show the deployment status at every viewport width, and render the undeployed state rather than a placeholder address.
- **Do** state what is mocked as plainly as what is real; the disclosure is part of the composition, not a disclaimer.
- **Do** keep state transitions at 150ms on `cubic-bezier(0.22, 1, 0.36, 1)` and transition only the properties that change.
- **Do** name what a control cannot do at the control, before the click.

### Don't:
- **Don't** introduce green, or any third hue. There are two.
- **Don't** use red for anything other than a refusal the chain actually issued.
- **Don't** substitute hues for dark mode; invert ground and ink and re-tint the same two.
- **Don't** add a shadow, glow, or radius. Zero and zero.
- **Don't** rotate anything except the stamp.
- **Don't** paraphrase, soften, or invent a rejection reason, and don't add a ninth error.
- **Don't** set body prose in mono to make it look technical.
- **Don't** make approval louder. It is quiet on purpose, and making it louder destroys the contrast the product is built on.
- **Don't** show a placeholder address, a fabricated transaction hash, or an explorer link that implies a public deployment.
- **Don't** wrap a button in a link, or hide navigation behind a menu on phones.
- **Don't** signal disabled with opacity; use the hairline-outline treatment.
