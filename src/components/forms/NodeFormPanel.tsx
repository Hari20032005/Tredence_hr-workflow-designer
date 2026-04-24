import { X } from 'lucide-react'
import { useWorkflowStore } from '../../store/workflowStore'
import { StartNodeForm } from './StartNodeForm'
import { TaskNodeForm } from './TaskNodeForm'
import { ApprovalNodeForm } from './ApprovalNodeForm'
import { AutomatedStepNodeForm } from './AutomatedStepNodeForm'
import { EndNodeForm } from './EndNodeForm'
import type {
  StartNodeData,
  TaskNodeData,
  ApprovalNodeData,
  AutomatedStepNodeData,
  EndNodeData,
} from '../../types/nodes'

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start Node',
  task: 'Task Node',
  approval: 'Approval Node',
  automatedStep: 'Automated Step',
  end: 'End Node',
}

const NODE_COLORS: Record<string, string> = {
  start: 'bg-emerald-500',
  task: 'bg-blue-500',
  approval: 'bg-amber-500',
  automatedStep: 'bg-purple-500',
  end: 'bg-rose-500',
}

export function NodeFormPanel() {
  const { nodes, selectedNodeId, selectNode } = useWorkflowStore()
  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  if (!selectedNode) {
    return (
      <aside className="w-72 bg-white border-l border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-700">Node Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-center p-6">
          <div>
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🖱️</span>
            </div>
            <p className="text-sm text-slate-500">Click a node to edit its properties</p>
          </div>
        </div>
      </aside>
    )
  }

  const nodeType = selectedNode.data.type
  const colorClass = NODE_COLORS[nodeType] ?? 'bg-slate-500'

  return (
    <aside className="w-72 bg-white border-l border-slate-200 flex flex-col">
      <div className={`flex items-center justify-between px-4 py-3 text-white ${colorClass}`}>
        <h2 className="text-sm font-semibold">{NODE_TYPE_LABELS[nodeType] ?? nodeType}</h2>
        <button
          onClick={() => selectNode(null)}
          className="hover:bg-white/20 rounded p-0.5 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {nodeType === 'start' && (
          <StartNodeForm nodeId={selectedNode.id} data={selectedNode.data as StartNodeData} />
        )}
        {nodeType === 'task' && (
          <TaskNodeForm nodeId={selectedNode.id} data={selectedNode.data as TaskNodeData} />
        )}
        {nodeType === 'approval' && (
          <ApprovalNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as ApprovalNodeData}
          />
        )}
        {nodeType === 'automatedStep' && (
          <AutomatedStepNodeForm
            nodeId={selectedNode.id}
            data={selectedNode.data as AutomatedStepNodeData}
          />
        )}
        {nodeType === 'end' && (
          <EndNodeForm nodeId={selectedNode.id} data={selectedNode.data as EndNodeData} />
        )}
      </div>
    </aside>
  )
}
