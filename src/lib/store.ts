import {
  UserProfile,
  Project,
  Conversation,
  Message,
  Artifact,
  ProjectSource,
  AgentDefinition,
  SkillDefinition,
  RemoteMcpConnector,
  ScheduledTask,
  MemoryItem,
  AuditEvent,
  MemoryMode
} from '../types';

const STORAGE_KEYS = {
  USER: 'lattice_user_profile',
  PROJECTS: 'lattice_projects',
  CONVERSATIONS: 'lattice_conversations',
  MESSAGES: 'lattice_messages',
  ARTIFACTS: 'lattice_artifacts',
  SOURCES: 'lattice_sources',
  AGENTS: 'lattice_agents',
  SKILLS: 'lattice_skills',
  CONNECTORS: 'lattice_connectors',
  SCHEDULES: 'lattice_schedules',
  MEMORIES: 'lattice_memories',
  AUDIT: 'lattice_audit',
  ACTIVE_NAV: 'lattice_active_nav'
};

const INITIAL_USER: UserProfile = {
  id: 'usr_001',
  displayName: 'Frank Chibuike',
  email: 'fchibuike122@gmail.com',
  avatarUrl: '',
  locale: 'en-US',
  timezone: 'America/Los_Angeles',
  theme: 'light',
  reducedMotion: false,
  globalMemoryEnabled: true,
  defaultModel: 'gemini-2.5-flash'
};

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_agentic_tools_03',
    name: 'Agentic Tools & Autonomous Systems',
    description: 'Comprehensive research on modern AI tool use, Model Context Protocol (MCP), sandboxing security, multi-agent delegation DAGs, and evaluation benchmarks.',
    status: 'active',
    instructions: 'Provide rigorous architectural analysis on tool invocation paradigms, JSON-RPC 2.0 schemas, token economics, safe sandboxed execution environments, and tool retrieval-augmented generation (Tool-RAG).',
    memoryMode: 'project_only',
    createdAt: '2026-08-14T08:00:00Z',
    updatedAt: '2026-08-15T05:30:00Z',
    allowedToolIds: ['tool_exa_search', 'tool_render_mermaid', 'mcp_e2b_sandbox', 'mcp_github_ops'],
    members: [
      { id: 'usr_001', displayName: 'Frank Chibuike', role: 'owner' }
    ]
  },
  {
    id: 'proj_nordic_01',
    name: 'Aura Nordic Living',
    description: 'Brand positioning, competitor intelligence, and design strategy for sustainable Scandinavian furniture.',
    status: 'active',
    instructions: 'Always emphasize circular materials, minimalist typography, and warm tactile neutral palettes. Never suggest high-gloss synthetics.',
    memoryMode: 'project_only',
    createdAt: '2026-08-10T09:00:00Z',
    updatedAt: '2026-08-15T04:30:00Z',
    allowedToolIds: ['tool_exa_search', 'tool_render_mermaid', 'tool_image_gen'],
    members: [
      { id: 'usr_001', displayName: 'Frank Chibuike', role: 'owner' }
    ]
  },
  {
    id: 'proj_fintech_02',
    name: 'Nexus Pay Gateway',
    description: 'Multi-rail cross-border payment routing architecture, latency optimization, and compliance verification.',
    status: 'active',
    instructions: 'Strict security-first tone. Require citation of ISO-20022 schemas and explicit rollback procedures on database writes.',
    memoryMode: 'project_only',
    createdAt: '2026-08-12T14:15:00Z',
    updatedAt: '2026-08-14T18:20:00Z',
    allowedToolIds: ['tool_exa_search', 'tool_render_mermaid', 'mcp_github_ops'],
    members: [
      { id: 'usr_001', displayName: 'Frank Chibuike', role: 'owner' }
    ]
  }
];

const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_001',
    statement: 'User prefers concise executive summaries with bold key takeaways over verbose paragraphs.',
    category: 'communication_preference',
    scope: 'global',
    sourceConversationId: 'conv_seed_01',
    confidence: 0.96,
    createdAt: '2026-08-11T10:00:00Z',
    reasonSaved: 'User explicitly stated summary format preference in onboarding.'
  },
  {
    id: 'mem_002',
    statement: 'Agentic tools require strict human-in-the-loop approval gates for consequential external writes and financial APIs.',
    category: 'technical_constraint',
    scope: 'global',
    sourceConversationId: 'conv_agentic_01',
    confidence: 0.99,
    createdAt: '2026-08-14T09:15:00Z',
    reasonSaved: 'Core security governance policy for autonomous tool calling.'
  },
  {
    id: 'mem_003',
    statement: 'Aura Nordic Living target demographic is high-disposable-income urban renovators seeking FSC-certified wood.',
    category: 'project_fact',
    scope: 'project_only',
    projectId: 'proj_nordic_01',
    sourceConversationId: 'conv_seed_02',
    confidence: 0.98,
    createdAt: '2026-08-12T11:20:00Z',
    reasonSaved: 'Extracted from uploaded Brand Strategy Q3 source document.'
  }
];

const INITIAL_SOURCES: ProjectSource[] = [
  {
    id: 'src_agentic_tools_report',
    name: 'Agentic_Tools_Architecture_Report_2026.md',
    projectId: 'proj_agentic_tools_03',
    type: 'markdown',
    sizeBytes: 86400,
    checksum: 'sha256:3c88a149e917d23a1059f1a0e9b940989f6d728bc21034f8a8461719b22e1189',
    extractionQuality: 'high',
    extractedText: `# State of Agentic Tools: Architecture, Protocols & Ecosystem Compendium

## 1. Defining Agentic Tools vs. Classical API Integrations
Classical API integrations are deterministic and hardcoded. By contrast, **Agentic Tools** are dynamic interfaces exposed to autonomous LLM orchestrators that feature:
1. **Machine-Readable Schemas:** Declared via JSON-Schema or protobuf with semantic parameter descriptions that guide reasoning models.
2. **Dynamic Selection & Retrieval (Tool-RAG):** When toolsets exceed 50+ definitions, models use semantic vector retrieval over tool docstrings to inject only the relevant tools into prompt context.
3. **Execution Sandboxing:** Safe isolated environments (e.g. Firecracker microVMs, E2B, WebAssembly) that execute arbitrary generated code without compromising host infrastructures.
4. **Human-in-the-Loop (HITL) Governance:** Consequential write actions (file modification, payments, email dispatch) generate an approval token before final dispatch.

## 2. The Model Context Protocol (MCP) Revolution
Initiated by Anthropic, **MCP (Model Context Protocol)** provides an open, standardized JSON-RPC 2.0 protocol connecting AI applications to data repositories, developer tools, and enterprise servers.
- **Key Transports:** stdio (local processes) and Streamable HTTP with Server-Sent Events (SSE) for remote enterprise gateways.
- **Primitive Types:** Resources (read-only file/data feeds), Tools (callable functions with side effects), and Prompts (reusable parameterized prompt templates).
- **Security Triad:** Capability negotiation, explicit scope granting, and schema version pinning to eliminate prompt injection attack vectors.

## 3. Leading Tool Frameworks & Orchestrators
- **LangGraph:** Cyclic graph orchestrator with state persistence, time-travel debugging, and multi-agent branching.
- **CrewAI & AutoGen 0.4:** Role-playing hierarchical and conversational agent swarms with asynchronous messaging channels.
- **OpenAI Swarm & Tools API:** Lightweight ergonomic function calling with parallel tool execution and structured outputs.
- **Google Vertex AI Agent Builder:** Enterprise grounding with Google Search, Workspace data connectors, and VPC service controls.

## 4. Industry Standard Evaluation Benchmarks
- **SWE-bench (Software Engineering):** Tests multi-step code generation, tool usage, and git patch application on real GitHub issues.
- **BFCL (Berkeley Function Calling Leaderboard):** Evaluates multi-turn tool calling, AST accuracy, and handling of hallucinated tool inputs.
- **GAIA (General AI Assistants):** Assesses complex multi-modal tool use across web browsing, spreadsheet analysis, and multi-file reasoning.`,
    tokenCount: 4250,
    uploadedAt: '2026-08-14T08:30:00Z',
    visibility: 'project_members'
  },
  {
    id: 'src_nordic_pdf',
    name: 'Aura_Market_Research_Q3.pdf',
    projectId: 'proj_nordic_01',
    type: 'pdf',
    sizeBytes: 1420000,
    checksum: 'sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    extractionQuality: 'high',
    extractedText: 'Aura Nordic Living Market Overview: Key competitor benchmark against Muuto, HAY, and Carl Hansen & Søn. Identified a 34% surge in demand for modular oiled oak dining systems. Consumer retention hinges on transparent repair warranties and flat-pack carbon offsets.',
    tokenCount: 2840,
    uploadedAt: '2026-08-13T08:15:00Z',
    visibility: 'project_members'
  },
  {
    id: 'src_fintech_arch',
    name: 'Nexus_Routing_Architecture_v2.md',
    projectId: 'proj_fintech_02',
    type: 'markdown',
    sizeBytes: 48000,
    checksum: 'sha256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    extractionQuality: 'high',
    extractedText: 'Nexus Multi-Rail Settlement Engine: Routes GBP, EUR, and USD through local SEPA Instant, FedNow, and Faster Payments Rails. P99 latency SLA capped at 180ms. Fallback cascade uses Tier-1 correspondent banking.',
    tokenCount: 1120,
    uploadedAt: '2026-08-14T16:00:00Z',
    visibility: 'project_members'
  }
];

const INITIAL_ARTIFACTS: Artifact[] = [
  {
    id: 'art_agentic_tools_compendium',
    title: 'Agentic Tools Landscape, MCP & Architecture Compendium',
    description: 'Comprehensive research document covering modern AI tool calling, Model Context Protocol (MCP), sandboxing, security, and multi-agent coordination.',
    type: 'markdown',
    currentVersion: 1,
    projectId: 'proj_agentic_tools_03',
    conversationId: 'conv_agentic_01',
    status: 'rendered',
    createdAt: '2026-08-15T04:00:00Z',
    updatedAt: '2026-08-15T05:30:00Z',
    tags: ['Research', 'Agentic Tools', 'MCP', 'Architecture', 'Evaluation'],
    versions: [
      {
        version: 1,
        content: `# State of Agentic Tools: Comprehensive Research & Architectural Compendium

**Author:** Lattice Autonomous Systems Research Group  
**Scope:** Modern AI Tool Calling, Model Context Protocol (MCP), Sandboxed Execution, Multi-Agent Delegation & Governance  
**Status:** Peer-Reviewed Architectural Reference (2026)

---

## 1. Executive Summary & The Paradigm Shift
The transition from passive prompt-response language models to **Agentic Systems** is defined by **autonomous tool invocation**. While early models relied on prompt engineering to simulate knowledge, agentic models actively interact with the physical and digital world through standardized, typed interfaces.

Key breakthroughs enabling reliable agentic tool use include:
- **Model Context Protocol (MCP):** Universal standard eliminating bespoke API wrappers in favor of JSON-RPC 2.0 client-server contracts.
- **Constrained JSON-Schema Function Calling:** Strict grammar decoding and AST-level validation eliminating syntax parsing failures.
- **Isolated Ephemeral MicroVMs:** Sub-second container spin-up (Wasm, Firecracker, E2B) allowing unconstrained code generation without host exposure.
- **Tool-RAG (Retrieval-Augmented Tool Selection):** Dynamic filtering of thousands of tools down to the exact 5–10 required for a specific reasoning sub-task.

---

## 2. Taxonomy of Modern Agentic Tools

| Tool Category | Core Mechanism | Prime Examples | Security & Boundary Risk |
|---|---|---|---|
| **Neural Web & Domain Search** | Semantic vector extraction with highlighted citations | Exa AI, Tavily, Perplexity Sonar, Google Search Grounding | **Low** (Read-Only egress) |
| **Sandboxed Code Interpreters** | MicroVM Python/Node.js dynamic runtime execution | E2B Sandbox, Pyodide Wasm, Modal, Docker Containers | **Medium** (Compute/timeout bounded) |
| **Browser & Computer Use** | Accessibility tree grounding, visual coordinate clicks | Playwright, Browser-Use, Stagehand, Anthropic Computer Use | **High** (External session risk) |
| **Model Context Protocol (MCP)** | JSON-RPC 2.0 streaming tools, resources, and prompts | GitHub MCP, Postgres MCP, Slack MCP, Filesystem MCP | **Configurable** (Role-based scopes) |
| **Enterprise Transaction Gateways** | Two-phase commit transactional writes with rollback | Stripe, Salesforce, Google Workspace, AWS Lambda | **Critical** (Requires Human-in-the-Loop) |

---

## 3. Model Context Protocol (MCP) Deep Dive
Anthropic's open-source **Model Context Protocol (MCP)** standardizes how AI hosts communicate with tools and context sources:
1. **Client (AI Application / Host):** Manages LLM connections, user approvals, and UI presentation (e.g. Lattice).
2. **Server (Tool/Data Provider):** Exposes typed functions via JSON-RPC 2.0 over \`stdio\` or \`streamable_http\` (SSE).
3. **Capabilities Handshake:** Dynamic capability negotiation during connection initialization.
4. **Three Core Primitives:**
   - **Resources:** Passive read-only data (e.g. SQL schemas, log streams).
   - **Tools:** Executable actions with strict JSON Schema input validation.
   - **Prompts:** Templated interactive workflows exposed by servers.

---

## 4. Multi-Agent Delegation & Parent-Worker Orchestration
Modern architectures avoid giving 50+ tools to a single model prompt (which degrades attention and increases token cost). Instead, they employ **Hierarchical Multi-Agent DAGs**:
1. **Parent Orchestrator:** Analyzes user goal, decomposes into sequential and parallel tasks, assigns role-specialized subagents.
2. **Specialist Subagents:** Small, focused agents equipped with only 1–3 relevant tools (e.g. \`Researcher\` has Exa search; \`Coder\` has E2B Sandbox).
3. **Synthesis & QA Reviewer:** Validates outputs against citation provenance and safety criteria before presenting durable artifacts to the user.

---

## 5. Best Practices for Safe Autonomous Tool Deployment
- **Principle of Least Privilege:** Scope tool API keys to read-only whenever possible.
- **Human-in-the-Loop for Consequential Actions:** Never execute irreversible deletes, payment transfers, or public repository writes without explicit user confirmation in the UI.
- **Idempotency & Rollback Tokens:** Ensure all mutation tools accept idempotency keys and return undo receipts.
- **Context Pruning & Output Summarization:** Large tool responses (e.g., 200KB JSON payloads) must be summarized or stored in artifact stores, injecting only pertinent snippets into the LLM conversation stream.`,
        changeSummary: 'Initial comprehensive research compendium on Agentic Tools and MCP.',
        createdAt: '2026-08-15T04:00:00Z'
      }
    ]
  },
  {
    id: 'art_mcp_sequence_diagram',
    title: 'MCP Client-Host-Server Protocol Handshake & Tool Invocation Sequence',
    description: 'Mermaid sequence diagram illustrating JSON-RPC 2.0 capability discovery, schema validation, and sandboxed execution flow.',
    type: 'diagram',
    currentVersion: 1,
    projectId: 'proj_agentic_tools_03',
    conversationId: 'conv_agentic_01',
    status: 'rendered',
    createdAt: '2026-08-15T04:30:00Z',
    updatedAt: '2026-08-15T04:30:00Z',
    tags: ['Mermaid', 'MCP', 'Protocol Flow', 'Architecture'],
    versions: [
      {
        version: 1,
        content: `sequenceDiagram
    autonumber
    actor User as User / Operator
    participant Client as Lattice Host Client
    participant LLM as Frontier Reasoning Model
    participant MCP as Remote MCP Gateway (JSON-RPC 2.0)
    participant Sandbox as E2B MicroVM Sandbox

    User->>Client: "Analyze dataset and run Python regression"
    Client->>MCP: initialize { clientInfo, capabilities }
    MCP-->>Client: initializeResult { serverInfo, tools: [e2b_exec, exa_search] }
    Client->>LLM: Formulate Plan (prompt + active tool schemas)
    LLM-->>Client: tool_call: e2b_exec { code: "import pandas as pd; df.describe()" }
    
    alt Read-Only / Low Risk
        Client->>Sandbox: Execute code in isolated microVM
        Sandbox-->>Client: { stdout: "mean: 42.1, std: 3.2", executionTime: "120ms" }
    else Consequential Write / High Risk
        Client->>User: Request Human-in-the-Loop Confirmation
        User-->>Client: Approve Tool Action
        Client->>MCP: Call mutation endpoint
    end

    Client->>LLM: Return tool output observation
    LLM-->>Client: Synthesized final answer with citations
    Client-->>User: Render durable artifact in canvas`,
        changeSummary: 'MCP sequence and tool invocation flowchart',
        createdAt: '2026-08-15T04:30:00Z'
      }
    ]
  },
  {
    id: 'art_agentic_tool_simulator',
    title: 'Interactive Agentic Tool Workbench & Sandbox Simulator',
    description: 'Live interactive sandbox component demonstrating real-time tool calls, token budgets, latency metrics, and JSON-RPC payloads.',
    type: 'html_preview',
    currentVersion: 1,
    projectId: 'proj_agentic_tools_03',
    conversationId: 'conv_agentic_01',
    status: 'rendered',
    createdAt: '2026-08-15T05:00:00Z',
    updatedAt: '2026-08-15T05:00:00Z',
    tags: ['Interactive', 'Simulator', 'MCP Sandbox'],
    versions: [
      {
        version: 1,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Agentic Tool Simulator</title>
  <style>
    :root {
      --bg: #FAFAF8;
      --card-bg: #FFFFFF;
      --text: #1C1917;
      --subtext: #78716C;
      --border: #E7E5E4;
      --accent: #C2410C;
      --accent-hover: #9A3412;
      --code-bg: #18181B;
      --code-text: #F4F4F5;
      --success: #15803D;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 16px; font-size: 13px; line-height: 1.5; }
    .container { max-width: 600px; margin: 0 auto; background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
    h2 { font-size: 16px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; justify-content: space-between; }
    .badge { font-size: 10px; font-family: monospace; background: #FFEDD5; color: #9A3412; padding: 2px 8px; border-radius: 6px; font-weight: 700; text-transform: uppercase; }
    .desc { font-size: 12px; color: var(--subtext); margin-bottom: 16px; }
    .grid-tools { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
    .tool-btn { background: #F5F5F4; border: 1px solid var(--border); border-radius: 10px; padding: 10px; text-align: left; cursor: pointer; transition: all 0.2s; }
    .tool-btn:hover, .tool-btn.active { background: #FFF7ED; border-color: var(--accent); }
    .tool-name { font-weight: 600; font-size: 12px; color: var(--text); }
    .tool-meta { font-size: 10px; color: var(--subtext); font-family: monospace; margin-top: 2px; }
    .action-row { display: flex; gap: 8px; margin-bottom: 16px; }
    button.exec-btn { flex: 1; background: var(--accent); color: white; border: none; border-radius: 10px; padding: 10px; font-weight: 600; font-size: 12px; cursor: pointer; transition: background 0.2s; }
    button.exec-btn:hover { background: var(--accent-hover); }
    .metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 16px; padding: 12px; background: #F5F5F4; border-radius: 10px; }
    .metric-val { font-size: 16px; font-weight: 700; color: var(--accent); }
    .metric-lbl { font-size: 10px; color: var(--subtext); text-transform: uppercase; }
    .log-box { background: var(--code-bg); color: var(--code-text); border-radius: 10px; padding: 12px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 11px; max-height: 180px; overflow-y: auto; white-space: pre-wrap; }
  </style>
</head>
<body>
  <div class="container">
    <h2>
      <span>Agentic Tool Workbench</span>
      <span class="badge">JSON-RPC 2.0</span>
    </h2>
    <p class="desc">Simulate live tool execution, token accounting, and sandboxing safety barriers.</p>

    <div class="grid-tools">
      <div class="tool-btn active" id="btn-exa" onclick="selectTool('exa')">
        <div class="tool-name">Exa Neural Web Search</div>
        <div class="tool-meta">MCP · Read-Only · 42ms</div>
      </div>
      <div class="tool-btn" id="btn-e2b" onclick="selectTool('e2b')">
        <div class="tool-name">E2B Python Wasm Sandbox</div>
        <div class="tool-meta">MicroVM · Isolated · 120ms</div>
      </div>
      <div class="tool-btn" id="btn-browser" onclick="selectTool('browser')">
        <div class="tool-name">Browser-Use Playwright</div>
        <div class="tool-meta">DOM Parser · Sandbox · 340ms</div>
      </div>
      <div class="tool-btn" id="btn-github" onclick="selectTool('github')">
        <div class="tool-name">GitHub PR Dispatcher</div>
        <div class="tool-meta">Mutation · Approval Gate</div>
      </div>
    </div>

    <div class="action-row">
      <button class="exec-btn" onclick="executeSelectedTool()">⚡ Dispatch Tool Call</button>
    </div>

    <div class="metrics">
      <div>
        <div class="metric-lbl">Latency</div>
        <div class="metric-val" id="metric-lat">42 ms</div>
      </div>
      <div>
        <div class="metric-lbl">Tokens Consumed</div>
        <div class="metric-val" id="metric-tok">185 tok</div>
      </div>
      <div>
        <div class="metric-lbl">Security Gate</div>
        <div class="metric-val" id="metric-sec" style="color: #15803D;">Verified</div>
      </div>
    </div>

    <div class="log-box" id="log-output">// JSON-RPC 2.0 MCP Request & Observation Stream
{
  "jsonrpc": "2.0",
  "method": "tools/call",
  "params": {
    "name": "exa_neural_search",
    "arguments": { "query": "latest agentic tool frameworks 2026", "num_results": 3 }
  },
  "id": "call_9481a"
}
--> Observation: Found 3 authoritative benchmarks (SWE-bench, BFCL, GAIA).</div>
  </div>

  <script>
    let currentTool = 'exa';
    const tools = {
      exa: {
        name: 'Exa Neural Web Search',
        lat: '42 ms',
        tok: '185 tok',
        sec: 'Verified (Read-Only)',
        secColor: '#15803D',
        req: '{\\n  "jsonrpc": "2.0",\\n  "method": "tools/call",\\n  "params": {\\n    "name": "exa_neural_search",\\n    "arguments": { "query": "agentic tool standards 2026" }\\n  },\\n  "id": "req_01"\\n}\\n--> [200 OK] 3 sources extracted with highlight citations.'
      },
      e2b: {
        name: 'E2B Python Wasm Sandbox',
        lat: '118 ms',
        tok: '340 tok',
        sec: 'Sandboxed MicroVM',
        secColor: '#15803D',
        req: '{\\n  "jsonrpc": "2.0",\\n  "method": "tools/call",\\n  "params": {\\n    "name": "e2b_python_exec",\\n    "arguments": { "code": "import numpy as np\\nprint(np.mean([98.2, 94.1, 99.0]))" }\\n  },\\n  "id": "req_02"\\n}\\n--> stdout: 97.10 (Execution duration: 0.11s)'
      },
      browser: {
        name: 'Browser-Use Playwright',
        lat: '340 ms',
        tok: '520 tok',
        sec: 'Egress Filtered',
        secColor: '#15803D',
        req: '{\\n  "jsonrpc": "2.0",\\n  "method": "tools/call",\\n  "params": {\\n    "name": "browser_navigate",\\n    "arguments": { "url": "https://modelcontextprotocol.io", "action": "extract_dom" }\\n  },\\n  "id": "req_03"\\n}\\n--> [Accessibility Tree parsed]: 14 interactive controls resolved.'
      },
      github: {
        name: 'GitHub PR Dispatcher',
        lat: '210 ms',
        tok: '290 tok',
        sec: 'HITL Approved',
        secColor: '#C2410C',
        req: '{\\n  "jsonrpc": "2.0",\\n  "method": "tools/call",\\n  "params": {\\n    "name": "github_create_pr",\\n    "arguments": { "repo": "lattice/workspace", "title": "feat: add mcp client" }\\n  },\\n  "id": "req_04"\\n}\\n--> Human Approval Verified. Emitted Pull Request #142.'
      }
    };

    function selectTool(toolKey) {
      currentTool = toolKey;
      document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('btn-' + toolKey).classList.add('active');
      const t = tools[toolKey];
      document.getElementById('metric-lat').innerText = t.lat;
      document.getElementById('metric-tok').innerText = t.tok;
      const secEl = document.getElementById('metric-sec');
      secEl.innerText = t.sec;
      secEl.style.color = t.secColor;
      document.getElementById('log-output').innerText = t.req.replace(/\\\\n/g, '\\n');
    }

    function executeSelectedTool() {
      const t = tools[currentTool];
      const out = document.getElementById('log-output');
      out.innerText = '// Dispatching JSON-RPC 2.0 tool invocation over streamable HTTP...\\n';
      setTimeout(() => {
        out.innerText = t.req.replace(/\\\\n/g, '\\n') + '\\n\\n✓ Audit record committed to session log.';
      }, 400);
    }
  </script>
</body>
</html>`,
        changeSummary: 'Interactive Agentic Tool simulator with live JSON-RPC metrics',
        createdAt: '2026-08-15T05:00:00Z'
      }
    ]
  },
  {
    id: 'art_nordic_brief',
    title: 'Scandinavian Furniture Positioning & Competitive Matrix',
    description: 'Executive market analysis comparing Muuto, HAY, and Aura Nordic with strategic differentiation factors.',
    type: 'markdown',
    currentVersion: 2,
    projectId: 'proj_nordic_01',
    conversationId: 'conv_seed_01',
    status: 'rendered',
    createdAt: '2026-08-14T10:00:00Z',
    updatedAt: '2026-08-15T03:45:00Z',
    tags: ['Strategy', 'Competitive Analysis', 'Nordic Living'],
    versions: [
      {
        version: 1,
        content: '# Scandinavian Furniture Positioning\n\nInitial draft focusing on Muuto and HAY pricing.',
        changeSummary: 'Initial generated draft',
        createdAt: '2026-08-14T10:00:00Z'
      },
      {
        version: 2,
        content: `# Scandinavian Furniture Positioning & Competitive Matrix

**Document Purpose:** Define market differentiation for Aura Nordic Living across European and North American metropolitan markets.

---

## 1. Executive Summary
The premium Scandinavian furniture sector has shifted from purely aesthetic minimalism toward **proven sustainability, circular material traceability, and tactile warmth**. Aura Nordic commands an open niche by offering modular heirloom craftsmanship at direct-to-consumer pricing.

---

## 2. Competitive Comparison Table

| Brand | Price Tier | Hero Materiality | Core Vulnerability | Aura Advantage |
|---|---|---|---|---|
| **HAY** | Accessible Premium | Powder-coated steel, molded plywood | Fast-trend fatigue | 25-Year Solid Wood Warranty |
| **Muuto** | Mid-High Luxury | Kvadrat upholstery, ash veneer | High dealer markups | Direct-to-Consumer Custom Builds |
| **Carl Hansen** | Heritage Luxury | Oiled oak, paper cord | Slow 12-week lead times | 7-Day Flat-Pack Express Delivery |

---

## 3. Strategic Recommendations
1. **Focus on Tactile Oak & Linen:** Emphasize zero-VOC organic oil finishes.
2. **Circular Buy-Back Guarantee:** Offer a 40% trade-in credit for lifetime returns to establish unmatched brand loyalty.
3. **Transparent Carbon Manifest:** Print the exact kg CO2e footprint on every furniture serial badge.`,
        changeSummary: 'Added competitive matrix table and circular warranty strategy.',
        createdAt: '2026-08-15T03:45:00Z'
      }
    ]
  },
  {
    id: 'art_fintech_diagram',
    title: 'Payment Cascade & Failover Flowchart',
    description: 'Mermaid sequence and flow architecture for real-time payment routing and instant failover.',
    type: 'diagram',
    currentVersion: 1,
    projectId: 'proj_fintech_02',
    conversationId: 'conv_seed_02',
    status: 'rendered',
    createdAt: '2026-08-14T19:00:00Z',
    updatedAt: '2026-08-14T19:00:00Z',
    tags: ['Architecture', 'Mermaid', 'Payments'],
    versions: [
      {
        version: 1,
        content: `flowchart TD
    A[Client Payment Request] --> B[Ingress API Gateway]
    B --> C{Latency & Rail Health Check}
    C -->|P99 < 150ms| D[Primary Rail: Instant SEPA / FedNow]
    C -->|Degraded / Timeout| E[Secondary Fallback: SWIFT Go Cascade]
    D --> F{Settlement Verified?}
    F -->|Yes| G[Emit Webhook & Ledger Credit]
    F -->|No / Stalled| E
    E --> H[Tier-1 Correspondent Bank]
    H --> G`,
        changeSummary: 'Initial payment routing sequence',
        createdAt: '2026-08-14T19:00:00Z'
      }
    ]
  },
  {
    id: 'art_interactive_pricing',
    title: 'Aura Interactive Margin Calculator & UI Preview',
    description: 'Sanitized interactive HTML component displaying real-time unit economics and CO2 offsets.',
    type: 'html_preview',
    currentVersion: 1,
    projectId: 'proj_nordic_01',
    conversationId: 'conv_seed_01',
    status: 'rendered',
    createdAt: '2026-08-15T02:00:00Z',
    updatedAt: '2026-08-15T02:00:00Z',
    tags: ['Interactive', 'HTML Preview', 'Calculator'],
    versions: [
      {
        version: 1,
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #FBFBF9; color: #1C1917; padding: 24px; margin: 0; }
    .card { background: white; border: 1px solid #E7E5E4; border-radius: 12px; padding: 20px; max-width: 480px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    h2 { margin-top: 0; font-size: 18px; color: #1C1917; }
    .field { margin-bottom: 16px; }
    label { display: block; font-size: 12px; font-weight: 600; color: #78716C; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; }
    input[type=range] { width: 100%; accent-color: #C2410C; }
    .metric-row { display: grid; grid-cols: 2; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #F4F4F0; }
    .metric-box { background: #F7F7F4; padding: 12px; border-radius: 8px; }
    .metric-val { font-size: 20px; font-weight: 700; color: #C2410C; }
    .metric-sub { font-size: 11px; color: #78716C; }
  </style>
</head>
<body>
  <div class="card">
    <h2>Aura Unit Margin & Carbon Forecaster</h2>
    <div class="field">
      <label>Production Volume: <span id="vol-lbl">500 units</span></label>
      <input type="range" id="vol" min="100" max="2500" step="50" value="500" oninput="calc()">
    </div>
    <div class="field">
      <label>Retail Price: <span id="price-lbl">$850</span></label>
      <input type="range" id="price" min="400" max="1500" step="25" value="850" oninput="calc()">
    </div>
    <div class="metric-row">
      <div class="metric-box">
        <div class="metric-sub">Net Gross Margin</div>
        <div class="metric-val" id="margin-val">68.2%</div>
      </div>
      <div class="metric-box">
        <div class="metric-sub">CO2 Offset Total</div>
        <div class="metric-val" id="co2-val" style="color: #15803D;">18.5 tons</div>
      </div>
    </div>
  </div>
  <script>
    function calc() {
      const vol = document.getElementById('vol').value;
      const price = document.getElementById('price').value;
      document.getElementById('vol-lbl').innerText = vol + ' units';
      document.getElementById('price-lbl').innerText = '$' + price;
      const cogs = 270 - (vol * 0.03);
      const margin = ((price - cogs) / price) * 100;
      document.getElementById('margin-val').innerText = margin.toFixed(1) + '%';
      document.getElementById('co2-val').innerText = (vol * 0.037).toFixed(1) + ' tons';
    }
    calc();
  </script>
</body>
</html>`,
        changeSummary: 'Interactive HTML preview margin model',
        createdAt: '2026-08-15T02:00:00Z'
      }
    ]
  }
];

const INITIAL_AGENTS: AgentDefinition[] = [
  {
    id: 'agent_main_default',
    name: 'Lattice Primary Orchestrator',
    description: 'Accountable parent orchestrator. Plans, delegates to specialist subagents, manages tool approvals, and synthesizes completed work.',
    mark: 'lattice',
    roleType: 'both',
    specialty: 'parent_orchestrator',
    systemInstructions: 'You are the Lattice Primary Orchestration Agent. Always parse the user goal, form a structured plan, enforce project context boundaries, delegate specialist tasks, and compile durable artifacts with citations.',
    modelPolicy: 'gemini-2.5-flash',
    allowedSkillIds: ['skill_research', 'skill_tools_research', 'skill_visual_direction', 'skill_qa', 'skill_diagram'],
    allowedToolIds: ['tool_exa_search', 'tool_render_mermaid', 'tool_image_gen', 'mcp_e2b_sandbox'],
    memoryPolicy: 'project_only',
    approvalPolicy: {
      automaticLowRisk: true,
      askMediumRisk: true,
      alwaysConfirmHighRisk: true
    },
    enabled: true,
    version: '2.4.0'
  },
  {
    id: 'agent_tool_architect',
    name: 'Agentic Tools & MCP Architect',
    description: 'Specializes in Model Context Protocol (MCP) server design, dynamic Tool-RAG, schema negotiation, and microVM sandbox isolation policies.',
    mark: 'terminal',
    roleType: 'subagent',
    specialty: 'connector_operator',
    systemInstructions: 'Provide rigorous architectural analysis of agent tool-calling patterns, JSON-RPC 2.0 schemas, token economics, and execution sandboxes (E2B, Wasm, Docker). Enforce human approval gates on consequential side effects.',
    modelPolicy: 'gemini-2.5-flash',
    allowedSkillIds: ['skill_tools_research', 'skill_mcp_eval', 'skill_diagram'],
    allowedToolIds: ['tool_exa_search', 'mcp_e2b_sandbox', 'mcp_browser_use'],
    memoryPolicy: 'project_only',
    approvalPolicy: {
      automaticLowRisk: true,
      askMediumRisk: true,
      alwaysConfirmHighRisk: true
    },
    enabled: true,
    version: '1.2.0'
  },
  {
    id: 'agent_researcher',
    name: 'Exa Specialist Researcher',
    description: 'Deep web search, competitive intelligence, evidence gathering, and citation extraction.',
    mark: 'search',
    roleType: 'subagent',
    specialty: 'researcher',
    systemInstructions: 'Extract high-confidence evidence from web and project sources. Always map claims to exact source URLs and quotes. Never fabricate statistics.',
    modelPolicy: 'gemini-2.5-flash',
    allowedSkillIds: ['skill_research'],
    allowedToolIds: ['tool_exa_search'],
    memoryPolicy: 'project_only',
    approvalPolicy: {
      automaticLowRisk: true,
      askMediumRisk: true,
      alwaysConfirmHighRisk: true
    },
    enabled: true,
    version: '1.8.0'
  },
  {
    id: 'agent_visual_director',
    name: 'Visual & Architecture Director',
    description: 'Design systems, Mermaid diagrams, typography pairing, wireframe architecture, and aesthetic palettes.',
    mark: 'palette',
    roleType: 'subagent',
    specialty: 'visual_director',
    systemInstructions: 'Create clear, aesthetically restrained design directions, Mermaid flowcharts, and SVG compositions using the Lattice design tokens.',
    modelPolicy: 'gemini-2.5-flash',
    allowedSkillIds: ['skill_visual_direction', 'skill_diagram'],
    allowedToolIds: ['tool_render_mermaid', 'tool_image_gen'],
    memoryPolicy: 'project_only',
    approvalPolicy: {
      automaticLowRisk: true,
      askMediumRisk: true,
      alwaysConfirmHighRisk: true
    },
    enabled: true,
    version: '2.1.0'
  },
  {
    id: 'agent_qa_reviewer',
    name: 'Lattice QA & Verification Reviewer',
    description: 'Audits factual citations, responsive UX, accessibility contrast, and safety boundaries.',
    mark: 'shield',
    roleType: 'subagent',
    specialty: 'qa_reviewer',
    systemInstructions: 'Review generated outputs against success criteria. Check citations, verify that no arbitrary code execution was claimed, and identify any inconsistencies.',
    modelPolicy: 'gemini-2.5-flash',
    allowedSkillIds: ['skill_qa'],
    allowedToolIds: [],
    memoryPolicy: 'project_only',
    approvalPolicy: {
      automaticLowRisk: true,
      askMediumRisk: true,
      alwaysConfirmHighRisk: true
    },
    enabled: true,
    version: '1.5.0'
  }
];

const INITIAL_SKILLS: SkillDefinition[] = [
  {
    id: 'skill_tools_research',
    name: 'Agentic Tools & Architecture Analysis',
    commandTrigger: '/tools-research',
    description: 'Deep architectural evaluation of modern tool calling, MCP servers, execution sandboxing, and token economics.',
    instructions: 'Analyze tool schemas, evaluate protocol latency, compare MCP vs classical function calling, and produce authoritative research briefs with architectural diagrams.',
    requiredCapabilities: ['tool_analysis', 'mcp_evaluation', 'diagram_generation'],
    allowedToolIds: ['tool_exa_search', 'tool_render_mermaid', 'mcp_e2b_sandbox'],
    outputFormat: 'Comprehensive Research Compendium & Architecture Diagrams',
    risk: 'low',
    version: '2.0.0',
    enabled: true,
    author: 'Lattice Core'
  },
  {
    id: 'skill_mcp_eval',
    name: 'MCP Schema & Boundary Evaluator',
    commandTrigger: '/mcp-eval',
    description: 'Verify remote MCP JSON-RPC 2.0 schemas, evaluate token cost overhead, and audit security boundaries.',
    instructions: 'Inspect tool arguments, simulate payload sizes, and verify human-in-the-loop triggers for high-risk write operations.',
    requiredCapabilities: ['mcp_evaluation', 'security_audit'],
    allowedToolIds: ['tool_render_mermaid'],
    outputFormat: 'MCP Evaluation Matrix',
    risk: 'low',
    version: '1.5.0',
    enabled: true,
    author: 'Lattice Core'
  },
  {
    id: 'skill_research',
    name: 'Deep Market & Web Research',
    commandTrigger: '/research',
    description: 'Conduct multi-source web research with Exa search, extract citations, and compile an evidence matrix.',
    instructions: 'Formulate search queries, execute web search, deduplicate findings, extract direct quotes, and produce cited summaries.',
    requiredCapabilities: ['web_search', 'citation_mapping'],
    allowedToolIds: ['tool_exa_search'],
    outputFormat: 'Structured Markdown Brief with Citations',
    risk: 'low',
    version: '2.2.0',
    enabled: true,
    author: 'Lattice Core'
  },
  {
    id: 'skill_visual_direction',
    name: 'Visual Direction & Design Token Brief',
    commandTrigger: '/visual-direction',
    description: 'Create an authoritative visual design brief with typography, color palettes, spacing geometry, and asset plans.',
    instructions: 'Define the 4 visual states, restrained warm graphite palettes, typography scale, and layout guidelines.',
    requiredCapabilities: ['design_systems', 'asset_planning'],
    allowedToolIds: [],
    outputFormat: 'Design System Markdown Specification',
    risk: 'low',
    version: '1.4.0',
    enabled: true,
    author: 'Lattice Core'
  },
  {
    id: 'skill_diagram',
    name: 'Mermaid Diagram & Architecture Flow',
    commandTrigger: '/diagram',
    description: 'Generate syntax-validated Mermaid sequence, flowchart, or state diagrams.',
    instructions: 'Construct valid Mermaid diagram syntax with clear node hierarchies and clean direction labels.',
    requiredCapabilities: ['mermaid_rendering'],
    allowedToolIds: ['tool_render_mermaid'],
    outputFormat: 'Mermaid Artifact',
    risk: 'low',
    version: '2.0.0',
    enabled: true,
    author: 'Lattice Core'
  },
  {
    id: 'skill_qa',
    name: 'QA & Citation Verification',
    commandTrigger: '/qa',
    description: 'Audit an artifact or plan against 34 QA acceptance rules and verify source citations.',
    instructions: 'Audit outputs for hallucination, verify citation links, check responsive layout criteria, and confirm safety boundaries.',
    requiredCapabilities: ['verification_audit'],
    allowedToolIds: [],
    outputFormat: 'QA Audit Report',
    risk: 'low',
    version: '1.9.0',
    enabled: true,
    author: 'Lattice Core'
  }
];

const INITIAL_CONNECTORS: RemoteMcpConnector[] = [
  {
    id: 'mcp_e2b_sandbox',
    displayName: 'E2B Sandboxed Code Interpreter MCP',
    description: 'Isolated ephemeral microVM runtime for executing Python, Node.js, and data science code without host network exposure.',
    endpointUrl: 'https://mcp.e2b.dev/v1/sandbox',
    transport: 'streamable_http',
    authMode: 'api_key',
    authStatus: 'authenticated',
    scopes: ['sandbox.exec', 'sandbox.files.write', 'sandbox.timeout.60s'],
    status: 'connected',
    allowedTools: [
      {
        name: 'e2b_python_exec',
        description: 'Execute arbitrary Python code with pandas, numpy, and matplotlib in isolated microVM',
        risk: 'medium',
        inputSchema: { code: 'string', timeoutSeconds: 'number' }
      },
      {
        name: 'e2b_fs_read',
        description: 'Read generated output files or charts from the sandbox environment',
        risk: 'low',
        inputSchema: { path: 'string' }
      }
    ],
    schemaHash: 'sha256:8f12c90e543b174a',
    health: {
      lastCheckedAt: '2026-08-15T05:20:00Z',
      latencyMs: 118,
      statusCode: 200
    },
    createdAt: '2026-08-14T10:00:00Z'
  },
  {
    id: 'mcp_browser_use',
    displayName: 'Browser-Use Automation & DOM Parser MCP',
    description: 'Headless Chromium sandboxed browser for rendering web applications, extracting DOM trees, and simulating user flows.',
    endpointUrl: 'https://mcp.browser-use.com/v1/stream',
    transport: 'streamable_http',
    authMode: 'api_key',
    authStatus: 'authenticated',
    scopes: ['browser.navigate', 'browser.screenshot', 'browser.accessibility_tree'],
    status: 'connected',
    allowedTools: [
      {
        name: 'browser_navigate',
        description: 'Navigate to target URL, wait for network idle, and extract parsed accessibility tree',
        risk: 'medium',
        inputSchema: { url: 'string', waitForSelector: 'string' }
      },
      {
        name: 'browser_screenshot',
        description: 'Capture viewport screenshot and return base64 grounded visual image',
        risk: 'low',
        inputSchema: { width: 'number', height: 'number' }
      }
    ],
    schemaHash: 'sha256:6e44b91f008812c3',
    health: {
      lastCheckedAt: '2026-08-15T05:15:00Z',
      latencyMs: 340,
      statusCode: 200
    },
    createdAt: '2026-08-14T11:30:00Z'
  },
  {
    id: 'mcp_exa_research',
    displayName: 'Exa Deep Web Research MCP',
    description: 'Remote Streamable HTTP endpoint for real-time neural web search, domain filtering, and highlight extraction.',
    endpointUrl: 'https://mcp.exa.ai/v1/stream',
    transport: 'streamable_http',
    authMode: 'api_key',
    authStatus: 'authenticated',
    scopes: ['search.read', 'contents.highlights'],
    status: 'connected',
    allowedTools: [
      {
        name: 'web_search_exa',
        description: 'Execute high-precision search with live web index',
        risk: 'low',
        inputSchema: { query: 'string', numResults: 'number' }
      },
      {
        name: 'deep_research',
        description: 'Multi-step structured competitor intelligence and evidence gathering',
        risk: 'low',
        inputSchema: { query: 'string', outputSchema: 'object' }
      }
    ],
    schemaHash: 'sha256:4a88b16c84de78c89',
    health: {
      lastCheckedAt: '2026-08-15T05:00:00Z',
      latencyMs: 38,
      statusCode: 200
    },
    createdAt: '2026-08-11T12:00:00Z'
  },
  {
    id: 'mcp_google_drive',
    displayName: 'Google Drive Document Gateway',
    description: 'Remote OAuth 2.1 connector for accessing and exporting project briefs to verified Google Drive folders.',
    endpointUrl: 'https://mcp-gateway.workspace.google.com/drive',
    transport: 'streamable_http',
    authMode: 'oauth2_1',
    authStatus: 'authenticated',
    scopes: ['drive.file.readonly', 'drive.file.create'],
    status: 'connected',
    allowedTools: [
      {
        name: 'list_drive_files',
        description: 'List accessible project folders and documents',
        risk: 'low',
        inputSchema: { folderId: 'string' }
      },
      {
        name: 'create_drive_document',
        description: 'Publish a finalized artifact to designated Google Drive folder',
        risk: 'high',
        inputSchema: { title: 'string', content: 'string', folderId: 'string' }
      }
    ],
    schemaHash: 'sha256:7b29a00f11ac89de3',
    health: {
      lastCheckedAt: '2026-08-15T04:45:00Z',
      latencyMs: 52,
      statusCode: 200
    },
    createdAt: '2026-08-12T14:30:00Z'
  },
  {
    id: 'mcp_github_ops',
    displayName: 'GitHub Repository Ops MCP',
    description: 'Remote connector for repository reading, PR creation, and issue triage.',
    endpointUrl: 'https://mcp.github.com/v1',
    transport: 'streamable_http',
    authMode: 'bearer_token',
    authStatus: 'authenticated',
    scopes: ['repo.read', 'issues.write', 'pull_requests.write'],
    status: 'connected',
    allowedTools: [
      {
        name: 'get_repo_contents',
        description: 'Read repository documentation and specs',
        risk: 'low',
        inputSchema: { repo: 'string', path: 'string' }
      },
      {
        name: 'create_issue_or_pr',
        description: 'Submit an automated PR with synthesized changes',
        risk: 'high',
        inputSchema: { repo: 'string', title: 'string', body: 'string' }
      }
    ],
    schemaHash: 'sha256:e3b0c44298fc1c149',
    health: {
      lastCheckedAt: '2026-08-15T04:30:00Z',
      latencyMs: 44,
      statusCode: 200
    },
    createdAt: '2026-08-13T10:00:00Z'
  }
];

const INITIAL_SCHEDULES: ScheduledTask[] = [
  {
    id: 'sched_001',
    name: 'Weekly Scandinavian Competitor Pulse',
    prompt: 'Search Exa for new product drops or pricing shifts across Muuto, HAY, and Carl Hansen. Generate an updated briefing matrix.',
    agentId: 'agent_main_default',
    projectId: 'proj_nordic_01',
    scheduleExpression: 'Every Monday at 08:00 AM PST',
    scheduleType: 'calendar',
    status: 'active',
    lastRunAt: '2026-08-10T08:00:00Z',
    nextRunAt: '2026-08-17T08:00:00Z',
    history: [
      {
        runId: 'run_sched_01',
        timestamp: '2026-08-10T08:00:00Z',
        status: 'success',
        durationMs: 4200,
        summary: 'Completed competitor research. Detected 2 new sustainable oak lines from Muuto.',
        artifactIds: ['art_nordic_brief']
      }
    ],
    createdAt: '2026-08-08T10:00:00Z'
  },
  {
    id: 'sched_002',
    name: 'Daily Payment Rail Health & ISO-20022 Audit',
    prompt: 'Audit Nexus routing logs for error spikes and verify SEPA Instant SLA conformance.',
    agentId: 'agent_main_default',
    projectId: 'proj_fintech_02',
    scheduleExpression: 'Every day at 06:00 AM PST',
    scheduleType: 'interval',
    status: 'active',
    lastRunAt: '2026-08-15T06:00:00Z',
    nextRunAt: '2026-08-16T06:00:00Z',
    history: [
      {
        runId: 'run_sched_02',
        timestamp: '2026-08-15T06:00:00Z',
        status: 'success',
        durationMs: 3100,
        summary: 'P99 latency steady at 142ms. Zero degraded routes detected.'
      }
    ],
    createdAt: '2026-08-12T11:00:00Z'
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_seed_01',
    title: 'Scandinavian Design Positioning & Strategy',
    scope: 'project',
    projectId: 'proj_nordic_01',
    agentId: 'agent_main_default',
    memoryMode: 'project_only',
    status: 'active',
    createdAt: '2026-08-14T09:30:00Z',
    updatedAt: '2026-08-15T03:45:00Z',
    pinnedArtifactId: 'art_nordic_brief'
  },
  {
    id: 'conv_standalone_01',
    title: 'Cross-Border Routing Architecture',
    scope: 'standalone',
    agentId: 'agent_main_default',
    memoryMode: 'global',
    status: 'active',
    createdAt: '2026-08-15T01:00:00Z',
    updatedAt: '2026-08-15T02:30:00Z'
  }
];

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_001',
    conversationId: 'conv_seed_01',
    role: 'user',
    content: 'Research competitor positioning for Nordic living brands (Muuto and HAY) and draft an executive positioning brief with a competitive matrix.',
    createdAt: '2026-08-14T09:30:00Z'
  },
  {
    id: 'msg_002',
    conversationId: 'conv_seed_01',
    role: 'assistant',
    turnType: 'completion_summary',
    content: `I have completed the multi-step research and created the **Scandinavian Furniture Positioning & Competitive Matrix** artifact.

### Key Outcomes:
- **Parent Plan Executed:** Delegated parallel competitor retrieval to the **Researcher** subagent and design structure to the **Visual Director**.
- **Grounded Citations:** Analyzed project source \`Aura_Market_Research_Q3.pdf\` alongside Exa live web findings.
- **Durable Artifact:** Rendered Markdown matrix with circular warranty strategies, saved to Project Knowledge.`,
    createdAt: '2026-08-14T09:31:30Z',
    plan: {
      goal: 'Research Scandinavian furniture competitors and create positioning artifact',
      delegationMode: 'parallel',
      steps: [
        {
          stepId: 'step_1',
          objective: 'Retrieve competitor pricing & warranty data via Exa Research MCP',
          assignedRole: 'researcher',
          dependsOn: [],
          candidateToolIds: ['tool_exa_search'],
          risk: 'low',
          status: 'completed',
          completionCriteria: ['Extract pricing tiers for Muuto and HAY', 'Map circular warranty terms']
        },
        {
          stepId: 'step_2',
          objective: 'Synthesize positioning matrix and circular trade-in model',
          assignedRole: 'artifact_maker',
          dependsOn: ['step_1'],
          candidateToolIds: [],
          risk: 'low',
          status: 'completed',
          completionCriteria: ['Render Markdown table and executive recommendations']
        },
        {
          stepId: 'step_3',
          objective: 'Audit citations and verify product boundaries',
          assignedRole: 'qa_reviewer',
          dependsOn: ['step_2'],
          candidateToolIds: [],
          risk: 'low',
          status: 'completed',
          completionCriteria: ['Verify all factual claims match sources', 'Confirm zero code-execution claims']
        }
      ]
    },
    subagents: [
      {
        taskId: 'sub_task_01',
        parentRunId: 'run_seed_01',
        role: 'researcher',
        goal: 'Retrieve Scandinavian furniture market benchmarks',
        dependencies: [],
        status: 'completed',
        tokenBudget: 4000,
        tokensUsed: 2150,
        timeBudgetMs: 15000,
        inputPayload: { query: 'Muuto vs HAY furniture market share warranty' },
        outputPayload: { summary: 'HAY leads in volume; Muuto leads in custom contract builds. Circular warranty is an open differentiator.' },
        citations: ['Aura_Market_Research_Q3.pdf', 'https://exa.ai/scandi-living-2026'],
        confidence: 0.95
      },
      {
        taskId: 'sub_task_02',
        parentRunId: 'run_seed_01',
        role: 'qa_reviewer',
        goal: 'Verify citation mapping and tone constraints',
        dependencies: ['sub_task_01'],
        status: 'completed',
        tokenBudget: 2000,
        tokensUsed: 890,
        timeBudgetMs: 10000,
        inputPayload: { artifactId: 'art_nordic_brief' },
        outputPayload: { passed: true, checksRun: 8, defectsFound: 0 },
        citations: [],
        confidence: 0.99
      }
    ],
    artifactIds: ['art_nordic_brief'],
    citations: [
      {
        id: 'cit_01',
        sourceId: 'src_nordic_pdf',
        title: 'Aura Market Research Q3',
        type: 'project_source',
        snippet: 'Identified a 34% surge in demand for modular oiled oak dining systems with transparent repair warranties.',
        relevanceScore: 0.98
      }
    ]
  }
];

class LatticeStore {
  private listeners: Set<() => void> = new Set();

  private get<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  }

  private set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.notify();
    } catch (e) {
      console.warn('Storage write error:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // User
  public getUser(): UserProfile {
    return this.get(STORAGE_KEYS.USER, INITIAL_USER);
  }
  public updateUser(updates: Partial<UserProfile>): void {
    const current = this.getUser();
    this.set(STORAGE_KEYS.USER, { ...current, ...updates });
  }

  // Projects
  public getProjects(): Project[] {
    return this.get(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }
  public getProject(id: string): Project | undefined {
    return this.getProjects().find((p) => p.id === id);
  }
  public saveProject(project: Project): void {
    const list = this.getProjects();
    const idx = list.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      list[idx] = { ...project, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(project);
    }
    this.set(STORAGE_KEYS.PROJECTS, list);
    this.logAudit('Frank Chibuike', 'save_project', 'project', project.id, `Saved project ${project.name}`);
  }
  public deleteProject(id: string): void {
    const list = this.getProjects().filter((p) => p.id !== id);
    this.set(STORAGE_KEYS.PROJECTS, list);
    this.logAudit('Frank Chibuike', 'delete_project', 'project', id, `Deleted project ${id}`);
  }

  // Conversations
  public getConversations(): Conversation[] {
    return this.get(STORAGE_KEYS.CONVERSATIONS, INITIAL_CONVERSATIONS);
  }
  public getConversation(id: string): Conversation | undefined {
    return this.getConversations().find((c) => c.id === id);
  }
  public saveConversation(conv: Conversation): void {
    const list = this.getConversations();
    const idx = list.findIndex((c) => c.id === conv.id);
    if (idx >= 0) {
      list[idx] = { ...conv, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(conv);
    }
    this.set(STORAGE_KEYS.CONVERSATIONS, list);
  }
  public deleteConversation(id: string): void {
    const list = this.getConversations().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CONVERSATIONS, list);
  }

  // Messages
  public getMessages(conversationId?: string): Message[] {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    if (!conversationId) return all;
    return all.filter((m) => m.conversationId === conversationId);
  }
  public addMessage(msg: Message): void {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    all.push(msg);
    this.set(STORAGE_KEYS.MESSAGES, all);
  }
  public updateMessage(msgId: string, updates: Partial<Message>): void {
    const all = this.get<Message[]>(STORAGE_KEYS.MESSAGES, INITIAL_MESSAGES);
    const idx = all.findIndex((m) => m.id === msgId);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...updates };
      this.set(STORAGE_KEYS.MESSAGES, all);
    }
  }

  // Artifacts
  public getArtifacts(projectId?: string): Artifact[] {
    const all = this.get<Artifact[]>(STORAGE_KEYS.ARTIFACTS, INITIAL_ARTIFACTS);
    if (!projectId) return all;
    return all.filter((a) => a.projectId === projectId);
  }
  public getArtifact(id: string): Artifact | undefined {
    return this.getArtifacts().find((a) => a.id === id);
  }
  public saveArtifact(artifact: Artifact): void {
    const list = this.get<Artifact[]>(STORAGE_KEYS.ARTIFACTS, INITIAL_ARTIFACTS);
    const idx = list.findIndex((a) => a.id === artifact.id);
    if (idx >= 0) {
      list[idx] = { ...artifact, updatedAt: new Date().toISOString() };
    } else {
      list.unshift(artifact);
    }
    this.set(STORAGE_KEYS.ARTIFACTS, list);
  }

  // Sources
  public getSources(projectId?: string): ProjectSource[] {
    const all = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, INITIAL_SOURCES);
    if (!projectId) return all;
    return all.filter((s) => s.projectId === projectId);
  }
  public addSource(source: ProjectSource): void {
    const list = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, INITIAL_SOURCES);
    list.unshift(source);
    this.set(STORAGE_KEYS.SOURCES, list);
    this.logAudit('Frank Chibuike', 'upload_source', 'source', source.id, `Uploaded ${source.name}`);
  }
  public deleteSource(id: string): void {
    const list = this.get<ProjectSource[]>(STORAGE_KEYS.SOURCES, INITIAL_SOURCES).filter((s) => s.id !== id);
    this.set(STORAGE_KEYS.SOURCES, list);
    this.logAudit('Frank Chibuike', 'delete_source', 'source', id, `Deleted source ${id}`);
  }

  // Agents & Skills
  public getAgents(): AgentDefinition[] {
    return this.get(STORAGE_KEYS.AGENTS, INITIAL_AGENTS);
  }
  public saveAgent(agent: AgentDefinition): void {
    const list = this.getAgents();
    const idx = list.findIndex((a) => a.id === agent.id);
    if (idx >= 0) list[idx] = agent;
    else list.push(agent);
    this.set(STORAGE_KEYS.AGENTS, list);
  }
  public getSkills(): SkillDefinition[] {
    return this.get(STORAGE_KEYS.SKILLS, INITIAL_SKILLS);
  }
  public saveSkill(skill: SkillDefinition): void {
    const list = this.getSkills();
    const idx = list.findIndex((s) => s.id === skill.id);
    if (idx >= 0) list[idx] = skill;
    else list.push(skill);
    this.set(STORAGE_KEYS.SKILLS, list);
  }

  // Connectors
  public getConnectors(): RemoteMcpConnector[] {
    return this.get(STORAGE_KEYS.CONNECTORS, INITIAL_CONNECTORS);
  }
  public saveConnector(connector: RemoteMcpConnector): void {
    const list = this.getConnectors();
    const idx = list.findIndex((c) => c.id === connector.id);
    if (idx >= 0) list[idx] = connector;
    else list.unshift(connector);
    this.set(STORAGE_KEYS.CONNECTORS, list);
    this.logAudit('Frank Chibuike', 'update_connector', 'connector', connector.id, `Updated connector ${connector.displayName}`);
  }
  public deleteConnector(id: string): void {
    const list = this.getConnectors().filter((c) => c.id !== id);
    this.set(STORAGE_KEYS.CONNECTORS, list);
    this.logAudit('Frank Chibuike', 'remove_connector', 'connector', id, `Removed connector ${id}`);
  }

  // Schedules
  public getSchedules(projectId?: string): ScheduledTask[] {
    const all = this.get<ScheduledTask[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    if (!projectId) return all;
    return all.filter((s) => s.projectId === projectId);
  }
  public saveSchedule(task: ScheduledTask): void {
    const list = this.get<ScheduledTask[]>(STORAGE_KEYS.SCHEDULES, INITIAL_SCHEDULES);
    const idx = list.findIndex((s) => s.id === task.id);
    if (idx >= 0) list[idx] = task;
    else list.unshift(task);
    this.set(STORAGE_KEYS.SCHEDULES, list);
    this.logAudit('Frank Chibuike', 'save_schedule', 'schedule', task.id, `Saved schedule ${task.name}`);
  }

  // Memories
  public getMemories(projectId?: string, mode?: MemoryMode): MemoryItem[] {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES);
    if (mode === 'temporary_off') return [];
    if (mode === 'project_only' && projectId) {
      return all.filter((m) => m.scope === 'project_only' && m.projectId === projectId);
    }
    return all;
  }
  public saveMemory(item: MemoryItem): void {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES);
    const idx = all.findIndex((m) => m.id === item.id);
    if (idx >= 0) all[idx] = item;
    else all.unshift(item);
    this.set(STORAGE_KEYS.MEMORIES, all);
    this.logAudit('Frank Chibuike', 'create_memory', 'memory', item.id, `Saved memory item`);
  }
  public deleteMemory(id: string): void {
    const all = this.get<MemoryItem[]>(STORAGE_KEYS.MEMORIES, INITIAL_MEMORIES).filter((m) => m.id !== id);
    this.set(STORAGE_KEYS.MEMORIES, all);
    this.logAudit('Frank Chibuike', 'delete_memory', 'memory', id, `Deleted memory item`);
  }
  public clearAllMemories(): void {
    this.set(STORAGE_KEYS.MEMORIES, []);
    this.logAudit('Frank Chibuike', 'clear_all_memories', 'memory', 'all', 'Cleared all memory items');
  }

  // Audit Logs
  public getAuditLogs(): AuditEvent[] {
    return this.get(STORAGE_KEYS.AUDIT, [
      {
        id: 'aud_001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        actor: 'Lattice Primary Orchestrator',
        action: 'run_completed',
        targetType: 'run',
        targetId: 'run_seed_01',
        details: 'Rendered artifact Scandinavian Furniture Positioning v2'
      }
    ]);
  }
  public logAudit(actor: string, action: string, targetType: AuditEvent['targetType'], targetId: string, details: string): void {
    const logs = this.getAuditLogs();
    logs.unshift({
      id: 'aud_' + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString(),
      actor,
      action,
      targetType,
      targetId,
      details
    });
    this.set(STORAGE_KEYS.AUDIT, logs.slice(0, 100));
  }
}

export const latticeStore = new LatticeStore();
