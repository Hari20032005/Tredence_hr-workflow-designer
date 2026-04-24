import type { WorkflowNode, WorkflowEdge } from '../types/nodes'

export interface SerializedWorkflow {
  version: '1.0'
  title: string
  nodes: WorkflowNode[]
  edges: WorkflowEdge[]
  exportedAt: string
}

export function exportWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  title: string
): void {
  const data: SerializedWorkflow = {
    version: '1.0',
    title,
    nodes,
    edges,
    exportedAt: new Date().toISOString(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.workflow.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importWorkflow(file: File): Promise<SerializedWorkflow> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as SerializedWorkflow
        if (!data.nodes || !data.edges) throw new Error('Invalid workflow file')
        resolve(data)
      } catch {
        reject(new Error('Failed to parse workflow file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
