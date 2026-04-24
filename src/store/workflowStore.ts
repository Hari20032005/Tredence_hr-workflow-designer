import { create } from 'zustand'
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react'
import type { NodeChange, EdgeChange, Connection } from '@xyflow/react'
import { addEdge } from '@xyflow/react'
import type { WorkflowNode, WorkflowEdge, WorkflowNodeData } from '../types/nodes'
import { nanoid } from './nanoid'

interface HistoryEntry {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
}

interface WorkflowState {
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  selectedNodeId: string | null
  workflowTitle: string
  past: HistoryEntry[]
  future: HistoryEntry[]

  onNodesChange: (changes: NodeChange[]) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onConnect: (connection: Connection) => void
  addNode: (node: WorkflowNode) => void
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void
  selectNode: (id: string | null) => void
  setWorkflowTitle: (title: string) => void
  setNodes: (nodes: WorkflowNode[]) => void
  setEdges: (edges: WorkflowEdge[]) => void
  undo: () => void
  redo: () => void
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void
  reset: () => void
}

const MAX_HISTORY = 50

function snapshot(state: { nodes: WorkflowNode[]; edges: WorkflowEdge[] }): HistoryEntry {
  return {
    nodes: JSON.parse(JSON.stringify(state.nodes)),
    edges: JSON.parse(JSON.stringify(state.edges)),
  }
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  workflowTitle: 'Employee Onboarding Workflow',
  past: [],
  future: [],

  onNodesChange: (changes) => {
    const deletions = changes.filter((c) => c.type === 'remove')
    if (deletions.length > 0) {
      const prev = snapshot(get())
      set((s) => ({
        nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[],
        past: [...s.past.slice(-MAX_HISTORY), prev],
        future: [],
        selectedNodeId:
          deletions.some((d) => d.type === 'remove' && d.id === s.selectedNodeId)
            ? null
            : s.selectedNodeId,
      }))
    } else {
      set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as WorkflowNode[] }))
    }
  },

  onEdgesChange: (changes) => {
    const deletions = changes.filter((c) => c.type === 'remove')
    if (deletions.length > 0) {
      const prev = snapshot(get())
      set((s) => ({
        edges: applyEdgeChanges(changes, s.edges) as WorkflowEdge[],
        past: [...s.past.slice(-MAX_HISTORY), prev],
        future: [],
      }))
    } else {
      set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as WorkflowEdge[] }))
    }
  },

  onConnect: (connection) => {
    const prev = snapshot(get())
    // Color edges by target node type to match the reference UI's colored flow paths
    const edgeColors: Record<string, string> = {
      task: '#3b82f6', approval: '#f59e0b', automatedStep: '#a855f7', end: '#f43f5e', start: '#10b981',
    }
    const targetNode = get().nodes.find((n) => n.id === connection.target)
    const strokeColor = edgeColors[targetNode?.data?.type ?? ''] ?? '#3b82f6'
    set((s) => ({
      edges: addEdge({
        ...connection,
        animated: false,
        type: 'smoothstep',
        style: { stroke: strokeColor, strokeWidth: 2 },
      }, s.edges) as WorkflowEdge[],
      past: [...s.past.slice(-MAX_HISTORY), prev],
      future: [],
    }))
  },

  addNode: (node) => {
    const prev = snapshot(get())
    set((s) => ({
      nodes: [...s.nodes, node],
      past: [...s.past.slice(-MAX_HISTORY), prev],
      future: [],
    }))
  },

  updateNodeData: (id, data) => {
    set((s) => ({
      nodes: s.nodes.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    }))
  },

  selectNode: (id) => set({ selectedNodeId: id }),

  setWorkflowTitle: (title) => set({ workflowTitle: title }),

  setNodes: (nodes) => {
    const prev = snapshot(get())
    set((s) => ({ nodes, past: [...s.past.slice(-MAX_HISTORY), prev], future: [] }))
  },

  setEdges: (edges) => {
    const prev = snapshot(get())
    set((s) => ({ edges, past: [...s.past.slice(-MAX_HISTORY), prev], future: [] }))
  },

  undo: () => {
    const { past, nodes, edges } = get()
    if (past.length === 0) return
    const prev = past[past.length - 1]
    const current = snapshot({ nodes, edges })
    set((s) => ({
      nodes: prev.nodes,
      edges: prev.edges,
      past: s.past.slice(0, -1),
      future: [current, ...s.future].slice(0, MAX_HISTORY),
      selectedNodeId: null,
    }))
  },

  redo: () => {
    const { future, nodes, edges } = get()
    if (future.length === 0) return
    const next = future[0]
    const current = snapshot({ nodes, edges })
    set((s) => ({
      nodes: next.nodes,
      edges: next.edges,
      past: [...s.past, current].slice(-MAX_HISTORY),
      future: s.future.slice(1),
      selectedNodeId: null,
    }))
  },

  loadWorkflow: (nodes, edges) => {
    const prev = snapshot(get())
    set((s) => ({
      nodes,
      edges,
      past: [...s.past.slice(-MAX_HISTORY), prev],
      future: [],
      selectedNodeId: null,
    }))
  },

  reset: () => {
    const prev = snapshot(get())
    set((s) => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      past: [...s.past.slice(-MAX_HISTORY), prev],
      future: [],
    }))
  },
}))

// tiny nanoid-like id generator exported from store
export { nanoid }
