# Lattice — Agentic Workspace

Lattice is a responsive agent workspace for conversations, project context, artifacts, specialist progress, remote connectors, and provider-backed model discovery. The current prototype deliberately keeps arbitrary code execution disabled. It can create and render constrained artifacts such as Markdown, Mermaid, SVG, tables, and HTML previews without claiming to run user code.

## What changed

- Reworked the global visual system into a premium dark workspace with warm orange action color, calmer hierarchy, readable dense states, and reduced-motion support.
- Made chat the default surface; the artifact canvas opens only when requested or when an artifact is selected.
- Added provider-neutral model discovery for OpenAI-compatible APIs, Anthropic Messages, and Google Gemini.
- Added a provider settings surface with endpoint, protocol, API key, model discovery, and default model selection.
- Added Exa as a separate read-only web-search tool. Exa is not modeled as an MCP connector.
- Added selective delegation: simple requests can go directly to the configured provider; research, analysis, design, strategy, verification, and longer requests retain the visible multi-step run.
- Added responsive styles for desktop, tablet, and phone widths.

## Run locally

```bash
npm install
npm run dev
```

For a production build:

```bash
npm run build
npm run preview
```

## Configure a model provider

Open **Settings → AI provider**. Choose a protocol, enter the provider base URL and API key, save, and select **Discover models**. The application stores the prototype configuration in browser local storage. For production, move credentials to a server-side encrypted secret store and proxy requests through your own backend.

Supported protocols:

- `openai_compatible`: expects `GET /models` and `POST /chat/completions`.
- `anthropic`: expects `GET /models` and `POST /messages`.
- `gemini`: expects the Gemini `models` endpoint and `generateContent`.

A provider’s model catalog is not hardcoded. The discovered model IDs are used for the default model and subsequent chat calls.

## Configure Exa search

Open **Settings → AI provider**, enter an Exa API key in the separate **Exa Search API key** field, and save. Research-like prompts then call Exa directly as a read-only search tool. Search results are stored as citation records with title, URL, snippet/highlight, and relevance score.

For production, do not send an Exa key directly from the browser. Add a server-side `/api/tools/exa-search` proxy that reads the key from an encrypted environment secret, validates the request, applies quotas, and returns the normalized result shape used by `src/lib/exaTool.ts`.

## Important boundary

This prototype does not execute arbitrary shell, Python, Node, or user-generated code. It can render constrained artifacts and preview content. If remote code execution is added later, expose a narrow job API or isolated remote MCP server with approval, quotas, disposable workers, network restrictions, audit logs, and artifact scanning. Never give the browser raw SSH access.

## Visual QA

Validate the following before shipping:

- Desktop: navigation rail, chat, composer, header context, artifact toggle, and dense progress states.
- Tablet: collapsible navigation, readable chat width, and artifact panel as a sheet or secondary surface.
- Mobile: one primary surface at a time, safe-area composer, touch targets, scrollable progress cards, and no horizontal overflow.
- Reduced motion: no essential information depends on animation.
- Tool states: running, completed, blocked, approval-required, failed, retried, and partial completion are distinguishable without relying on color alone.
