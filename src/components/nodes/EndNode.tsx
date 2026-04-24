import type { NodeProps } from '@xyflow/react'
import { Flag } from 'lucide-react'
import { BaseNode } from './BaseNode'
import type { WorkflowNode, EndNodeData } from '../../types/nodes'

export function EndNode({ data, selected }: NodeProps<WorkflowNode>) {
  const d = data as EndNodeData

  return (
    <BaseNode
      selected={selected}
      hasSource={false}
      borderColor="border-rose-500"
      headerBg="bg-rose-500"
      icon={<Flag size={14} />}
      title="End"
      subtitle={d.endMessage || 'Workflow complete'}
    />
  )
}
