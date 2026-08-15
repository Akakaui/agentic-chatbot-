# Lattice design system

## Product position

Lattice is a conversation-first agent workspace. It helps people ask, research, plan, delegate, clarify, use explicitly connected remote tools, and produce durable artifacts without arbitrary machine-level code execution.

## Visual movement

Quiet Instrument: contemporary editorial software with a narrow reading column, warm content hierarchy, restrained orange execution signals, and progressive disclosure for complex agent state.

## Typography

Primary UI and body: `DM Sans`, with system sans fallback. Display and artifact titles: `Fraunces`, with Georgia fallback. Technical metadata: `ui-monospace`, SFMono-Regular, Menlo, monospace. Use sentence-case labels. Body text should remain between 13–16px. Conversation answers use a readable line-height of 1.65. Metadata is 11–12px and never carries essential meaning alone.

## Color tokens

| Token | Value | Use |
|---|---|---|
| `--lattice-ink` | `#10100F` | Page background |
| `--lattice-panel` | `#171716` | Raised surfaces and composer |
| `--lattice-panel-strong` | `#1E1D1B` | Selected/hover surfaces |
| `--lattice-line` | `rgba(255,255,255,.09)` | Dividers and quiet boundaries |
| `--lattice-copy` | `#F1EDE6` | Primary content |
| `--lattice-muted` | `#A39C92` | Supporting copy |
| `--lattice-faint` | `#6F6A63` | Metadata and placeholders |
| `--lattice-ember` | `#D97745` | User intent, active work, primary action |
| `--lattice-ember-soft` | `rgba(217,119,69,.14)` | Active backgrounds |
| `--lattice-success` | `#7BB493` | Healthy/complete state |
| `--lattice-danger` | `#D77A6A` | Error/destructive state |

## Spacing, radii, and surfaces

Use a 4px base spacing scale with 8, 12, 16, 24, 32, and 48px semantic steps. Conversation surfaces use 14–18px radii; controls use 8–12px. Avoid rounding every container equally. The composer is a distinct rounded surface; message text itself should not be boxed unless it is a user message, question, approval, error, or artifact reference.

Borders are one-pixel and low contrast. Shadows are soft and close to the surface. Do not use large glowing shadows or full-screen gradients.

## Icon rules

Use Lucide only for conventional controls, at 16–18px with a consistent 1.7–2px stroke. Use the custom Lattice mark for assistant identity. Never use emoji, Unicode pictograms, sparkles, or platform-dependent symbols as UI icons. Every icon requires a tooltip or accessible label when its meaning is not obvious from nearby text.

## Component rules

The navigation rail is quiet by default and highlights only the active destination. The top bar names scope, project, agent, and model in that order; it should not show more than four interactive controls on desktop. The composer is always available at the bottom of the reading column and supports multiline input, attachments, slash commands, model/agent selection, and cancel while running.

Messages use a narrow reading width. User messages are aligned to the right in a warm dark surface. Assistant responses are left-aligned and unboxed by default. Activity is a compact disclosure row. Questions, approvals, blocked states, and artifacts are structured inline modules with a clear next action.

## Artifact contract

Artifacts must expose Rendered, Source, History, and Fix/Revise affordances when the type supports them. The header must show title, type, version, status, and close control. Errors preserve the source and present “Fix with assistant.” Download and copy controls are always labeled.

## Interaction and motion

Hover is supplemental, not required. Controls have visible focus rings using the ember token. Pressed buttons scale to 0.98 for 120–160ms. Menus and disclosures use 160–220ms ease-out. Artifact panel entry uses 350–500ms. No essential information may depend on animation. `prefers-reduced-motion: reduce` disables transform-based entrance motion.

## Responsive behavior

At desktop widths, use the left rail, central conversation, and optional artifact canvas. At tablet widths, the rail becomes collapsible and the artifact canvas becomes a modal/sheet. At phone widths, show one surface at a time with a compact top bar and bottom composer; navigation and artifact views open as sheets. Touch targets should be at least 44px. Never squeeze the desktop rail beside the composer on a phone.

## Content voice

Use concise, calm, action-oriented copy. Say what the assistant is doing, what it needs, and how to recover. Avoid “magic,” “supercharge,” fake confidence, and technical jargon in primary user-facing text. Technical details may appear in a trace or inspector.

## Accessibility and safety

All controls need semantic labels and keyboard focus. Contrast must meet WCAG AA for normal text. Question cards must support keyboard selection and custom input. Connector approvals must state target, scope, and reversibility. Artifact previews must be sandboxed and must not imply host filesystem or shell access.

## Approved and rejected patterns

Approved: a narrow chat column with a large composer, a compact “Working” row that expands to a trace, a question card with 2–4 choices and custom answer, a right-side artifact canvas, and clear paused/error recovery.

Rejected: permanent plan card stacks above every response, dense all-caps telemetry, emoji assistant avatars, generic sparkle icons, purple/neon gradients, boxed assistant paragraphs, and a mobile layout that is a shrunk desktop dashboard.
