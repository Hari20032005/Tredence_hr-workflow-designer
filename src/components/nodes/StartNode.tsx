import type { NodeProps } from '@xyflow/react'
import { Play } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { WorkflowNode } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { validateWorkflow } from '../../utils/graphValidation'

export function StartNode({ data, selected, id }: NodeProps<WorkflowNode>) {
  const { nodes, edges } = useWorkflowStore()
  const allErrors = validateWorkflow(nodes, edges)
  const myErrors = allErrors.filter((e) => e.nodeId === id)
  const d = data as { title?: string }

  return (
    <BaseNode
      selected={selected}
      hasTarget={false}
      borderColor="border-emerald-500"
      headerBg="bg-emerald-500"
      icon={<Play size={14} />}
      title={d.title || 'Start'}
      subtitle="Workflow entry point"
      errors={myErrors}
    />
  )
}
