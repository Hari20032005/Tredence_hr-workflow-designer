import { useCallback } from 'react'
import { useWorkflowStore } from '../store/workflowStore'
import { useSimulationStore } from '../store/simulationStore'
import { simulate } from '../api'
import { validateWorkflow } from '../utils/graphValidation'

export function useSimulation() {
  const { nodes, edges } = useWorkflowStore()
  const sim = useSimulationStore()

  const runSimulation = useCallback(async () => {
    const errors = validateWorkflow(nodes, edges)
    const hardErrors = errors.filter((e) => e.severity === 'error')

    sim.reset()
    sim.setErrors(errors)
    sim.open()

    if (hardErrors.length > 0) {
      sim.setStatus('error')
      return
    }

    sim.setStatus('running')

    try {
      const request = {
        nodes: nodes.map((n) => ({ id: n.id, type: n.data.type, data: n.data as Record<string, unknown> })),
        edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
      }

      const result = await simulate(request)
      sim.setSteps(result.steps)
      sim.setTotalDuration(result.totalDurationMs)
      sim.setVisibleSteps([])

      // Animate steps one-by-one AND highlight the active node on canvas simultaneously
      for (let i = 0; i < result.steps.length; i++) {
        sim.setActiveNodeId(result.steps[i].nodeId)
        await new Promise((r) => setTimeout(r, 450))
        sim.setVisibleSteps(result.steps.slice(0, i + 1))
      }

      sim.setActiveNodeId(null)
      sim.setStatus(result.success ? 'success' : 'error')
    } catch (e) {
      sim.setActiveNodeId(null)
      sim.setStatus('error')
      sim.setErrors([{ message: String(e), severity: 'error' }])
    }
  }, [nodes, edges, sim])

  return { runSimulation }
}
