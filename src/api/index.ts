import type { AutomationAction, SimulateRequest, SimulateResponse } from '../types/api'

export async function getAutomations(): Promise<AutomationAction[]> {
  const res = await fetch('/api/automations')
  if (!res.ok) throw new Error('Failed to fetch automations')
  return res.json()
}

export async function simulate(request: SimulateRequest): Promise<SimulateResponse> {
  const res = await fetch('/api/simulate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  if (!res.ok) throw new Error('Simulation failed')
  return res.json()
}
