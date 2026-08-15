# Lattice user flows

## Conversation-first flow

The user enters a quiet conversation surface with one clear action: write a message. The composer accepts plain text, files, slash commands, and an optional model/agent context. Simple prompts should produce a direct answer without forcing a visible plan. More complex prompts may reveal a compact “Working” row and a detailed trace behind disclosure.

## Agentic execution flow

When the prompt benefits from research, delegation, artifact creation, or remote tools, the orchestrator creates a run record. The user sees a sentence-level status such as “Searching Exa for current MCP transport guidance” or “Drafting the artifact,” not private chain-of-thought. Each activity row may expose tool, role, duration, and result metadata. The final answer remains the primary content, with citations and artifact links below it.

## OpenCode-style question flow

A question event contains a run ID, a header, a prompt, one or more questions, option definitions, and a custom-answer policy. The UI marks the run as `waiting_for_user`, renders the card inline at the exact point where execution paused, and keeps the composer available for unrelated work only if the product policy allows it. Selecting an option updates local draft state; submitting answers emits a structured response keyed by question ID. The engine then resumes from the paused checkpoint with the answers added to run context. A user may revise an answer before submission, provide a custom answer, cancel the run, or ask the assistant to make a reasonable assumption instead.

## Artifact flow

An artifact is significant, self-contained content that can be edited, reused, rendered, or downloaded outside the immediate answer. It has a title, type, version list, source, render status, conversation/project ownership, and a safe preview mode. The assistant can create Markdown, diagrams, and HTML previews. Users can switch between Rendered, Source, and History views, request a targeted edit, restore a previous version, download the artifact, or press “Fix with assistant” when rendering fails.

## Connector flow

Remote MCP connectors are registered with endpoint, transport, OAuth state, available tools, scopes, health, and approval policy. The assistant can discover and propose a connector tool, but it cannot silently execute consequential writes. Read-only tools may run when allowed; external writes require an approval card with target, data, scope, and reversibility. Every connector action emits an audit event.

## Recovery flow

Every paused or failed state should answer three questions: what happened, what can the user do next, and what will be preserved. A provider error keeps the user’s prompt. A question card preserves the plan. A connector denial keeps the run inspectable. An artifact rendering error preserves the source and offers a fix request. Delete actions use undo where possible and confirmation for irreversible project or connector removal.
