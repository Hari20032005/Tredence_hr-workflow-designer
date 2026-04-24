# HR Workflow Designer

A production-quality HR Workflow Designer built for the Tredence Studio Full Stack Engineering Intern case study. Design, configure, and simulate HR workflows visually using a drag-and-drop canvas.

---

## Quick Start

```bash
npm install
npm run dev
# Opens at http://localhost:5173
```

```bash
npm run build   # Production build
```

---

## Features

### Core (All Required)
- **Drag-and-Drop Canvas** — React Flow canvas with dot-grid background and smooth edge connections
- **5 Node Types** — Start, Task, Approval, Automated Step, End — each with distinct visual identity
- **Node Configuration Forms** — Type-safe forms per node using React Hook Form (live canvas updates)
- **Dynamic Parameter Fields** — Automated Step form dynamically renders fields based on the selected API action
- **Key-Value Editor** — Reusable component for metadata (Start) and custom fields (Task)
- **Mock API Layer** — MSW intercepts `GET /api/automations` and `POST /api/simulate`
- **Workflow Sandbox Panel** — Animated step-by-step execution timeline with graph validation

### Bonus (All Implemented)
- **Export / Import JSON** — Download and re-import workflow graphs as `.workflow.json`
- **Undo / Redo** — Full history stack, keyboard shortcuts `⌘Z` / `⌘⇧Z`
- **Auto Layout** — Dagre-based hierarchical layout with animated `fitView`
- **Validation Errors on Nodes** — Red indicator + tooltip showing error messages on invalid nodes
- **Node Templates** — 3 pre-built workflows: Employee Onboarding, Leave Approval, Document Verification
- **Mini-map** — Color-coded mini-map matching node type colors
- **Graph Cycle Detection** — DFS-based cycle detection prevents invalid graph submission

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript (strict) |
| Build | Vite |
| Canvas | @xyflow/react (React Flow v11) |
| State | Zustand |
| Forms | React Hook Form |
| Styling | Tailwind CSS v4 |
| Mock API | MSW (Mock Service Worker) |
| Graph Layout | Dagre |
| Icons | Lucide React |

---

## Architecture

```
src/
  api/
    automations.ts       # Static mock automation actions (GET /api/automations data)
    simulate.ts          # Topological sort simulation engine (real graph traversal)
    index.ts             # fetch() API client functions

  types/
    nodes.ts             # Discriminated union WorkflowNodeData, per-node interfaces
    api.ts               # AutomationAction, SimulateRequest/Response types

  store/
    workflowStore.ts     # nodes, edges, selectedNodeId, undo/redo history (Zustand)
    simulationStore.ts   # simulation status, steps, errors (Zustand)

  hooks/
    useAutomations.ts    # Fetch + cache automation actions from MSW
    useSimulation.ts     # Validate → serialize → POST /api/simulate → animate steps
    useKeyboardShortcuts.ts  # ⌘Z / ⌘⇧Z undo/redo bindings

  components/
    canvas/              # ReactFlow canvas + drag-drop drop handler
    nodes/               # 5 custom node components extending BaseNode
    forms/               # Node config forms + shared FormField, Input, Select, KeyValueEditor
    sidebar/             # NodePalette (draggable cards) + template buttons
    sandbox/             # SandboxPanel modal + ExecutionTimeline animation
    layout/              # TopBar (title, undo/redo, export/import, run)

  utils/
    graphValidation.ts   # validateWorkflow(): cycle detection, connectivity, required fields
    autoLayout.ts        # Dagre layout → node positions
    workflowSerializer.ts  # exportWorkflow() / importWorkflow()
    templates.ts         # Pre-built workflow graphs for 3 HR scenarios

  mocks/
    browser.ts           # MSW service worker setup
    handlers.ts          # Request handlers for /api/automations and /api/simulate
```

---

## Key Design Decisions

### Zustand over Context + useReducer
The canvas re-renders on every drag event. Zustand's shallow comparison and fine-grained subscriptions prevent full-tree re-renders. Each panel (canvas, form, topbar) subscribes only to the slice it needs.

### MSW over JSON Server
MSW intercepts at the service worker level — no external process, works identically in dev and build. The `/api/simulate` handler runs a real topological sort (Kahn's algorithm) on the submitted graph rather than returning static data, making the simulation contract meaningful.

### React Hook Form for node forms
Node forms update on every keystroke. Storing form state in Zustand would cause canvas re-renders on every character typed. RHF keeps form state local; `watch()` subscriptions call `updateNodeData` only when values change, keeping the canvas frame rate high.

### Discriminated Union for NodeData
`WorkflowNodeData = StartNodeData | TaskNodeData | ...` is a discriminated union on the `type` field. Adding a new node type requires TypeScript to guide you to every `switch`/`if` that needs updating — preventing silent runtime bugs at scale.

### Undo/Redo via Snapshot Stack
A past/future stack of deep-cloned snapshots stored in Zustand, capped at 50 entries. Snapshots are taken before every mutating operation (add node, delete node, connect edge). This is the same approach used by production design tools.

### Simulation Engine
The mock `POST /api/simulate` performs a real topological sort before executing steps. If a cycle is detected, it returns an error response — the UI surfaces this in the sandbox panel without executing any steps.

---

## Validation Rules

| Rule | Severity |
|---|---|
| Exactly one Start node | Error |
| At least one End node | Error |
| Task node must have a title | Error |
| Graph must be acyclic | Error |
| All nodes must be connected | Warning |
| Automated Step should have an action selected | Warning |

---

## What I Would Add With More Time

1. **Conditional edges** — Branch on approval outcome (approved/rejected paths with labeled edges)
2. **Backend** — FastAPI + PostgreSQL to persist workflows per user, with REST CRUD
3. **Real-time collaboration** — WebSocket + CRDTs for multi-user canvas editing
4. **Auth** — OAuth2 / JWT via Azure AD
5. **Unit + E2E tests** — Jest/RTL for hooks + utils, Playwright for canvas interactions
6. **Storybook** — Design system documentation for all node and form components
7. **Node version history** — Per-node change history, not just canvas-level undo
8. **Kubernetes deployment** — Dockerized app on AKS with GitHub Actions CI/CD

---

## Assessment Criteria Mapping

| Criterion | What's Here |
|---|---|
| React Flow proficiency | 5 custom nodes, typed props, handle positions, minimap, controls, panels |
| React architecture | Zustand stores, custom hooks, discriminated unions, clean folder separation |
| Complex form handling | RHF with live updates, dynamic param fields, key-value editor, validation |
| Mock API interaction | MSW handlers, typed API client, async hooks with loading state |
| Scalability | New node type = 1 interface + 1 node component + 1 form + register in nodeTypes |
| Communication | This README with architecture + design decisions |
| Delivery speed | All required features + all bonus features implemented |
