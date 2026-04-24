import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { AutomatedStepNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { useAutomations } from '../../hooks/useAutomations'
import { FormField, Input, Select } from './shared/FormField'
import { Loader2 } from 'lucide-react'

interface Props {
  nodeId: string
  data: AutomatedStepNodeData
}

export function AutomatedStepNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore()
  const { automations, loading } = useAutomations()
  const { register, watch, setValue } = useForm<AutomatedStepNodeData>({ defaultValues: data })

  const watchedActionId = watch('actionId')
  const selectedAction = automations.find((a) => a.id === watchedActionId)

  useEffect(() => {
    const sub = watch((values) => {
      updateNodeData(nodeId, values as Partial<AutomatedStepNodeData>)
    })
    return () => sub.unsubscribe()
  }, [watch, nodeId, updateNodeData])

  function handleActionChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const action = automations.find((a) => a.id === e.target.value)
    setValue('actionId', e.target.value)
    setValue('actionLabel', action?.label ?? '')
    setValue('params', {})
    updateNodeData(nodeId, {
      actionId: e.target.value,
      actionLabel: action?.label ?? '',
      params: {},
    })
  }

  return (
    <div className="space-y-4">
      <FormField label="Title">
        <Input {...register('title')} placeholder="e.g. Send Welcome Email" />
      </FormField>

      <FormField label="Action">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Loader2 size={14} className="animate-spin" /> Loading actions...
          </div>
        ) : (
          <Select
            value={watchedActionId || ''}
            onChange={handleActionChange}
            options={automations.map((a) => ({ value: a.id, label: a.label }))}
          />
        )}
        {selectedAction && (
          <p className="text-xs text-slate-400 mt-1">{selectedAction.description}</p>
        )}
      </FormField>

      {selectedAction && selectedAction.params.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Action Parameters
          </label>
          {selectedAction.params.map((param) => (
            <FormField key={param} label={param}>
              <Input
                placeholder={`Enter ${param}`}
                value={data.params?.[param] ?? ''}
                onChange={(e) => {
                  const newParams = { ...(data.params ?? {}), [param]: e.target.value }
                  setValue('params', newParams)
                  updateNodeData(nodeId, { params: newParams })
                }}
              />
            </FormField>
          ))}
        </div>
      )}
    </div>
  )
}
