# Design Process Rebuild: Layout, Page Structure, and Features

## Purpose

This file is a handoff brief for a ground-up redesign of the Design Process page. It should preserve the emotional idea of the current route while giving the next builder permission to redesign the visual system, section composition, and interaction model.

The current page already communicates a strong process narrative:

- Clarity before interface work.
- Visual direction before execution.
- Research-led wireframing.
- AI as critique and acceleration, not a replacement for judgment.
- Agent orchestration and branch safety as part of the process.
- Typography, refinement, and final decision-making as emotional craft.

The rebuild should keep that story, but it does not need to keep the current card-heavy layout, exact typography, exact colors, or current section treatments.

## Current Page Review

The live `/design-process` page is strongest when it feels editorial and personal:

- The hero has a memorable mural-like image reveal and handwritten energy.
- The process copy has conviction and a clear voice.
- The AI and branch-gate sections make the process feel unusually practical.
- The bottom mobile nav gives the route a product-like shell.

The page feels weaker where the visual language becomes too repetitive:

- Many sections resolve into similar stacked cards.
- The Screenshot Frenzy section is currently a static bento gallery, but the concept wants motion and transformation.
- Some later sections feel like content blocks rather than a continuous story.
- The design system uses several expressive ideas, but they are not yet one unified, upscale visual language.

## Rebuild Direction

Design the page as a scroll-led narrative about turning ambiguity into a resolved product direction.

The core metaphor:

> Scattered inputs become a clear system.

Every section should make that metaphor visible. The page can start with expressive disorder, then become progressively more structured as the reader moves through research, critique, orchestration, typography, and refinement.

## Recommended Route Shape

Keep this as a single route: `/design-process`.

The page can be structured as one long, immersive process story with 8 to 10 major sections. The next builder may merge, rename, or reorder sections if the emotional flow improves.

## Section Blueprint

### 1. Opening: Process Manifesto

Goal: Establish the emotional thesis immediately.

Content role:

- Page title: `My Design Process` or a stronger variant such as `How I Turn Mess Into Direction`.
- Supporting line: keep the current sentiment: adaptive, emotional, research-driven, never rigid.
- Avoid making this a normal hero card.

Design idea:

- Full-bleed editorial surface.
- Large expressive type.
- Subtle grid, paper, canvas, or image-crop texture.
- A visual that hints at fragments becoming structure.

Expected features:

- Page-load reveal.
- Route-specific header/logo treatment.
- Responsive hero that works on mobile without hiding the main message behind the bottom nav.

### 2. Philosophy: The Process Lens

Goal: Explain the page in one strong thesis.

Content role:

- Use the current message: clarity, visual direction, concrete architecture, fast AI iteration, human judgment.
- This section should feel like the page's thesis statement.

Design idea:

- Could be a large typographic manifesto.
- Could include three small anchors: Clarity, Emotion, Function.
- Avoid over-explaining the process too early.

Expected features:

- Small anchor chips or marks.
- Optional scroll progress indicator for the process stages.

### 3. Client Clarity: Decision Archetypes

Goal: Show that design begins by understanding how the client makes decisions.

Content role:

- Clear-direction clients.
- Visual-reaction clients.
- In-between clients.
- Keep the rule: "no" is data.

Design idea:

- Instead of simple cards, this could become a decision map, matrix, or diagnostic layer.
- Each client type can have a different rhythm, symbol, or visual treatment.

Expected features:

- Interactive archetype panels.
- Hover or tap states revealing how the process adapts.
- Optional visual scale from "firm direction" to "open discovery".

### 4. Visual Direction: Screenshot Frenzy and Collage Assembly

Goal: Make the strongest new centerpiece of the rebuild.

Content role:

- This section should explain and demonstrate how references become a direction.
- It should not stay as a static bento gallery.
- The reader should feel the transition from many raw inputs to one resolved visual language.

Design idea:

- Use the provided reference images as inspiration for a scroll-driven image assembly.
- Start with a mass of images, fragments, crops, tabs, notes, and reference boards.
- As the user scrolls, irrelevant pieces disappear.
- True fragments from one larger image enter from different angles, depths, rotations, or off-screen directions.
- Each true fragment corrects itself into a clean angle.
- The final state forms one complete editorial image or composition.

Expected features:

- Pinned scroll section.
- Masked rectangular crops.
- Rotated and translated pieces that snap into alignment.
- Thin white gutters or outline strokes between pieces.
- Optional labels, date stamps, color swatches, and tiny metadata.
- Reduced-motion fallback that shows the final composition plus a short step list.

See `rebuild-emotion-fx-style.md` for the detailed motion concept.

### 5. Foundation: Research-Led Wireframing

Goal: Show the shift from visual research to structural design.

Content role:

- Keep the idea that research becomes architecture before wireframes.
- The section should feel more precise than the Screenshot Frenzy section.

Design idea:

- Move from collage to blueprint.
- Use grid overlays, low-fidelity wireframe marks, annotated blocks, and decision notes.

Expected features:

- Scroll reveal from image fragments to wireframe blocks.
- Optional timeline, but avoid making it a generic vertical timeline unless it is visually upgraded.

### 6. AI Exploration: Model Critique Loop

Goal: Show AI as a serious critique system.

Content role:

- First pass with one model.
- Other models challenge, expose weak logic, and sharpen the direction.
- Human judgment decides what survives.

Design idea:

- Treat AI tools as voices in a review table, not just logo pills.
- Show inputs, critique signals, merge decisions, and rejected ideas.

Expected features:

- Animated critique loop.
- Model chips with distinct behavior.
- "Risk found", "direction sharpened", "merged", or "discarded" states.

### 7. Execution Architecture: Agent Orchestration

Goal: Explain how complex briefs become scoped execution.

Content role:

- Split a complex brief into chunks.
- Define contracts.
- Route chunks to specialists.
- Verify against the original brief.

Design idea:

- Use dependency graph, command board, or pipeline map.
- This should feel operational, but still beautifully designed.

Expected features:

- Nodes and dependency lines.
- Active route states.
- Input and output contract snippets.

### 8. Release Safety: Branch Gates

Goal: Show that the workflow protects quality and history.

Content role:

- Entry gate before code.
- Exit gate before promotion.
- Explicit approval before push or merge.

Design idea:

- Could become a two-gate system, airlock, checklist machine, or release console.
- The section should read as calm control, not bureaucracy.

Expected features:

- Gate state animation.
- Command surface.
- Before and after state.

### 9. Typography and Hero-First Build

Goal: Preserve the idea that typography shapes the emotional direction.

Content role:

- Start with real words.
- Test multiple fonts.
- Implement options, compare inside the design, step back, decide.

Design idea:

- Make this more elegant than the current comic-heading treatment unless the next builder chooses a deliberately editorial comic direction.
- The section could show type specimens moving into the final hero.

Expected features:

- Typeface comparison wall.
- Real-copy previews.
- Highlight marks for words that carry tone.

### 10. Integration, Refinement, and Finish Criteria

Goal: Close the process with judgment.

Content role:

- Small details matter.
- Motion supports meaning.
- Copy becomes sharper.
- The infinite loop ends after distance and fresh eyes.

Design idea:

- This section should feel quieter and more resolved.
- It can return to the assembled image metaphor: the system is now stable.

Expected features:

- Refinement checklist.
- Subtle before and after details.
- Final CTA: strategic, creative, measurable.

## Navigation and Shell

Keep the route integrated into the React app shell:

- Header/logo behavior should remain route-aware.
- Mobile bottom nav should stay reachable and should not cover essential content.
- Theme handling should be deliberate. A rebuild may keep light/dark support, but the design should not feel like two unrelated pages.

## Responsive Expectations

Desktop:

- Can use wider pinned scenes, multi-column process panels, and large image assembly.
- Avoid overly narrow text tracks for sections that want an editorial feel.

Tablet:

- Preserve the scroll-collage assembly, but reduce the number of simultaneous fragments.

Mobile:

- The page should still feel special, not like a compressed desktop.
- The collage assembly may use fewer pieces and a taller vertical composition.
- Keep touch targets clear and account for the bottom nav.

## Accessibility Expectations

- Every visual-heavy section needs a textual equivalent.
- The scroll assembly should not trap the user.
- Reduced motion should produce a complete, readable version.
- Decorative image fragments should be `aria-hidden`.
- Final assembled image should have meaningful alt text if it communicates content.

## Open Builder Freedom

The next AI builder may choose:

- Exact visual style and type system.
- Whether to use GSAP ScrollTrigger, CSS scroll timelines, Framer Motion, or another animation approach already compatible with the app.
- Whether the final assembled image is a project screenshot, process artifact, moodboard, or generated editorial image.
- How many sections remain separate versus merged into a tighter story.

The builder should not:

- Reduce the page to generic portfolio cards.
- Remove the research-to-direction narrative.
- Treat AI as a gimmick rather than a critique and execution system.
- Hide the scroll-collage section behind a static gallery.
