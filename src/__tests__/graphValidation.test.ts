import { describe, it, expect } from 'vitest'
import { validateWorkflow } from '../utils/graphValidation'
import type { WorkflowNode, WorkflowEdge } from '../types/nodes'

// Helpers
function startNode(id = 's1'): WorkflowNode {
  return { id, type: 'start', position: { x: 0, y: 0 }, data: { type: 'start', title: 'Start', metadata: [] } }
}
function taskNode(id = 't1', title = 'My Task'): WorkflowNode {
  return { id, type: 'task', position: { x: 0, y: 100 }, data: { type: 'task', title, description: '', assignee: '', dueDate: '', customFields: [] } }
}
function endNode(id = 'e1'): WorkflowNode {
  return { id, type: 'end', position: { x: 0, y: 200 }, data: { type: 'end', endMessage: 'Done', includeSummary: false } }
}
function edge(source: string, target: string): WorkflowEdge {
  return { id: `${source}-${target}`, source, target }
}

describe('validateWorkflow', () => {
  it('returns error for empty workflow', () => {
    const errors = validateWorkflow([], [])
    expect(errors.some((e) => e.severity === 'error')).toBe(true)
  })

  it('passes a valid linear workflow', () => {
    const nodes = [startNode(), taskNode(), endNode()]
    const edges = [edge('s1', 't1'), edge('t1', 'e1')]
    const errors = validateWorkflow(nodes, edges).filter((e) => e.severity === 'error')
    expect(errors).toHaveLength(0)
  })

  it('errors when Start node is missing', () => {
    const nodes = [taskNode(), endNode()]
    const edges = [edge('t1', 'e1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.message.includes('Start node'))).toBe(true)
  })

  it('errors when End node is missing', () => {
    const nodes = [startNode(), taskNode()]
    const edges = [edge('s1', 't1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.message.includes('End node'))).toBe(true)
  })

  it('errors when multiple Start nodes exist', () => {
    const nodes = [startNode('s1'), startNode('s2'), taskNode(), endNode()]
    const edges = [edge('s1', 't1'), edge('s2', 't1'), edge('t1', 'e1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.message.includes('one Start'))).toBe(true)
  })

  it('errors on Task node with empty title', () => {
    const nodes = [startNode(), taskNode('t1', ''), endNode()]
    const edges = [edge('s1', 't1'), edge('t1', 'e1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.nodeId === 't1' && e.message.includes('title'))).toBe(true)
  })

  it('detects cycles', () => {
    const nodes = [startNode(), taskNode('t1'), taskNode('t2'), endNode()]
    // t1 → t2 → t1 is a cycle
    const edges = [edge('s1', 't1'), edge('t1', 't2'), edge('t2', 't1'), edge('t2', 'e1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.message.includes('cycle') || e.message.includes('Cycle'))).toBe(true)
  })

  it('warns on isolated nodes', () => {
    const nodes = [startNode(), taskNode('t1'), taskNode('t2'), endNode()]
    // t2 is not connected
    const edges = [edge('s1', 't1'), edge('t1', 'e1')]
    const errors = validateWorkflow(nodes, edges)
    expect(errors.some((e) => e.nodeId === 't2' && e.severity === 'warning')).toBe(true)
  })
})
