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
  const paramCount = Object.keys(d.params ?? {}).filter((k) => d.params[k]).length

  return (
    <BaseNode
      nodeId={id}
      selected={selected}
      borderColor="border-slate-200"
      headerBg="bg-purple-500"
      icon={<Zap size={13} />}
      title={d.title || 'Automated Step'}
      subtitle="System-triggered action"
      errors={myErrors}
      stats={[
        { icon: '⚙', value: paramCount, color: 'border-slate-200 text-slate-500 bg-slate-50' },
        { icon: '⚡', value: d.actionId ? 1 : 0, color: 'border-purple-200 text-purple-600 bg-purple-50' },
        { icon: '✓', value: paramCount, color: 'border-emerald-200 text-emerald-600 bg-emerald-50' },
        { icon: '🔗', value: 1, color: 'border-blue-200 text-blue-600 bg-blue-50' },
      ]}
    >
      {d.actionLabel ? (
        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] border border-purple-100">
          ⚡ {d.actionLabel}
        </span>
      ) : (
        <span className="text-[10px] text-slate-400 italic">No action selected</span>
      )}
    </BaseNode>
  )
}
