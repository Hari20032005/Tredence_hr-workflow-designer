import type { NodeProps } from '@xyflow/react'
import { CheckSquare } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { WorkflowNode, TaskNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { validateWorkflow } from '../../utils/graphValidation'

export function TaskNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { nodes, edges } = useWorkflowStore()
  const allErrors = validateWorkflow(nodes, edges)
  const myErrors = allErrors.filter((e) => e.nodeId === id)
  const d = data as TaskNodeData

  return (
    <BaseNode
      selected={selected}
      borderColor="border-blue-500"
      headerBg="bg-blue-500"
      icon={<CheckSquare size={14} />}
      title={d.title || 'Task'}
      errors={myErrors}
    >
      {d.assignee && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px]">
          👤 {d.assignee}
        </span>
      )}
      {d.dueDate && <p className="text-slate-400 text-[10px]">Due: {d.dueDate}</p>}
      {d.description && <p className="text-slate-400 line-clamp-1">{d.description}</p>}
    </BaseNode>
  )
}
