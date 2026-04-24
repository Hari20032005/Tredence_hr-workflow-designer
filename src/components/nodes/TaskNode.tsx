import type { NodeProps } from '@xyflow/react'
import { ClipboardList } from 'lucide-react'
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
      nodeId={id}
      selected={selected}
      borderColor="border-slate-200"
      headerBg="bg-blue-500"
      icon={<ClipboardList size={13} />}
      title={d.title || 'Task'}
      subtitle={d.description || 'Human task'}
      errors={myErrors}
      stats={[
        { icon: '⚙', value: d.customFields?.length ?? 0, color: 'border-slate-200 text-slate-500 bg-slate-50' },
        { icon: '👤', value: d.assignee ? 1 : 0, color: 'border-blue-200 text-blue-600 bg-blue-50' },
        { icon: '✓', value: d.dueDate ? 1 : 0, color: 'border-emerald-200 text-emerald-600 bg-emerald-50' },
        { icon: '⚡', value: d.customFields?.length ?? 0, color: 'border-purple-200 text-purple-600 bg-purple-50' },
      ]}
    >
      {d.assignee && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] border border-blue-100">
          👤 {d.assignee}
        </span>
      )}
    </BaseNode>
  )
}
