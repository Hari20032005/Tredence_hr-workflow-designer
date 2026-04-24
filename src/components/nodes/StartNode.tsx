import type { NodeProps } from '@xyflow/react'
import { Play } from 'lucide-react'
import { PillNode } from './BaseNode'
import type { WorkflowNode } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { validateWorkflow } from '../../utils/graphValidation'

export function StartNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { nodes, edges } = useWorkflowStore()
  const allErrors = validateWorkflow(nodes, edges)
  const hasError = allErrors.some((e) => e.nodeId === id)
  const d = data as { title?: string }

  return (
    <div className="relative">
      <PillNode
        selected={selected}
        label={d.title || 'Start'}
        hasTarget={false}
        hasSource={true}
        color={hasError
          ? 'border-red-400 bg-red-50 text-red-700'
          : 'border-emerald-400 bg-emerald-50 text-emerald-700'
        }
      />
      {hasError && (
        <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-red-500 rounded-full border border-white" />
      )}
    </div>
  )
}
