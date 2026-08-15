# Lattice visual direction

## Three directions considered

### 1. Quiet Instrument
A dark, editorial workspace with warm paper-white type, restrained orange signals, and a calm reading column. The interface feels like a premium research instrument rather than an admin console.

**Probability:** 0.07

### 2. Signal Garden
A lighter, tactile workspace using mineral neutrals, soft green system states, and layered notebook surfaces. It makes agent work feel approachable and grounded in human craft.

**Probability:** 0.03

### 3. Terminal Ember
A high-contrast, technical interface with near-black surfaces, orange execution signals, dense activity traces, and precise monospaced metadata.

**Probability:** 0.09

## Chosen direction: Quiet Instrument

### Design movement
Contemporary editorial software: a synthesis of digital reading rooms, instrument panels, and calm productivity tools. It borrows the generous reading rhythm of an editorial document while preserving the status visibility required by an agent system.

### Core principles
1. **Conversation before control plane.** The user should see the answer and the next action before seeing implementation detail.
2. **Evidence, not telemetry.** Plans and tool activity should explain what happened without turning the chat into a monitoring dashboard.
3. **Soft material hierarchy.** Use charcoal surfaces, warm white text, quiet borders, and one orange signal color instead of loud gradients or decorative effects.
4. **Progressive disclosure.** Context, artifacts, projects, connectors, and detailed runs open when needed and close without losing the user’s place.

### Color philosophy
The base is a nearly-black charcoal that reduces glare and makes long-form reading comfortable. Warm white carries primary content, while muted stone distinguishes supporting copy. Orange is reserved for user intent, active execution, and irreversible attention states; it is not a general decoration. Green is used only for healthy memory/connector state and should never compete with the assistant’s primary action.

### Layout paradigm
A narrow reading column sits inside a spacious central field. The left navigation rail is a quiet context shelf, not a full dashboard. The top bar names the current scope and agent without stacking controls. The composer anchors the bottom of the reading column and grows vertically with content. The artifact canvas appears as a reversible right-side workbench when needed. Mobile collapses into one surface at a time.

### Signature elements
- A small orange Lattice mark used as a precise assistant identity, never a decorative sparkle.
- Inline activity rows with a thin orange progress rail and plain-language status.
- Artifact tabs that feel like a workbench strip: Rendered, Source, History, and Fix.

### Interaction philosophy
Every interaction should preserve context. Opening an artifact should not erase the chat. A question should pause the run at the point of uncertainty. A denied tool should explain what was blocked and keep the plan. Destructive actions should be confirmable or undoable. Keyboard actions are immediate; visual transitions are short and purposeful.

### Animation
Use 160–220ms ease-out transitions for menus, composer state, and disclosure. Use 350–500ms for artifact canvas entry and mobile sheets. Streaming activity reveals one row at a time with a 40ms stagger, but never animates private chain-of-thought. Avoid infinite ambient motion. Respect reduced motion by removing scale/slide effects while preserving state changes.

### Typography system
Use `Fraunces` or another restrained editorial serif only for large empty-state headings and artifact titles; use `DM Sans` or system sans for UI, controls, and body copy; use `ui-monospace` only for tool names, IDs, and source snippets. Headings are sentence case, compact, and not all caps. Metadata may use small caps sparingly for state labels.

### Brand essence
Lattice is a calm command surface for people who want an assistant to think in steps, use tools responsibly, and leave behind reusable work. It is **clear, capable, considered**.

### Brand voice
Headlines are direct and human. CTAs describe the result rather than the mechanism. Microcopy explains state and recovery without blaming the user.

Example lines: “Bring me the problem.” and “I’m waiting on one decision.”

### Wordmark and logo
Use a compact custom L mark made from two offset vertical strokes joined by a subtle diagonal bridge, suggesting a lattice without looking like a generic sparkle. Keep the mark legible at 16–24px and pair it with a text wordmark in a high-contrast serif/sans combination, never a default logo font.

### Signature brand color
**Ember Orange:** `#D97745`. It is warm enough to feel human and distinct enough to mark intent, waiting, and active work against charcoal surfaces.

### Do not dilute the direction
Do not add neon gradients, emoji, sparkles, decorative glassmorphism, dense role badges, generic analytics cards, or permanent execution plans that visually overpower the answer.
