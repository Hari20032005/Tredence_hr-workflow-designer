import type { NodeProps } from '@xyflow/react'
import { PillNode } from './BaseNode'
import type { WorkflowNode, EndNodeData } from '../../types/nodes'

export function EndNode({ data, selected }: NodeProps<WorkflowNode>) {
  const d = data as EndNodeData
  return (
    <PillNode
      selected={selected}
      label={d.endMessage?.slice(0, 20) || 'End'}
      hasSource={false}
      hasTarget={true}
      color="border-rose-400 bg-rose-50 text-rose-700"
    />
  )
}
