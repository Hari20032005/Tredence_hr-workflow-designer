export interface AutomationAction {
  id: string
  label: string
  params: string[]
  description: string
}

export interface ExecutionStep {
  nodeId: string
  nodeType: string
  nodeTitle: string
  status: 'running' | 'success' | 'error' | 'skipped'
  message: string
  timestamp: string
  durationMs: number
}

export interface SimulateRequest {
  nodes: Array<{ id: string; type: string; data: Record<string, unknown> }>
  edges: Array<{ id: string; source: string; target: string }>
}

export interface SimulateResponse {
  success: boolean
  steps: ExecutionStep[]
  totalDurationMs: number
  error?: string
}
