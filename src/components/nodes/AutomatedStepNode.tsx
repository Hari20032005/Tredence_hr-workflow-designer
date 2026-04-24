import type { NodeProps } from '@xyflow/react'
import { Zap } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { WorkflowNode, AutomatedStepNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { validateWorkflow } from '../../utils/graphValidation'

export function AutomatedStepNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { nodes, edges } = useWorkflowStore()
  const allErrors = validateWorkflow(nodes, edges)
  const myErrors = allErrors.filter((e) => e.nodeId === id)
  const d = data as AutomatedStepNodeData

  return (
    <BaseNode
      selected={selected}
      borderColor="border-purple-500"
      headerBg="bg-purple-500"
      icon={<Zap size={14} />}
      title={d.title || 'Automated Step'}
      errors={myErrors}
    >
      {d.actionLabel ? (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px]">
          ⚡ {d.actionLabel}
        </span>
      ) : (
        <span className="text-slate-400 text-[10px]">No action selected</span>
      )}
    </BaseNode>
  )
}
