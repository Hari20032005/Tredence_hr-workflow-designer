import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import type { EndNodeData } from '../../types/nodes'
import { useWorkflowStore } from '../../store/workflowStore'
import { FormField, Textarea } from './shared/FormField'

interface Props {
  nodeId: string
  data: EndNodeData
}

export function EndNodeForm({ nodeId, data }: Props) {
  const { updateNodeData } = useWorkflowStore()
  const { register, watch } = useForm<EndNodeData>({ defaultValues: data })

  useEffect(() => {
    const sub = watch((values) => {
      updateNodeData(nodeId, values as Partial<EndNodeData>)
    })
    return () => sub.unsubscribe()
  }, [watch, nodeId, updateNodeData])

  return (
    <div className="space-y-4">
      <FormField label="Completion Message">
        <Textarea
          {...register('endMessage')}
          placeholder="e.g. Onboarding workflow completed successfully."
        />
      </FormField>

      <FormField label="Include Summary Report">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register('includeSummary')}
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-400"
          />
          <span className="text-sm text-slate-600">Generate summary on completion</span>
        </label>
      </FormField>
    </div>
  )
}
