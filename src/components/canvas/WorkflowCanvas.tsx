import { useCallback, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useReactFlow,
  Panel,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useWorkflowStore, nanoid } from '../../store/workflowStore'
import { nodeTypes } from '../nodes/nodeTypes'
import type { WorkflowNode, WorkflowNodeData, NodeType } from '../../types/nodes'
import { LayoutGrid } from 'lucide-react'
import { getAutoLayout } from '../../utils/autoLayout'

const DEFAULT_NODE_DATA: Record<NodeType, WorkflowNodeData> = {
  start: { type: 'start', title: 'Start', metadata: [] },
  task: { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approval: { type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
  automatedStep: { type: 'automatedStep', title: 'Automated Step', actionId: '', actionLabel: '', params: {} },
  end: { type: 'end', endMessage: 'Workflow completed.', includeSummary: false },
}

export function WorkflowCanvas() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectNode,
    setNodes,
  } = useWorkflowStore()
  const { screenToFlowPosition, fitView } = useReactFlow()

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/reactflow') as NodeType
      if (!type) return

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })

      const newNode: WorkflowNode = {
        id: nanoid(),
        type,
        position,
        data: { ...DEFAULT_NODE_DATA[type] } as WorkflowNodeData,
      }

      addNode(newNode)
    },
    [screenToFlowPosition, addNode]
  )

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  function handleAutoLayout() {
    const laid = getAutoLayout(nodes, edges)
    setNodes(laid)
    setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50)
  }

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => selectNode(node.id)}
        onPaneClick={() => selectNode(null)}
        deleteKeyCode={['Backspace', 'Delete']}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        defaultEdgeOptions={{
          style: { stroke: '#3b82f6', strokeWidth: 2 },
          animated: false,
          type: 'smoothstep',
        }}
        connectionLineStyle={{ stroke: '#6366f1', strokeWidth: 2, strokeDasharray: '5,5' }}
        connectionLineType={'smoothstep' as never}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
        <Controls className="!border-slate-200 !bg-white !shadow-md" />
        <MiniMap
          className="!border-slate-200 !bg-white"
          nodeColor={(node) => {
            const colorMap: Record<string, string> = {
              start: '#10b981',
              task: '#3b82f6',
              approval: '#f59e0b',
              automatedStep: '#a855f7',
              end: '#f43f5e',
            }
            return colorMap[node.type ?? ''] ?? '#94a3b8'
          }}
          maskColor="rgba(248,250,252,0.7)"
        />
        <Panel position="bottom-center">
          <button
            onClick={handleAutoLayout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow text-xs text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <LayoutGrid size={12} /> Auto Layout
          </button>
        </Panel>
      </ReactFlow>
    </div>
  )
}
