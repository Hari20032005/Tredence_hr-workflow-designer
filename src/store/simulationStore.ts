import { create } from 'zustand'
import type { ExecutionStep } from '../types/api'
import type { ValidationError } from '../types/nodes'

type SimStatus = 'idle' | 'running' | 'success' | 'error'

interface SimulationState {
  isOpen: boolean
  status: SimStatus
  steps: ExecutionStep[]
  visibleSteps: ExecutionStep[]
  errors: ValidationError[]
  totalDurationMs: number
  activeNodeId: string | null  // highlights node on canvas during simulation

  open: () => void
  close: () => void
  setStatus: (s: SimStatus) => void
  setSteps: (steps: ExecutionStep[]) => void
  setVisibleSteps: (steps: ExecutionStep[]) => void
  setErrors: (errors: ValidationError[]) => void
  setTotalDuration: (ms: number) => void
  setActiveNodeId: (id: string | null) => void
  reset: () => void
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isOpen: false,
  status: 'idle',
  steps: [],
  visibleSteps: [],
  errors: [],
  totalDurationMs: 0,
  activeNodeId: null,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setStatus: (status) => set({ status }),
  setSteps: (steps) => set({ steps }),
  setVisibleSteps: (visibleSteps) => set({ visibleSteps }),
  setErrors: (errors) => set({ errors }),
  setTotalDuration: (totalDurationMs) => set({ totalDurationMs }),
  setActiveNodeId: (activeNodeId) => set({ activeNodeId }),
  reset: () => set({ status: 'idle', steps: [], visibleSteps: [], errors: [], totalDurationMs: 0, activeNodeId: null }),
}))
