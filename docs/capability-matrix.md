# Lattice capability matrix

| Capability | Native route | MCP or external alternative | Available | Required | Decision |
|---|---|---|---:|---:|---|
| Web browsing and research | Browser agent and Exa client | Remote MCP web search | Yes | Yes | Use Exa as a dedicated research tool; keep remote MCP for user-connected services. |
| Desktop and mobile screenshots | Browser-rendered preview | Playwright/Puppeteer/OpenCode browser integration | Yes | Yes | Capture desktop, tablet, and mobile states during QA. |
| Image search and visual references | Image search and source-page extraction | Image-search MCP | Yes | Low | Use references for composition and behavior only; do not copy brand assets. |
| Image generation | Built-in image generation | Image API/MCP | Available | Low | No decorative assets are necessary for the product shell; use the existing neutral wordmark/mark system. |
| Artifact rendering | HTML sandbox, Mermaid, Markdown renderer | Remote artifact or preview service | Yes | Yes | Keep rendering safe and separate from arbitrary machine-level execution. |
| Dynamic model discovery | Provider-neutral client | Provider APIs | Yes | Yes | Fetch available models from configured OpenAI-compatible, Anthropic, and Gemini providers. |
| Remote MCP connectors | Streamable HTTP/OAuth 2.1 model | User-provided remote MCP servers | Architecture present | Yes | No local MCP command execution; connector permissions and approvals remain explicit. |
| User clarification | OpenCode-style question event | Provider tool-call adapter | Partial | Yes | Replace the deterministic demo trigger with a resumable question tool contract. |
| Persistent data | Local-storage store | Backend/database upgrade | Available locally | Yes | Preserve local-first readiness while keeping the store interface replaceable. |
| Machine-level code execution | None | Claude Code/OpenCode shell | Intentionally unavailable | No | Do not add shell, filesystem, or arbitrary code execution to the app. |

## Safety boundary

Lattice may research through Exa, call explicitly configured remote tools, create durable artifacts, and render safe HTML/Markdown/Mermaid previews. It must not run arbitrary commands on the host machine, inspect unrelated local files, or silently grant connector permissions.

## Research references used

The interaction direction is informed by Claude Artifacts and Projects documentation, OpenAI Canvas documentation, and OpenCode Tools documentation. These references establish useful patterns for dedicated artifact surfaces, project-scoped knowledge, targeted revision, version history, and structured user questions.
