import type { WorkflowNode, WorkflowEdge, ValidationError } from '../types/nodes'

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): ValidationError[] {
  const errors: ValidationError[] = []

  if (nodes.length === 0) {
    errors.push({ message: 'Workflow is empty. Add nodes to get started.', severity: 'error' })
    return errors
  }

  const startNodes = nodes.filter((n) => n.data.type === 'start')
  const endNodes = nodes.filter((n) => n.data.type === 'end')

  if (startNodes.length === 0) {
    errors.push({ message: 'Workflow must have exactly one Start node.', severity: 'error' })
  } else if (startNodes.length > 1) {
    startNodes.forEach((n) =>
      errors.push({ nodeId: n.id, message: 'Only one Start node is allowed.', severity: 'error' })
    )
  }

  if (endNodes.length === 0) {
    errors.push({ message: 'Workflow must have at least one End node.', severity: 'error' })
  }

  // Check required fields
  for (const node of nodes) {
    if (node.data.type === 'task' && !(node.data as { title?: string }).title?.trim()) {
      errors.push({ nodeId: node.id, message: 'Task node requires a title.', severity: 'error' })
    }
    if (node.data.type === 'automatedStep' && !(node.data as { actionId?: string }).actionId) {
      errors.push({ nodeId: node.id, message: 'Automated Step requires an action to be selected.', severity: 'warning' })
    }
  }

  // Check isolated nodes (no edges)
  const connectedIds = new Set<string>()
  for (const e of edges) {
    connectedIds.add(e.source)
    connectedIds.add(e.target)
  }

  for (const node of nodes) {
    if (!connectedIds.has(node.id) && nodes.length > 1) {
      errors.push({
        nodeId: node.id,
        message: `"${(node.data as { title?: string }).title || node.data.type}" node is not connected.`,
        severity: 'warning',
      })
    }
  }

  // Cycle detection with DFS
  if (hasCycle(nodes, edges)) {
    errors.push({ message: 'Workflow contains a cycle. Ensure edges flow in one direction.', severity: 'error' })
  }

  return errors
}

function hasCycle(nodes: WorkflowNode[], edges: WorkflowEdge[]): boolean {
  const adj = new Map<string, string[]>()
  for (const n of nodes) adj.set(n.id, [])
  for (const e of edges) adj.get(e.source)?.push(e.target)

  const visited = new Set<string>()
  const inStack = new Set<string>()

  function dfs(id: string): boolean {
    visited.add(id)
    inStack.add(id)
    for (const neighbor of adj.get(id) ?? []) {
      if (!visited.has(neighbor) && dfs(neighbor)) return true
      if (inStack.has(neighbor)) return true
    }
    inStack.delete(id)
    return false
  }

  for (const node of nodes) {
    if (!visited.has(node.id) && dfs(node.id)) return true
  }
  return false
}
