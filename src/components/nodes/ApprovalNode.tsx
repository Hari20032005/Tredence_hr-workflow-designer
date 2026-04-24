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
      nodeId={id}
      selected={selected}
      borderColor="border-slate-200"
      headerBg="bg-amber-500"
      icon={<ShieldCheck size={13} />}
      title={d.title || 'Approval'}
      subtitle="Approval / Review step"
      errors={myErrors}
      stats={[
        { icon: '⚙', value: 1, color: 'border-slate-200 text-slate-500 bg-slate-50' },
        { icon: '🛡', value: d.approverRole ? 1 : 0, color: 'border-amber-200 text-amber-600 bg-amber-50' },
        { icon: '✓', value: d.autoApproveThreshold > 0 ? 1 : 0, color: 'border-emerald-200 text-emerald-600 bg-emerald-50' },
        { icon: '⚡', value: d.autoApproveThreshold, color: 'border-purple-200 text-purple-600 bg-purple-50' },
      ]}
    >
      {d.approverRole && (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] border border-amber-100">
          🛡 {d.approverRole}
        </span>
      )}
    </BaseNode>
  )
}
