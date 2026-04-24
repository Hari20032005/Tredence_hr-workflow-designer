import { http, HttpResponse } from 'msw'
import { MOCK_AUTOMATIONS } from '../api/automations'
import { runSimulation } from '../api/simulate'
import type { SimulateRequest } from '../types/api'

export const handlers = [
  http.get('/api/automations', () => {
    return HttpResponse.json(MOCK_AUTOMATIONS)
  }),

  http.post('/api/simulate', async ({ request }) => {
    const body = (await request.json()) as SimulateRequest
    await new Promise((r) => setTimeout(r, 400))
    const result = runSimulation(body)
    return HttpResponse.json(result)
  }),
]
