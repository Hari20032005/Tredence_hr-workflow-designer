import type { SimulateRequest, SimulateResponse, ExecutionStep } from '../types/api'

const NODE_TYPE_LABELS: Record<string, string> = {
  start: 'Start',
  task: 'Task',
  approval: 'Approval',
  automatedStep: 'Automated Step',
  end: 'End',
}

const NODE_MESSAGES: Record<string, (data: Record<string, unknown>) => string> = {
  start: (d) => `Workflow initiated: "${d.title || 'Untitled'}"`,
  task: (d) => `Task "${d.title || 'Untitled'}" assigned to ${d.assignee || 'unassigned'}`,
  approval: (d) => `Approval requested from ${d.approverRole || 'Manager'} — threshold: ${d.autoApproveThreshold ?? 0}%`,
  automatedStep: (d) => `Executing action: ${d.actionLabel || d.actionId || 'Unknown action'}`,
  end: (d) => `Workflow completed. ${d.endMessage || ''}`,
}

function topologicalSort(
  nodes: SimulateRequest['nodes'],
  edges: SimulateRequest['edges']
): string[] | null {
  const adj = new Map<string, string[]>()
  const inDegree = new Map<string, number>()

  for (const n of nodes) {
    adj.set(n.id, [])
    inDegree.set(n.id, 0)
  }

  for (const e of edges) {
    adj.get(e.source)?.push(e.target)
    inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1)
  }

  const queue = nodes.filter((n) => (inDegree.get(n.id) ?? 0) === 0).map((n) => n.id)
  const result: string[] = []

  while (queue.length > 0) {
    const nodeId = queue.shift()!
    result.push(nodeId)
    for (const neighbor of adj.get(nodeId) ?? []) {
      const deg = (inDegree.get(neighbor) ?? 0) - 1
      inDegree.set(neighbor, deg)
      if (deg === 0) queue.push(neighbor)
    }
  }

  return result.length === nodes.length ? result : null
}

export function runSimulation(request: SimulateRequest): SimulateResponse {
  const order = topologicalSort(request.nodes, request.edges)

  if (!order) {
    return {
      success: false,
      steps: [],
      totalDurationMs: 0,
      error: 'Cycle detected in workflow graph',
    }
  }

  const nodeMap = new Map(request.nodes.map((n) => [n.id, n]))
  const steps: ExecutionStep[] = []
  let elapsed = 0
  const startTime = new Date()

  for (const nodeId of order) {
    const node = nodeMap.get(nodeId)
    if (!node) continue
    const duration = 300 + Math.floor(Math.random() * 700)
    elapsed += duration
    const ts = new Date(startTime.getTime() + elapsed)

    const messageFn = NODE_MESSAGES[node.type]
    const message = messageFn ? messageFn(node.data) : `Processing ${node.type} node`

    steps.push({
      nodeId,
      nodeType: node.type,
      nodeTitle: (node.data.title as string) || NODE_TYPE_LABELS[node.type] || node.type,
      status: 'success',
      message,
      timestamp: ts.toISOString(),
      durationMs: duration,
    })
  }

  return {
    success: true,
    steps,
    totalDurationMs: elapsed,
  }
}
