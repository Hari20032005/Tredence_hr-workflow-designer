import type { NodeProps } from '@xyflow/react'
import { ShieldCheck } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { WorkflowNode, ApprovalNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { validateWorkflow } from '../../utils/graphValidation'

export function ApprovalNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { nodes, edges } = useWorkflowStore()
  const allErrors = validateWorkflow(nodes, edges)
  const myErrors = allErrors.filter((e) => e.nodeId === id)
  const d = data as ApprovalNodeData

  return (
    <BaseNode
      selected={selected}
      borderColor="border-amber-500"
      headerBg="bg-amber-500"
      icon={<ShieldCheck size={14} />}
      title={d.title || 'Approval'}
      errors={myErrors}
    >
      {d.approverRole && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px]">
          🛡 {d.approverRole}
        </span>
      )}
      {d.autoApproveThreshold > 0 && (
        <p className="text-slate-400 text-[10px]">Auto-approve at {d.autoApproveThreshold}%</p>
      )}
    </BaseNode>
  )
}
