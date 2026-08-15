
## Inline artifact revision QA

The persistent sidebar Task progress shelf has been removed. The Header no longer exposes an artifact-canvas toggle, and the right-side canvas is no longer mounted in App. Generated artifacts now appear as inline assistant-turn work products with a dark header, type label, Rendered/Source/History controls, copy/download/save actions, and a revision composer.

The current browser preview shows the existing generated Markdown artifact inline in the transcript. The browser-side sanity check reported `overflow: false`, `canvasToggle: false`, `taskProgress: false`, and `inlineArtifact: true` at a 1280px viewport. The inline card is present without a persistent side panel. The production build passes; the only remaining warning is the known large Mermaid bundle chunk.

## Minimal rail QA

The browser preview now shows only New chat, Projects, and Recent Chats in the primary rail. Sources, Agents, Schedules, Connections, Memory, and Artifacts are absent from the primary navigation. The profile footer opens a contextual menu through the identity row; the menu is intended to expose Settings, Language, capability controls, and Help without adding those destinations back to the rail.

## Minimal rail and Plan/Act QA

The live preview shows only New chat, Projects, and Recent Chats in the rail. The composer exposes a Plan/Act selector. In Plan mode, the prompt `Plan a safe research brief about OpenCode agents` produced a three-step plan, marked activity complete, and explicitly reported that no external writes or durable artifacts were created. The plan was rendered inline in the conversation and the recent chat title updated correctly.
