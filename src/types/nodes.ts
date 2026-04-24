import type { Node, Edge } from '@xyflow/react'

export type NodeType = 'start' | 'task' | 'approval' | 'automatedStep' | 'end'

export interface KeyValuePair {
  id: string
  key: string
  value: string
}

export interface StartNodeData extends Record<string, unknown> {
  type: 'start'
  title: string
  metadata: KeyValuePair[]
}

export interface TaskNodeData extends Record<string, unknown> {
  type: 'task'
  title: string
  description: string
  assignee: string
  dueDate: string
  customFields: KeyValuePair[]
}

export interface ApprovalNodeData extends Record<string, unknown> {
  type: 'approval'
  title: string
  approverRole: 'Manager' | 'HRBP' | 'Director' | 'VP'
  autoApproveThreshold: number
}

export interface AutomatedStepNodeData extends Record<string, unknown> {
  type: 'automatedStep'
  title: string
  actionId: string
  actionLabel: string
  params: Record<string, string>
}

export interface EndNodeData extends Record<string, unknown> {
  type: 'end'
  endMessage: string
  includeSummary: boolean
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedStepNodeData
  | EndNodeData

export type WorkflowNode = Node<WorkflowNodeData>
export type WorkflowEdge = Edge

export interface ValidationError {
  nodeId?: string
  message: string
  severity: 'error' | 'warning'
}
